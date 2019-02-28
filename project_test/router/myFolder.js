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

router.post('/addFolder',function(req,res){               // 메일함 추가

  console.log(req.body); 

  var IDT = req.body.IDT;
  var consumerKey = security.getConsumerKey();
  var algorithm = security.getAlgorithm();
  var key = security.getKey();
  var encryptedCode = req.signedCookies[IDT];
  var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);

    console.log('add FolderList');

    var foldName = req.body.foldName;
    var url ="https://apis.worksmobile.com/r/kr1TuMWNTgraw/mail/v2/addFolder?folderName="+foldName;
    url = encodeURI(url);   // 한글

    var formData = {
        url:url,
        headers:{
          ConsumerKey : consumerKey,
          Authorization : decoded,
        }
    };
   
    request.post(formData, function optionalCallback(err, httpResponse, body) {
      
        if (err) {
            return console.error('failed:', err);
    
        }
        console.log(body);
        
        var url="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/getFolderList";

        var options = {
          url:url,
              headers : formData.headers,
       };
    
       request.get(options, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('failed:', err);
    
      }
       var data = JSON.parse(httpResponse.body);
       var folderInfo = data;
     // res.render('myFolderList',{folderInfoView:folderInfo,IDT:IDT});
     res.render("partial_folder",{folderInfoView:folderInfo,IDT:IDT,action:"myFold"}, function(e, dt) {
       res.json(dt);
     });
    });
    });
  });

 router.post('/editFolder',function(req,res){               // 메일함 이름 변경

  var IDT = req.body.IDT;
  var consumerKey = security.getConsumerKey();
  var algorithm = security.getAlgorithm();
  var key = security.getKey();
  var encryptedCode = req.signedCookies[IDT];
  var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);

    console.log('edit FolderList');

    var fn = req.body.foldNum;
    var foldName = req.body.foldName;

    var url ="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/modifyFolder?folderSN="+fn + "&folderName="+foldName;
    url = encodeURI(url);   // 한글

    var formData = {
        url:url,
        headers:{
          ConsumerKey : consumerKey,
          Authorization : decoded,
        }
    };
      request.post(formData, function optionalCallback(err, httpResponse, body) {
      
        if (err) {
            return console.error('failed:', err);
    
        }
        console.log(body);
        
        var url="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/getFolderList";

        var options = {
          url:url,
          headers : formData.headers,
       };
    
       request.get(options, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('failed:', err);
    
      }
      var data = JSON.parse(httpResponse.body);
      var folderInfo = data;
      console.log(folderInfo);
    //  res.render('myFolderList',{folderInfoView:folderInfo,IDT:IDT});
    res.render("partial_folder",{folderInfoView:folderInfo,IDT:IDT,action:"myFold"}, function(e, dt) {
      // Send the compiled HTML as the response
     res.json(dt);
     });
    });
    });
  });

  router.post('/delFolder',function(req,res){               // 메일함 삭제

    console.log('delete FolderList');

    var IDT = req.body.IDT;
    var consumerKey = security.getConsumerKey();
    var algorithm = security.getAlgorithm();
    var key = security.getKey();
    var encryptedCode = req.signedCookies[IDT];
    var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);  

    var fn = req.body.foldNum;
    console.log("fn : "+" " + fn);
   
    url ="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/removeFolder?folderSN="+fn;

    var formData = {
        url:url,
        headers:{
          ConsumerKey : consumerKey,
          Authorization : decoded,
        }
    };

    request.post(formData, function optionalCallback(err, httpResponse, body) {
      
        if (err) {
            return console.error('failed:', err);
    
        }
        console.log("here");
        console.log(body);
        
        var url="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/getFolderList";

        var options = {
          url:url,
          headers : formData.headers,
       };
    
       request.get(options, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('failed:', err);
    
      }
      var data = JSON.parse(httpResponse.body);
      var folderInfo = data;
      //res.render('myFolderList',{folderInfoView:folderInfo,IDT:IDT});
      res.render("partial_folder",{folderInfoView:folderInfo,IDT:IDT,action:"myFold"}, function(e, dt) {
        // Send the compiled HTML as the response
        console.log(dt);
       res.json(dt);
       });
    });
    });
  });
  
router.get('/myFolderList',function(req,res){
  console.log("myfolderlist");
  var IDT = req.query.IDT;
  var consumerKey = security.getConsumerKey();
  var algorithm = security.getAlgorithm();
  var key = security.getKey();
  var encryptedCode = req.signedCookies[IDT];
  var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);

 // FolderList 호출
 var url="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/getFolderList";

 var options = {
   url:url,
       headers :{
        ConsumerKey : consumerKey,
        Authorization :  decoded,
     }
};

request.get(options, function optionalCallback(err, httpResponse, body) {
 if (err) {
   return console.error('failed:', err);
 }
var data = JSON.parse(httpResponse.body);
var folderInfo = data;
//res.render('myFolderList',{folderInfoView:folderInfo,IDT:IDT});
res.render("partial_folder",{folderInfoView:folderInfo,IDT:IDT,action:"myFold"}, function(e, dt) {
  // Send the compiled HTML as the response
 res.json(dt);
 });
     
});
});

	return router;	//라우터를 리턴
};




