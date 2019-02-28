module.exports = function(app){//함수로 만들어 객체 app을 전달받음
var express = require('express');
var router = express.Router();
var request = require('request');

var security = require('../security/key.js');  
var encrypt = require('../security/encrypt.js');  

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

router.all('/setMark',function(req,res){

  console.log('make star');
  console.log(req.body);
 
  var IDT = req.body.IDT;
  var consumerKey = security.getConsumerKey();
  var algorithm = security.getAlgorithm();
  var key = security.getKey();
  var encryptedCode = req.signedCookies[IDT];
  var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);

  var MSNList = req.body.msn;
  var status = req.body.status;

    url ="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/setMarkStatus?mailSNList=" + MSNList + "&status="+status;
  
    var formData = {
      url:url,
        headers:{   // 통일..
          ConsumerKey : consumerKey,
          Authorization : decoded,
        }
    };   
  
    request.get(formData, function optionalCallback(err, httpResponse, body) {
       
      if (err) {
          return console.error('failed:', err);
      }
  
      let decoded = body;
      console.log(decoded);
      res.json(decoded);
    });
    
  });  
  
  router.post('/setRead',function(req,res){

    console.log('make read/unread');
    console.log(req.body);
 
      var IDT = req.body.IDT;
      var consumerKey = security.getConsumerKey();
      var algorithm = security.getAlgorithm();
      var key = security.getKey();
      var encryptedCode = req.signedCookies[IDT];
      var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);

      var MSNList = req.body.msn;
      var status = req.body.status;
  
    url ="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/setReadStatus?mailSNList=" + MSNList + "&status="+status;
    
    var formData = {
      url:url,
        headers:{
          ConsumerKey : consumerKey,
          Authorization : decoded,
      }
    };
  request.get(formData, function optionalCallback(err, httpResponse, body) {
     
      if (err) {
          return console.error('failed:', err);
      }
  
      let decoded = body;
      console.log(decoded);
      res.json(decoded);
      });
  });
    
  router.post('/delete',function(req,res){

    console.log('lets delete');
    console.log(req.body);
    
    var IDT = req.body.IDT;
    var consumerKey = security.getConsumerKey();
    var algorithm = security.getAlgorithm();
    var key = security.getKey();
    var encryptedCode = req.signedCookies[IDT];
    var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);

    url = "https://apis.worksmobile.com/kr1TuMWNTgraw/mail/removeMail?mailSNList=";
    url+=req.body.msn;
     
    var formData = {
        url:url,
        headers:{
          ConsumerKey : consumerKey,
          Authorization : decoded,
        }
    };
    // mail 삭제
    request.post(formData, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('failed:', err);
           }

      var pageNum = req.body.currPage;
      var firstPage = req.body.firstPage;
    
      var foldNum = {
        "FN": req.body
      }
    
      // MailList 호출 
      var url="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/getMailList?folderSN="+foldNum.FN.foldNum;
      url+="&page="+ pageNum;
      
      var options = {    
       url : url,
       headers : {
        ConsumerKey : consumerKey,
        Authorization : decoded,
      },
    }
      request.get(options, function optionalCallback(err, httpResponse, body) {
    
       if (err) {
           return console.error('failed:', err);
    
       }
       var data = JSON.parse(httpResponse.body);
       var  mailInfo = data;
    
      res.render("partial_mailList",{folderInfoView:folderInfo, mailInfoView:mailInfo, foldNumber:foldNum, firstPage:firstPage,IDT:IDT,action:"List"}, function(e, dt) {     // Send the compiled HTML as the response
          res.json(dt);
     });
    });
    }); 
  });
	return router;	//라우터를 리턴
};


