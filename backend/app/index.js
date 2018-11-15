const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const uuid = require('uuid/v4')
const REPL = require('@rchain-community/repl')
const Tail = require('tail').Tail
const Queue = require('better-queue')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cors = require('cors');
const path = require('path')
const fs = require('fs')


// Local libs
const FileReader = require('./lib/FileReader')

// Load static resources
const files = FileReader.readFiles()

// Middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// CORS support for express API endpoints
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: function setHeaders(res, path, stat) {
        // Additional headers are needed to provide CORS support
        // for serving static files
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Methods', 'POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    }
}))
app.use(cors({origin: true}))
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: function setHeaders(res, path, stat) {
        // Additional headers are needed to provide CORS support
        // for serving static files
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    }
}))

// Ensure /tmp/rnode exists
try {
    fs.mkdirSync('/tmp/rnode')
} catch (e) {
}
try {
    fs.unlinkSync('/tmp/rnode/rspace/data.mdb')
    fs.unlinkSync('/tmp/rnode/rspace/lock.mdb')
} catch (e) {
}

// Set up gRPC connection
const repl = new REPL()
let version = null
let executions = null
let logs = []

// Execution ID generator
const genId = () => {
    return 'ex_' + uuid().replace(/-/g, '')
}


// generate ID
const generateId = () => {
    return uuid().replace(/-/g, '')
}


// Set up queue
const queue = new Queue((input, cb) => {
    console.log('running queue', input.data)

    const code = 'new stdout(`rho:io:stdout`), stderr(`rho:io:stderr`), ' +
        'stdoutAck(`rho:io:stdoutAck`) in { ' + input.data.body + ' }'

    input.socket.emit('output.clean')
    if (version) {
        input.socket.emit('output.append', [version, 'version'])
    }

    repl.eval(code)
        .then((val) => {
            console.log(val)
            input.socket.emit('output.append', [val, 'storage contents'])
            cb()
        })
        .catch((e) => {
            input.socket.emit('output.append', [(e.message || e), 'error'])
            cb()
        })
}, {maxTimeout: 10000})

// Node version
app.get('/v1/node/version', (req, res) => {
    res.json({
        version: version || 'unknown'
    })
})

// Node log
app.get('/v1/node/log', (req, res) => {
    res.json({
        log: logs
    })
})

// Used by load balancer to check application health
app.get('/v1/node/health', (req, res) => {
    try {
        repl.eval('0')
            .then((val) => val.indexOf('Storage Contents') >= 0
                ? res.send('ok')
                : res.status(500).send('error: ' + val))
            .catch((e) => res.status(500).send('error: ' + (e.message || e)))
    } catch (e) {
        res.status(500).send('error: ' + (e.message || e))
    }
})


// API Endpoint for serving example files to the frontend
app.get('/example-files', function (req, res) {
    res.json(files)
})


const evalutations_folder = "evaluations/"
const globalLogFile = evalutations_folder + "output.log"
let content = ""
let rholangFile = ""
let localLogFile = ""


app.post("/v1/node/eval", function (request, response) {
    let exec = require('child_process').exec
    let localUUID = generateId()

    let code = 'new stdout(`rho:io:stdout`) in {' +
        'new stdoutAck(`rho:io:stdoutAck`) in {\n\n' + request.body.code + '\n\n } }'


    rholangFile = evalutations_folder + localUUID + ".rho"
    localLogFile = evalutations_folder + localUUID + ".log"


    fs.writeFile(rholangFile, code, 'utf8', function () {
        console.log(code)
    })

    console.log("rnode eval " + rholangFile + " > " + localLogFile)
    exec("rnode eval " + rholangFile + " > " + localLogFile, (err, stdout, stderr) => {
        if (err) {
            console.log(`Eval failed stdout: ${stdout}`);
            console.log(`Eval failed: stderr: ${stderr}`);
            return
        }

        returnObj = {}

        let data = fs.readFileSync(localLogFile, 'utf-8')
        if (data.toLowerCase().indexOf('error') >= 0) {
            // Errors in the code
            returnObj.evaluating = 'Error'
            returnObj.output = data.toLowerCase().split('error')[1]
        } else {
            returnObj.storageContents = data.split('Storage Contents:')[1]//.split('\u0001\u0000')[0].trim()
            returnObj.deploymentCost = data.split('\n')[3]

            data = fs.readFileSync(globalLogFile, 'utf-8')

            let evalSplit = data.split("Evaluating:")[data.split("Evaluating:").length - 1] //optimise

            returnObj.evaluating = evalSplit.split('\n}')[0] + '\n}'
            returnObj.output = evalSplit.split('\n}')[1]//.split('Result for')[0].split('\u0001\u0000')[0].trim()

            console.log(data)
        }

        console.log(returnObj)
        response.setHeader('Content-Type', 'application/json')
        response.send(JSON.stringify(returnObj))
    })


})

function finishTail(data, response) {
    globalLogTail.unwatch()
    localLogTail.unwatch()
    returnObj = {}
    console.log(data)
    if (data.toLowerCase().indexOf('error') >= 0) {
        // Errors in the code
        returnObj.evaluating = 'Error'
        returnObj.output = data.toLowerCase().split('error')[1]
    } else {
        let evalSplit = data.split('Evaluating:')[1]
        returnObj.evaluating = evalSplit.split('\n}')[0] + '\n}'
        returnObj.output = evalSplit.split('\n}')[1].split('Result for')[0].split('\u0001\u0000')[0].trim()
        returnObj.storageContents = data.split('Storage Contents:')[1].split('\u0001\u0000')[0].trim()
    }

    console.log(returnObj)
    response.setHeader('Content-Type', 'application/json')
    response.send(JSON.stringify(returnObj))
}

// Socket.io logic
io.on('connection', function (socket) {
    console.log('a user connected')

    socket.on('run', function (data) {
        // ask client to clean output
        socket.emit('output.clean')
        if (queue.length) {
            let output = 'Added as item ' + (queue.length + 1) + ' to the queue...'
            if (queue.length > 5) {
                output += '\n(this might take a few seconds)'
            }
            socket.emit('output.append', [output, 'queued'])
        }

        console.log('queue.length: ' + queue.length)

        queue.push({
            data: data,
            socket: socket
        })
    })
})

const port = process.env.PORT || 80
server.listen(port)
console.log('server started on port', port)

// Garbage collection
setInterval(() => {
    // Only keep last 100 log lines
    logs.splice(0, logs.length - 100)

    // Remove old executions (>10 secs)
    for (let id in executions) {
        if (!executions.hasOwnProperty(id)) {
            continue
        }
        if (executions[id].startTime < Date.now() - 10000) {
            delete executions[id]
        }
    }
}, 72000)
