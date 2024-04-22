const fs = require("node:fs/promises")

const streamFunc = async () => {
  console.time("writeMany")
  const fileHandle = await fs.open("test.txt", "w")

  const stream = fileHandle.createWriteStream()
  let i = 0
  const writeMany = () => {
    while (i < 1000000) {
      const buff = Buffer.from(` ${i} `, "utf-8")
      if (i === 999999) {
        // last write to our internal buffer of stream
        return stream.end(buff)
      }
      //stream.write(buff) // back-pressuring
      if (!stream.write(buff)) break
      i++
    }
  }
  writeMany()

  // resume writing to internal buffer after draining it from stream.
  stream.on("drain", () => {
    writeMany()
  })

  stream.on("finish", () => {
    console.timeEnd("writeMany")
    fileHandle.close()
  })
}
streamFunc()
