
const sourceFolder = './public/examples';
const walk = require('walk');
const fs = require('fs');



class FileReader{

    /*
        Read files that have been served in the public folder
        on the server side. Filenames are later passed to the
        frontend and they are accessed via AJAX.
    */

    static readFiles(){
        var files = [];
        var options = {
            listeners: {
                file: function(root, stat, next){
                    files.push(root + '/' + stat.name);
                    next();
                }
            },
            followLinks: false
        }
        var walker = walk.walkSync(sourceFolder, options);

        return files;

    }
}

module.exports = FileReader