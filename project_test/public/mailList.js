var saveState = document.getElementsByClassName("saveState");         // state저장

if(history.state == null){
    var IDT =  document.getElementsByClassName("userInfo")[0].id
    history.pushState({state:saveState[0].id,type:"List"}, "State 1", `?IDT=${IDT}&page=list`); // logs {state:1}, "State 1", "?state=1"

}
else if(history.state != null){
    if(history.state.state != saveState[0].id){
    var IDT =  document.getElementsByClassName("userInfo")[0].id
    history.pushState({state:saveState[0].id,type:"List"}, "State 1", `?IDT=${IDT}&page=list`); // logs {state:1}, "State 1", "?state=1"
    }
}

var readMail = document.getElementsByClassName("normalLink");         // 편지 읽기
var mailLen = readMail.length;
for(var i=0;i<mailLen;i++){
    readMail[i].addEventListener('click', function(event){
        var url = "http://localhost:443"+event.target.parentElement.id
        sendAjaxGetStat(url,"read");    

        if(history.state == null){
            var IDT =  document.getElementsByClassName("userInfo")[0].id
            history.pushState({state:event.target.parentElement.id,type:"Read"}, "State 1", `?IDT=${IDT}&page=read`); // logs {state:1}, "State 1", "?state=1"
        
        }
        else if(history.state != null){
            if(history.state.state != event.target.parentElement.id){
            var IDT =  document.getElementsByClassName("userInfo")[0].id
            history.pushState({state:event.target.parentElement.id,type:"Read"}, "State 1", `?IDT=${IDT}&page=read`); // logs {state:1}, "State 1", "?state=1"
            }
        }
});
}

var critical = document.getElementsByClassName("star");         // 중요 표시 마크
var len = critical.length;

for(var i=0;i<len;i++){
    critical[i].addEventListener('click', function(event){
    var curr = event.target.className;
    var msn = (event.target.parentElement.nextElementSibling.nextElementSibling.name);

    var url ="http://localhost:443/mailStat/setMark";
    var status="";
    if(curr == "fa fa-star-o"){                 // 중요 표시
        event.target.className = "fa fa-star";
        event.target.style="color:#f9622e";
        status = "mark"
    }    
    else if(curr == "fa fa-star"){              // 중요 표시 제거
        event.target.className = "fa fa-star-o";
        event.target.style="none";
        
        status = "unmark"
    }
    var IDT =  document.getElementsByClassName("userInfo")[0].id
    var data = {msn:msn,status:status,IDT:IDT};
    sendAjaxStat(url,data,"Mark");

});
}

var env = document.getElementsByClassName("envelope");         // 읽음/안읽음 표시 마크
for(var i=0;i<len;i++){
    env[i].addEventListener('click', function(event){
    var curr = event.target.className;
    var msn = (event.target.parentElement.nextElementSibling.name);
    var url ="http://localhost:443/mailStat/setRead";
    var status

    if(curr == "fa fa-envelope-open-o"){                 // 읽음 표시
        event.target.className = "fa fa-envelope";
        var status="unread"
    }    
    else if(curr =="fa fa-envelope"){                   // 안읽음 표시
        event.target.className = "fa fa-envelope-open-o";
        var status="read"
     }
    var IDT =  document.getElementsByClassName("userInfo")[0].id
     var data = {msn:msn,status:status,IDT:IDT};
    sendAjaxStat(url,data,"Read");
    doTog();
});
}

var markStar = document.getElementById("mark");                // 다중 마크
markStar.addEventListener('click', function(event){
    var x = document.getElementsByClassName("input") 

    var len = x.length;
    var url ="http://localhost:443/mailStat/setMark";
    var msn = "";

    for(var i = 0;i<len;i++){
        // console.log(x[i].firstElementChild.checked);
        if(x[i].lastElementChild.checked == true){
            msn+=x[i].lastElementChild.name + ';';
            x[i].lastElementChild.previousElementSibling.previousElementSibling.firstElementChild.className="fa fa-star"
            x[i].lastElementChild.previousElementSibling.previousElementSibling.firstElementChild.style="color:#f9622e";
        }
    }
    var IDT =  document.getElementsByClassName("userInfo")[0].id
    var status = "mark"
    var data = {msn:msn,status:status,IDT:IDT};
    sendAjaxStat(url,data,"Mark");  
});

var chooseAll = document.getElementsByClassName("fa fa-user-circle");                // 전체 체크
chooseAll[0].addEventListener('click', function(event){
    var x = document.getElementsByClassName("input") 

    var len = x.length;
    var count = 0;
    for(var i = 1;i<len;i++){
        if(x[i].lastElementChild.checked == true){
            count++;
        }
    }
    if(count == len-1){
        for(var i = 1;i<len;i++){
        x[i].lastElementChild.checked = false;
        }
    }
    else{
        for(var i = 1;i<len;i++){
        x[i].lastElementChild.checked = true
        }
    }
    console.log("all Checked");
    doTog();  
});

var clickInput = document.getElementsByClassName("check");       // input 버튼 클릭할때마다 토글 변화 반영
var len = clickInput.length;
    for(var i=0;i<len;i++){
        clickInput[i].addEventListener('click', function(event){
        doTog();
    });    
}

var togClick = document.getElementById("tog");                // 토글 : 읽음/안읽음 클릭 (다중 읽음/안읽음)
togClick.addEventListener('click', function(event){
    var x = document.getElementsByClassName("input") 
    var len = x.length;
    var fn = x[1].lastElementChild.value;

    var url ="http://localhost:443/mailStat/setRead";
    var msn = "";
    var status;

      for(var i = 1;i<len;i++){
        if(x[i].lastElementChild.checked == true){
        msn+=x[i].lastElementChild.name + ';';
        }
    }
    var iconMark = document.getElementById("tog");    
    if(iconMark.innerHTML == "읽음"){
      status = "read";

      for(var i = 1;i<len;i++){
        if(x[i].lastElementChild.checked == true){
           x[i].lastElementChild.previousElementSibling.firstElementChild.className = "fa fa-envelope-open-o";
        }
    }
    }
    else if(iconMark.innerHTML == "안읽음"){
        status = "unread";

        for(var i = 1;i<len;i++){
            if(x[i].lastElementChild.checked == true){
               x[i].lastElementChild.previousElementSibling.firstElementChild.className = "fa fa-envelope";
            }
        }
    }
    var IDT =  document.getElementsByClassName("userInfo")[0].id
    var data = {msn:msn,status:status,IDT:IDT};
    sendAjaxStat(url,data,"Read");
    doTog();
});

var del = document.getElementById("delete");                // 다중 삭제
del.addEventListener('click', function(event){
    var isTrue = confirm("선택한 메일을 삭제합니다.");

    if(isTrue == false){
        return;
    }
    var x = document.getElementsByClassName("input") 

    var len = x.length;
    var fn = x[1].lastElementChild.value;


    var url = "http://localhost:443/mailStat/delete";
    var msn = "";

    for(var i = 0;i<len;i++){
        if(x[i].lastElementChild.checked == true){
            msn+=x[i].lastElementChild.name + ';';
        }
    }

    var currPage = document.getElementById("pageInfo").lastElementChild.id;  
    var firstPage = document.getElementById("pageInfo").firstElementChild.id;  
   
    var IDT =  document.getElementsByClassName("userInfo")[0].id
    var data = {msn:msn,page:currPage,firstPage:firstPage,IDT:IDT,foldNum:fn};
    sendAjaxStat(url,data,"delete");
});

var prevPage = document.getElementById("previousArrow");                // 이전 페이지

prevPage.addEventListener('click', function(event){

    var x = document.getElementsByClassName("input") 
    var len = x.length;
    var fn = x[1].lastElementChild.value;

    var newPage = prevPage.parentElement.id - 5;

    if(newPage < 1){
        alert("이전 페이지가 없습니다.");
    }
    else{
       var url = "/getMail?folderSN=";
       url = url+fn+"&page="+newPage+"&firstPage="+newPage;
       var IDT =  document.getElementsByClassName("userInfo")[0].id
       url += "&IDT="+IDT;

       sendAjaxGetStat(url,"move");
    }
});

var nextPage = document.getElementById("nextArrow");                // 다음 페이지

nextPage.addEventListener('click', function(event){

    var x = document.getElementsByClassName("input") 
    var len = x.length;
    var fn = x[1].lastElementChild.value;


    var lp = document.getElementsByClassName("lpCheck") 

    lp = Number(lp[0].id);

    var newPage = Number(prevPage.parentElement.id) + 5;
   

    if(newPage > lp){
        alert("다음 페이지가 없습니다.");
    }
    else{
       var url = "/getMail?folderSN=";
       url = url+fn+"&page="+newPage+"&firstPage="+newPage;
       var IDT =  document.getElementsByClassName("userInfo")[0].id
       url += "&IDT="+IDT;
       sendAjaxGetStat(url,"move");
    }
});

var movePage = document.getElementsByClassName("pageNumbering");                // 클릭 페이지 이동
var lenPg = movePage.length;
for(var i=0;i<lenPg;i++){
   movePage[i].addEventListener('click', function(event){

    var url = "http://localhost:443"+event.target.id
    sendAjaxGetStat(url,"move");
});
}


function sendAjaxGetStat(url,type){                                                                         // ajax Get 리퀘스트 보냄
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(null);
    xhr.onload = function(){
        if (xhr.status != 200) {
            console.log("Error");
            return;
        }
        var getData = JSON.parse(xhr.responseText);
        var content = document.getElementsByClassName("textSection");
        console.log(content[0]);
        content[0].innerHTML = getData;

        if(type == "move"){
            document.head.lastElementChild.remove();
            var url = 'http://localhost:443/mailList.js';
            var my_awesome_script = document.createElement('script');
            my_awesome_script.setAttribute('src',url);
            document.head.appendChild(my_awesome_script);
        }    
    }    
}

function sendAjaxStat(url,data,flag){         // ajax Post 리퀘스트 보냄  
                                                          
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/json');
    var ajaxData = JSON.stringify(data);
    xhr.send(ajaxData);
    xhr.onload = function(){
        if (xhr.status != 200) {
            console.log("Error");
            return;
        }
        var getData = JSON.parse(xhr.responseText);

        if(flag == "delete"){
            document.head.lastElementChild.remove();
            var content = document.getElementsByClassName("textSection");
            content[0].innerHTML = getData;      
            var url = 'http://localhost:443/mailList.js';
            var my_awesome_script = document.createElement('script');
            my_awesome_script.setAttribute('src',url);
            document.head.appendChild(my_awesome_script);   
        }              
     
    }
}

function doTog(){                                                                               // 토글 : 읽음/안읽음 바꿔줌
    var clickInput = document.getElementsByClassName("input");                                             
    var len = clickInput.length;
    
    var unreadCount = 0;
    var readCount = 0;

    for(var i = 1;i<len;i++){
     
 if(clickInput[i].lastElementChild.checked == true){
    
     if(clickInput[i].lastElementChild.previousElementSibling.firstElementChild.className == "fa fa-envelope"){
         unreadCount++;
     }
     else if(clickInput[i].lastElementChild.previousElementSibling.firstElementChild.className == "fa fa-envelope-open-o"){
         readCount++;
     }
 }
 var iconMark = document.getElementById("tog");     
 if(unreadCount >= readCount){                       // 안 읽음이 많으므로 다 읽음으로 표시하게 함
     iconMark.innerHTML = "읽음";
 }
 else{                                              // 읽음이 많으므로 다 안읽음으로 표시하게 함
      iconMark.innerHTML = "안읽음";
 }
}
}