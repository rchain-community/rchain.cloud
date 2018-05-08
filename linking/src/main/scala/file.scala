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


import io.scalajs.nodejs.fs
import io.scalajs.nodejs.path.Path

class JsRd(anFs: fs.Fs, path: String) extends FileRd {
  def getName() = path
  def isDirectory() = anFs.statSync(path).isDirectory()
  def isFile() = anFs.statSync(path).isFile()
  def openRd() = new InStream {
    private val s = anFs.readFileSync(path, "utf8")
    def getLines() = s.split('\n')
  }
  def exists() = {
    anFs.existsSync(path)
  }
  def joinPath(other: String) = new JsRd(anFs,
    if (Path.isAbsolute(other)) { other } else { Path.join(path, other) })
  def listFiles() = anFs.readdirSync(path).map(joinPath _)
}


class JsWr(anFs: fs.Fs, path: String) extends FileWr {
  def ro() = new JsRd(anFs, path)
  def joinPath(other: String) = new JsWr(anFs,
    if (Path.isAbsolute(other)) { other } else { Path.join(path, other) })
  def withExt(ext: String) = new JsWr(anFs, path + ext)
  def openWr() = new OutStream {
    val fd = anFs.openSync(path, "w")
    def close() = anFs.closeSync(fd)
    def println(s: String) = anFs.writeSync(fd, s)
  }
}
