
window.onpopstate = function(event) {
     var type = history.state.type;
     var url = "http://localhost:443" + history.state.state;
     sendAjaxGetMenu(url,type);
};

var clickHome = document.getElementsByClassName("fa fa-home");
clickHome[0].addEventListener('click', function(event){
    var url = "http://localhost:443" + event.target.parentElement.parentElement.id;
    sendAjaxGetMenu(url,"List");
});

var clickMenu = document.getElementsByClassName("menuText");
  var len = clickMenu.length;
  for(var i=0;i<len;i++){
    clickMenu[i].addEventListener('click', function(event){
    var url = "http://localhost:443"+event.target.id
    sendAjaxGetMenu(url,"List");
});
}
var clickWriteMenu = document.getElementsByClassName("writeMenuText");
clickWriteMenu[0].addEventListener('click', function(event){
    var url = "http://localhost:443"+event.target.id
    sendAjaxGetMenu(url,"Write");

    if(history.state == null){
        var IDT =  document.getElementsByClassName("userInfo")[0].id
        history.pushState({state:event.target.id,type:"Write"}, "State 1", `?IDT=${IDT}&page=write`); // logs {state:1}, "State 1", "?state=1"
    }
    else if(history.state != null){
        if(history.state.state != event.target.id){
            var IDT =  document.getElementsByClassName("userInfo")[0].id
            history.pushState({state:event.target.id,type:"Write"}, "State 1", `?IDT=${IDT}&page=write`); // logs {state:1}, "State 1", "?state=1"
    }
}
});

var clickMenu2 = document.getElementsByClassName("menuText2");
  var len2 = clickMenu2.length;
  for(var i=0;i<len2;i++){
    clickMenu2[i].addEventListener('click', function(event){
    var url = "http://localhost:443"+event.target.id
    sendAjaxGetMenu(url,"List");
});
}

var clickFoldMenu = document.getElementsByClassName("folderMenuText");
clickFoldMenu[0].addEventListener('click', function(event){
    var url = "http://localhost:443"+event.target.id
    sendAjaxGetMenu(url,"myFold");

    if(history.state == null){
        var IDT =  document.getElementsByClassName("userInfo")[0].id
        history.pushState({state:event.target.id,type:"myFold"}, "State 1", `?IDT=${IDT}&page=myFold`); // logs {state:1}, "State 1", "?state=1"
    }
    else if(history.state != null){
        if(history.state.state != event.target.id){
            var IDT =  document.getElementsByClassName("userInfo")[0].id
            history.pushState({state:event.target.id,type:"myFold"}, "State 1", `?IDT=${IDT}&page=myFold`); // logs {state:1}, "State 1", "?state=1"
            }
     }
});


function sendAjaxGetMenu(url,type){                 // ajax Get 리퀘스트 보냄
    document.head.lastElementChild.remove();
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
        var url = "";
        if(type != "myFold"){
            content = document.getElementsByClassName("textSection");
            content[0].innerHTML = getData;              
        }
       
        if(type == "List"){
           url = 'http://localhost:443/mailList.js';
        }
        else if(type == "Write"){
           url = 'http://localhost:443/write.js';
        }
        else if(type == "myFold"){

            if(document.head.lastElementChild.src != undefined){
                document.head.lastElementChild.remove();
            } 
            var url = 'http://localhost:443/base.js';
        
            var my_awesome_script = document.createElement('script');
            my_awesome_script.setAttribute('src',url);
            document.head.appendChild(my_awesome_script);
            
           url = 'http://localhost:443/myFolderList.js';
           content = document.body
           content.innerHTML = getData;
        }
        else if(type =="afterWrite"){
            url = 'http://localhost:443/afterMail.js';
        }
        else if(type == "Read"){
            url = 'http://localhost:443/read.js';
        }
        var my_awesome_script = document.createElement('script');
        my_awesome_script.setAttribute('src',url);
        document.head.appendChild(my_awesome_script);
    }    
}