const { read } = require("node:fs")
const fs = require("node:fs/promises")
// ;(async () => {
//   console.time("copy")
//   const destFile = await fs.open("text-copy.txt", "w")
//   const result = await fs.readFile("test.txt")

//   destFile.write(result)
//   console.timeEnd("copy")
// })()

;(async () => {
  console.time("copy")

  const srcFile = await fs.open("test.txt", "r")
  const destFile = await fs.open("text-copy.txt", "w")

  let bytesRead = -1

  while (bytesRead !== 0) {
    const readResult = await srcFile.read()
    bytesRead = readResult.bytesRead

    if (bytesRead !== 16384) {
      const indexOfNotFilled = readResult.buffer.indexOf(0)
      const newBuffer = Buffer.alloc(indexOfNotFilled)

      readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled)
      destFile.write(newBuffer)
    } else {
      destFile.write(readResult.buffer)
    }
  }

  console.timeEnd("copy")
})()
