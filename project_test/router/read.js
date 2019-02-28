module.exports = function(app){//함수로 만들어 객체 app을 전달받음
var express = require('express');
var router = express.Router();
var request = require('request');

var security = require('../security/key.js');  
var encrypt = require('../security/encrypt.js');  


router.all('/readMail',function(req,res){
      console.log("read")
        var IDT = req.query.IDT;
        var consumerKey = security.getConsumerKey();
        var algorithm = security.getAlgorithm();
        var key = security.getKey();
        var encryptedCode = req.signedCookies[IDT];
        var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);
        
        
        var url = "https://apis.worksmobile.com/r/kr1TuMWNTgraw/mail/v1/getMail?mailSN=";
        url += req.query.mailSN;
        var hostname = '10.112.74.229';
        
        var options = {
         url : url,
         headers : {
            ConsumerKey : consumerKey,
            Authorization : decoded,
          },
        hostname : hostname,
    }
     
     request.get(options, function optionalCallback(err, httpResponse, body) {
     
         if (err) {
             return console.error('failed:', err);
     
         }
     
        var data = JSON.parse(httpResponse.body);
       // res.render('read',{folderInfoView:folderInfo,mailDataView:data,IDT:IDT});
       res.render("partial_read",{mailDataView:data,IDT:IDT}, function(e, dt) {
        res.json(dt);
      });
  });
});
      
router.get('/getAttach',function(req,res){

        var IDT = req.query.IDT;
        var consumerKey = security.getConsumerKey();
        var algorithm = security.getAlgorithm();
        var key = security.getKey();
        var encryptedCode = req.signedCookies[IDT];
        var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);
        
        var url = "https://apis.worksmobile.com/kr1TuMWNTgraw/mail/downloadAttach?mailSN=" + req.query.mailSN + "&attachIndex=" + req.query.attachIndex;

        var options = {
          url : url,
          headers : {
              ConsumerKey : consumerKey,
              Authorization : decoded,
           },
        };      
      
        request.post(options, function optionalCallback(err, httpResponse, body) {
      
          if (err) {
              return console.error('failed:', err);
          }      
          console.log('downloading');
       
          var answer = JSON.parse(body);
          let dFile = Buffer.from(answer.data.data, 'base64');
      
          var changeFilename= encodeURI(req.query.filename);
          console.log(changeFilename);
          res.setHeader('Content-disposition', 'attachment; filename=' + changeFilename);
          res.setHeader('Content-type', req.query.contentType);
      
          res.send(dFile);
          });
      });
   
	return router;	//라우터를 리턴
};


