var express = require('express');
var cors = require('cors');
var sync_request = require('sync-request');     // 동기적 request를 위해 sync-request 사용
var request = require('request');
var cookieParser = require('cookie-parser')
var app = express();

app.use(express.static('public'));
app.use(cors());
app.use(cookieParser('My SECRET'))              // 쿠키 사용
app.set('view engine','ejs');                   // ejs사용 view engine set
app.set('views','./views');

var security = require('./security/key.js');  
var encrypt = require('./security/encrypt.js');  

var count = 0;

var read  = require('./router/read.js')(app);           // 라우팅 : 메일 읽기 + 첨부파일
app.use('/read',read);

var myFolder  = require('./router/myFolder.js')(app);    // 라우팅 : 나의메일함+추가+삭제+편집
app.use('/myFolder',myFolder);

var write  = require('./router/write.js')(app);           // 라우팅 : 편지쓰기 + 첨부
app.use('/write',write);

var mailStat = require('./router/mailStat.js')(app);      // 라우팅 : 메일상태변경(읽음/안읽음,중요,삭제)
app.use('/mailStat',mailStat);

app.all('/getStart',function(req,res){
  var consumerKey = security.getConsumerKey();
  var url = "https://auth.worksmobile.com/ba/kr1TuMWNTgraw/service/authorize?client_id="+ consumerKey
              + "&redirect_uri=http://localhost:443/getAuth"
              + "&domain=mail.wdomain8.com";
  res.redirect(url);
});

function getAccessToken(consumerKey,authCode) {         // AccessToken 구하기
  var url = "https://auth.worksmobile.com/ba/kr1TuMWNTgraw/service/token?client_id="+consumerKey+"&code="+
  authCode+"&domain=mail.wdomain8.com/";

  var result = sync_request('GET', url);
	var body = JSON.parse(result.getBody("utf8"));

  return body.refresh_token;
}

function getFolderList(consumerKey,authorization) {
  console.log('getfolder');
    var url="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/getFolderList";
    var options = {
          headers :{
           ConsumerKey : consumerKey,
           Authorization : authorization,
        }
   };
   var result = sync_request('GET', url,options);
   var body = JSON.parse(result.getBody("utf8"));
   folderInfo = body;    
 }

function getMailList(consumerKey,authorization,folder,page) {
  console.log('getmail');
    var url="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/getMailList?folderSN="+folder;
    url+="&page="+page;

    var options = {
          headers :{
            ConsumerKey : consumerKey,
            Authorization : authorization,
        }
   };
  var result = sync_request('GET', url,options);
  var body = JSON.parse(result.getBody("utf8"));
    
  return body;
}
var userInfo={};
app.all('/getAuth',function(req,res){
  if(req.query['IDT']){                           // refresh 
    console.log(req.query);
    var consumerKey = security.getConsumerKey();  // ConsumerKey 가져오기   
    var usr = req.query['IDT'];
    var authorization;
    console.log("Refresh");
    //console.log(userInfo);
    for(key in userInfo) {
     if(key == usr){
        authorization = userInfo[key];
        break;
     }
    }

  getFolderList(consumerKey,authorization);      // 폴더리스트 획득
  console.log(3);

  var sample = { folderSN: '-1', page: '1' };

  mailInfo = getMailList(consumerKey,authorization,sample.folderSN,sample.page);

  var foldNum = {
      "FN": sample,
  }
  var algorithm = security.getAlgorithm();
  var key = security.getKey();
  var encoded = encrypt.getEncrypt(authorization,algorithm,key);
  authorization = encoded;
  res.render('mailList',{folderInfoView:folderInfo, mailInfoView:mailInfo, foldNumber:foldNum,firstPage:1,IDT:usr,action:"List"});// mailList.ejs로 넘긴다.
  }
  else{                                         // 처음 로그인
  var consumerKey = security.getConsumerKey();  // ConsumerKey 가져오기   
  var authCode = req.query['code'];              // AuthCode 획득
  console.log(1);
  var accessToken =  getAccessToken(consumerKey,authCode);    // AccessToken 획득      
  console.log(2);                  
  authorization = "Bearer " + accessToken;
  getFolderList(consumerKey,authorization);      // 폴더리스트 획득
  console.log(3);

  var sample = { folderSN: '-1', page: '1' };

  mailInfo = getMailList(consumerKey,authorization,sample.folderSN,sample.page);

  var foldNum = {
      "FN": sample,
  }
  count++;
  var IDT = "User" + count;

  userInfo[IDT] = authorization;


  var algorithm = security.getAlgorithm();
  var key = security.getKey();
  var encoded = encrypt.getEncrypt(authorization,algorithm,key);
  authorization = encoded;

  return res.cookie(IDT,authorization,{signed : true}).render('mailList',{folderInfoView:folderInfo, mailInfoView:mailInfo, foldNumber:foldNum,firstPage:1,IDT:IDT,action:"List"});// mailList.ejs로 넘긴다.
  }
  });

app.get('/getMail',function(req,res){

   var foldNum = req.query;
   var pageNum = req.query.page;
   var firstPage = req.query.firstPage;
   var IDT = req.query.IDT;

   var consumerKey = security.getConsumerKey();
   var algorithm = security.getAlgorithm();
   var key = security.getKey();
   var encryptedCode = req.signedCookies[IDT];
   var decoded = encrypt.getDecrypt(encryptedCode,algorithm,key);

   var foldNum = {
    "FN": req.query,
  }

  // MailList 호출 
   var url="https://apis.worksmobile.com/kr1TuMWNTgraw/mail/getMailList?folderSN="+foldNum.FN.folderSN;;
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
    var mailInfo = data;

    res.render("partial_mailList", {mailInfoView:mailInfo, foldNumber:foldNum, firstPage:firstPage,IDT:IDT,action:"List"}, function(e, dt) {
      // Send the compiled HTML as the response
      res.json(dt);
    });
});
});
 
 var server = app.listen(443, function(){
    console.log("Express server has started on port 443")
});
