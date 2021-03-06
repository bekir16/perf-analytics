const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')

app.use(express.json())
app.use('/static', express.static('public'))
app.use(cors())

var pgp = require('pg-promise')(/* options */)
var db = pgp('postgres://postgres:12345@34.65.238.164:5432/performance')

const setResponseData = (data) => {
    const ttfbList=[]
    const fcpList = []
    const domLoadList = []
    const windowLoadList = []
    data[0].forEach(el => {
        ttfbList.push(el.ttfb)
        fcpList.push(el.fcp)
        domLoadList.push(el.dom_load)
        windowLoadList.push(el.window_load_events)      
    })
    return {ttfbList,fcpList,domLoadList,windowLoadList}
}

app.get('/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.multi('SELECT * FROM performance_metrics')
  .then(function (data) {
    res.send(setResponseData(data))
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
})

app.post('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  const {ttfb,fcp,domload,windowLoadEvents} = req.body
    db.none('INSERT INTO performance_metrics(ttfb,fcp,dom_load,window_load_events,time) VALUES(${ttfb},${fcp},${dom_load},${window_load_events},${time})',{ttfb,fcp,dom_load:domload,window_load_events:windowLoadEvents,time:new Date()})
    .then(function (data) {
        res.send(data)
      })
      .catch(function (error) {
        console.log('ERROR:', error)
      })
  })

app.listen((process.env.PORT || port), () => {
  console.log(`Example app listening at https://bba-performance-analytics.herokuapp.com`)
})