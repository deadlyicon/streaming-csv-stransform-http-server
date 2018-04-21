const fs = require('fs')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./server')

chai.use(chaiHttp)
const expect = chai.expect

!async function test(){

  const response = await chai.request(server)
    .post('/transform-csv')
    .attach(
      'colors.csv',
      fs.readFileSync('colors.csv'),
      'colors.csv'
    )
    .buffer()
    .parse((res, done)=>{
      // let data = ''
      res.on("data", function (chunk) {
        console.log({
          chunk: chunk.toString(),
        })
      });
      res.on("end", function () {
        done(null);
      });
    })

  // console.log(response)

}();
