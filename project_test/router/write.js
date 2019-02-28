module.exports = function(app){//함수로 만들어 객체 app을 전달받음
	var express = require('express');
    var router = express.Router();
    
    var request = require('request');
    var multer  = require('multer');
    var storage = multer.memoryStorage()
    var upload = multer({ storage: storage })   

    var security = require('../security/key.js');  
    var encrypt = require('../security/encrypt.js');  
       
     function replaceAll(str, searchStr, replaceStr) {
        return str.split(searchStr).join(replaceStr);
    }

	router.get('/write',function(req,res){
   
        var IDT = req.query.IDT;
        var consumerKey = security.getConsumerKey();
        var algorithm = security.getAlgorithm();
        var key = security.getKey();
        var encryptedCode = req.signedCookies[IDT];
        var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);
    
        console.log('to writing page');

        res.render("partial_write",{IDT:IDT,action:"Write"}, function(e, dt) {
          // Send the compiled HTML as the response
          res.json(dt);
        });
});
           
router.post('/writeMail',upload.any(), function(req, res){   
    
        var IDT = req.query.IDT;
        var consumerKey = security.getConsumerKey();
        var algorithm = security.getAlgorithm();
        var key = security.getKey();
        var encryptedCode = req.signedCookies[IDT];
        var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);

        console.log("File attatchment");

        var newContents = replaceAll(req.body.subject,"\n","<br />");
        var url = "https://apis.worksmobile.com/kr1TuMWNTgraw/mail/sendMail";
        var ContentType = "multipart/mixed; boundary='$boundary'; charset=UTF-8";
          
          var options = {
      
              url : url,
              headers : {
                  ConsumerKey : consumerKey,
                  Authorization : decoded,
                  "Content-Type" : ContentType,
              },    
              formData : {    
                  userName : req.body.sender,
                  to: req.body.receiver,
                  subject : req.body.title,
                  text : newContents,
              },
        }      
      
      if(req.files != ''){                                     // 첨부파일이 있을 경우
              console.log("@@");
      
        for(var file of req.files){                           // 첨부파일(들) 처리
              options.formData[encodeURI(file.originalname)] = {  // 한글명 이름은 encoding
                      value: file.buffer,
                      options: {
                          filename: file.originalname,
                          contentType: file.mimetype
                      }
               };
           }
      }
          console.log("!!");
          request.post(options, function optionalCallback(err, httpResponse, body) {
        
              if (err) {
                  return console.error('failed:', err);
          
              }
              console.log("right there");
  
            //res.render('afterMailSend',{folderInfoView:folderInfo,IDT:IDT});      
            res.render("partial_after",{folderInfoView:folderInfo,IDT:IDT,action:"Write"}, function(e, dt) {
             // Send the compiled HTML as the response
            res.json(dt);
            });                          
    });    
});

router.get('/writeMail',upload.any(), function(req, res){           // 뒤로가기 용
  console.log(req.query);
  var IDT = req.query.IDT;
  res.render("partial_after",{IDT:IDT,action:"Write"}, function(e, dt) {
   res.json(dt);
   });
});
	return router;	//라우터를 리턴
};


