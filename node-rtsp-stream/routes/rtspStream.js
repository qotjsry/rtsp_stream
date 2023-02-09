express = require('express');
Stream = require('node-rtsp-stream');
const nodePortScanner = require('node-port-scanner');

var router = express.Router();
var flag = true;
var stream = null;


router.post('/', function(req, res, next) {
  var rtspObj = {};
  rtspObj.url = req.body.rtspUrl;
  rtspObj.port = req.body.streamingPort;
  rtspObj.ip = req.body.streamingIp;
  rtspObj.stream = null;
  rtspObj.lastData = null ;
  rtspObj.intervalId = 0 ;
  rtspObj.delay = 0;
  
  nodePortScanner(rtspObj.ip, [parseInt(rtspObj.port)])
  .then(results => {  
    console.log(results);
    if(results.ports.open.length == 0){
      console.log("openStream::::"+rtspObj.port);
      oepnStream(rtspObj);
      console.log("setInterval::::");
        var timer = setInterval(function(obj){
        flag = false;
        obj.intervalId = timer
          var today = new Date();
          if(obj.lastData !== undefined){
            var stream_data = new Date(obj.lastData);
            var emptyTime = (today.getTime() - stream_data.getTime())/1000;
            console.log(obj.stream.wsServer.clients.size);
            console.log(obj.url);
            
            if(emptyTime >= 10){
              obj.stream.stop();
              oepnStream(obj);
            }
          }
           if(obj.stream.wsServer.clients.size == 0){
            obj.delay++;
            if(obj.delay > 5){
              obj.stream.stop();
              clearInterval(obj.intervalId);
             }
           }        
        },1000,rtspObj)
    }
  })
  .catch(error => {
    console.log(error);
  });
   
    res.json(stream);
});

function oepnStream(obj){
  console.log("stream open!!");
  stream = new Stream({
    name: 'name',
    streamUrl: obj.url,
    wsPort: obj.port,
    ffmpegOptions: { // options ffmpeg flags
      '-stats': '', // an option with no neccessary value uses a blank string
      '-r': 30 // options with required values specify the value after the key
    }
  })
  console.log("stream success!!");
  obj.stream = stream;

  stream.mpeg1Muxer.on('ffmpegStderr', (data)=>{
    var today = new Date();
    obj.lastData = today;
  })

  //stream.on
}

module.exports = router;
