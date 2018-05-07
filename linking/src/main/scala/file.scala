trait FileRd {
  def getName(): String
  def isFile(): Boolean
  def isDirectory(): Boolean
  def exists(): Boolean
  def listFiles(): Iterable[FileRd]
  def joinPath(p: String): FileRd
  def openRd(): InStream
}

trait InStream {
  def getLines(): Iterable[String]
}

trait FileWr {
  def ro(): FileRd
  def withExt(ext: String): FileWr
  def joinPath(p: String): FileWr
  def openWr(): OutStream
}

trait OutStream {
  def println(out: String)
  def close()
}


class JsRd(fs: scalajs.js.Dynamic, path: String) extends FileRd {
  import scalajs.js
  import js.Dynamic.{global => g}
  private val npath = g.require("path")

  def getName() = path
  def isDirectory() = fs.statSync(path).isDirectory().asInstanceOf[Boolean]
  def isFile() = fs.statSync(path).isFile().asInstanceOf[Boolean]
  def openRd() = new InStream {
    private val s = fs.readFileSync(path, "utf8").asInstanceOf[String]
    def getLines() = s.split('\n')
  }
  def exists() = fs.existsSync(path).asInstanceOf[Boolean]
  def joinPath(other: String) = new JsRd(fs, npath.join(path, other).asInstanceOf[String])
  def listFiles() = fs.readdirSync().asInstanceOf[js.Array[String]].map(joinPath)
}


class JsWr(fs: scalajs.js.Dynamic, path: String) extends FileWr {
  import scalajs.js
  import js.Dynamic.{global => g}
  private val npath = g.require("path")

  def ro() = new JsRd(fs, path)
  def joinPath(other: String) = new JsWr(fs, npath.join(path, other).asInstanceOf[String])
  def withExt(ext: String) = new JsWr(fs, path + ext)
  def openWr() = new OutStream {
    val fd = fs.openSync(path, "w")
    def close() = fs.closeSync(fd)
    def println(s: String) = fs.writeSync(fd, s)
  }
}
