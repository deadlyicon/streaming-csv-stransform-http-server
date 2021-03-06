const path = require('path')
const express = require('express')
// const multiparty = require("multiparty")
const formData = require('express-form-data')
const csv = require('csv')
const csvTransform = require('stream-transform')


const server = express()

server.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <form action="/transform-csv" method="post" enctype="multipart/form-data">
          <input type="file" name="thecsvfile" />
          <input type="submit" value="transform my csv"/>
        </form>
      </body>
    </html>

  `)
})

const transformCsvRow = (row, callback) => {
  // console.log('csvTransformer', row)
  process.stdout.write('.')

  setImmediate(function(){
    const newRow = row.map(column => column.toUpperCase())
    callback(null, newRow)
  })
}


server.use('/transform-csv', formData.parse({
  autoFiles: true,
  uploadDir: path.resolve(__dirname, 'tmp')
}))
server.use('/transform-csv', formData.format())
server.use('/transform-csv', formData.stream())
// server.use('/transform-csv', formData.union());

server.post('/transform-csv', (req, res) => {
  console.log('REQUEST START')
  const csvParser = csv.parse()
  const csvStringifier = csv.stringify()
  const csvTransformer = csvTransform(transformCsvRow)

  const file = req.files.thecsvfile
  console.log(file)
  res.attachment(file.filename || file.name)
  file
    .pipe(csvParser)
    .pipe(csvTransformer)
    .pipe(csvStringifier)
    .pipe(res)

  // const form = new multiparty.Form()

  // form.on('part', part => {
  //   if (part.filename) {
  //     res.attachment(part.filename)
  //     part.on("error", function(error){
  //       console.log('PART ERROR', error)
  //       process.exit(1)
  //     })
  //     // part
  //     //   .pipe(process.stdout)

  //     part
  //       .pipe(require('debug-stream')('csv-upload')())
  //       // .pipe(csvParser)
  //       // .on('error', function(error){
  //       //   console.log('PIPE ERROR 1', error)
  //       //   process.exit(1)
  //       // })
  //       // .pipe(csvTransformer)
  //       // .on('error', function(error){
  //       //   console.log('PIPE ERROR 2', error)
  //       //   process.exit(1)
  //       // })
  //       // .pipe(csvStringifier)
  //       // .on('error', function(error){
  //       //   console.log('PIPE ERROR 3', error)
  //       //   process.exit(1)
  //       // })
  //       .pipe(res)
  //       .on('error', function(error){
  //         console.log('PIPE ERROR 4', error)
  //         process.exit(1)
  //       })
  //       .on('finish', function(error){
  //         console.log('\nPIPE finish')
  //       })
  //       .on('end', function(error){
  //         console.log('\nPIPE end')
  //       })
  //   }else{
  //     part.resume()
  //   }
  //
  // })

  // form.on('file', function(name,file) {
  //     //stream it to localhost:4000 with same name
  //     res.attachment(name)
  //     fs.createReadStream(file.path)
  //       .pipe(res)

  //     console.log(file.path);
  // });

  // form.on("error", function(error){
  //   console.log('ERROR', error)
  //   process.exit(1)
  // })

  // form.parse(req)
})

// server.listen(process.env.PORT)

module.exports = server
