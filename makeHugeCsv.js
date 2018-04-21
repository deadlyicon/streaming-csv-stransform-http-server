var csv = require('csv')
const fs = require('fs')
const length = parseInt(process.argv[2], 10)
const filename = process.argv[3]
const file = fs.createWriteStream(filename)
const generator = csv.generate({length})
generator.pipe(file)
