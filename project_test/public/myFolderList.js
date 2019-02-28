var addButton =  document.getElementById("clickAddBox");                        // 폴더 추가
addButton.addEventListener('click', function(event){
    var x = addButton.previousElementSibling;

    if(x.value == ""){
        alert("메일함 이름을 입력해주세요");
        return;
    }

    if(x.value.length > 20){
        alert("메일함 이름은 20자이내로 설정해야합니다.")
        return;
    }

    var mailBoxList = document.getElementsByClassName("mailList") ;
    var len  =  mailBoxList.length;

    for(var i = 0;i<len;i++){
       var name = mailBoxList[i].firstElementChild.nextElementSibling.innerHTML;
       
       if(x.value == name){
           alert("중복된 메일함 이름이 있습니다. 다른 이름을 선택해주세요.")
           return;
       }
       else{
       }
    }

    var mailBoxList2 = document.getElementsByClassName("mailList2") ;
    var len2  =  mailBoxList2.length;

    for(var i = 0;i<len2;i++){
       var name2 = mailBoxList2[i].firstElementChild.nextElementSibling.innerHTML;
       if(x.value == name2){
           alert("중복된 메일함 이름이 있습니다. 다른 이름을 선택해주세요.")
           return;
       }
       else{
       }
    }
    var IDT =  document.getElementsByClassName("userInfo")[0].id
    var url = "http://localhost:443/myFolder/addFolder";
    var data = {foldName:x.value, IDT:IDT};
    sendAjaxFolder(url,data);  
});



var del = document.getElementsByClassName("fa fa-ban");         // 폴더 삭제
var len = del.length;

for(var i=0;i<len;i++){
    del[i].addEventListener('click', function(event){

    var isTrue = confirm("선택한 메일함을 삭제합니다.");
    
    if(isTrue == false){
        return;
    }

    var curr = event.target.className;
    var fn = event.target.parentElement.id;
    var IDT =  document.getElementsByClassName("userInfo")[0].id
    var url = "http://localhost:443/myFolder/delFolder";
    var data = {foldNum:fn, IDT:IDT};
    sendAjaxFolder(url,data);
});
}

var showEdit = document.getElementsByClassName("fa fa-wrench");         // 변경창 보이기/숨기기
for(var i=0;i<len;i++){
    showEdit[i].addEventListener('click', function(event){

       
    var curr = event.target.className;
    var goal = event.target.parentElement;
    
    var status = event.target.parentElement.previousElementSibling.previousElementSibling.style.display;

    if(status == "" || status == "none"){
        goal.previousElementSibling.previousElementSibling.style.display="block";
    }
    else{
        goal.previousElementSibling.previousElementSibling.firstElementChild.value = "";
        goal.previousElementSibling.previousElementSibling.style.display="none";
    }
});
}

var edit = document.getElementsByClassName("editButton");         // 폴더이름 변경
for(var i=0;i<len;i++){
    edit[i].addEventListener('click', function(event){

    var curr = event.target
    var nameAfter = event.target.previousElementSibling.value;
    var fn = event.target.parentElement.nextElementSibling.id;

    if(nameAfter == ""){
        alert("메일함 이름을 입력해주세요");
        return;
    }

    if(nameAfter.length > 20){
        alert("메일함 이름은 20자이내로 설정해야합니다.")
        return;
    }

    var mailBoxList = document.getElementsByClassName("mailList") ;
    var len  =  mailBoxList.length;

    for(var i = 0;i<len;i++){
       var name = mailBoxList[i].firstElementChild.nextElementSibling.innerHTML;

       if(nameAfter == name){
           alert("중복된 메일함 이름이 있습니다. 다른 이름을 선택해주세요.")
           return;
       }
    }

    var mailBoxList2 = document.getElementsByClassName("mailList2") ;
    var len2  =  mailBoxList2.length;

    for(var i = 0;i<len2;i++){
        var name2 = mailBoxList2[i].firstElementChild.nextElementSibling.innerHTML;

       if(nameAfter == name2){
           alert("중복된 메일함 이름이 있습니다. 다른 이름을 선택해주세요.")
           return;
       }
       else{
       }
    }
    var IDT =  document.getElementsByClassName("userInfo")[0].id

    var url = "http://localhost:443/myFolder/editFolder";
    var data = {foldNum:fn,foldName:nameAfter,IDT:IDT};
    sendAjaxFolder(url,data);
});
}

function sendAjaxFolder(url,data){                                                                         // ajax Post 리퀘스트 보냄
    document.head.lastElementChild.remove();
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
        var content = document.body
        content.innerHTML = getData;

        console.log(document.head.lastElementChild);
        if(document.head.lastElementChild.src != undefined){
            document.head.lastElementChild.remove();
        } 
        var url = 'http://localhost:443/base.js';
    
        var my_awesome_script = document.createElement('script');
        my_awesome_script.setAttribute('src',url);
        document.head.appendChild(my_awesome_script);

        var url = 'http://localhost:443/myFolderList.js';
    
        var my_awesome_script = document.createElement('script');
        my_awesome_script.setAttribute('src',url);
        document.head.appendChild(my_awesome_script);
       }
}



