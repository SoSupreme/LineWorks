
var sendButton = document.getElementById("getSend");                     // ajax로 파일 보내기
sendButton.addEventListener('click', function(event){
  var form = document.getElementById("sendForm");
  var formData = new FormData(form);

  var fileInput = document.getElementById("fileName");
  var file = fileInput.files

  formData.append('file', file);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', form.getAttribute('action'), true);
  xhr.send(formData);
  xhr.onload = function(){
    if (xhr.status != 200) {
        console.log("Error");
        return;
    }
    var getData = JSON.parse(xhr.responseText);
    var content = document.getElementsByClassName("textSection");
    content[0].innerHTML = getData;
    document.head.lastElementChild.remove();
    var url = 'http://localhost:443/afterMail.js';

    var my_awesome_script = document.createElement('script');
    my_awesome_script.setAttribute('src',url);
    document.head.appendChild(my_awesome_script);

    if(history.state == null){
      var IDT =  document.getElementsByClassName("userInfo")[0].id
      var url =  "/write/writeMail?IDT=" + IDT;
      history.pushState({state:url,type:"afterWrite"}, "State 1", `?IDT=${IDT}&page=after`); // logs {state:1}, "State 1", "?state=1"
  }
  else if(history.state != null){
      if(history.state.state != url){
        var IDT =  document.getElementsByClassName("userInfo")[0].id
        var url =  "/write/writeMail?IDT=" + IDT;
        history.pushState({state:url,type:"afterWrite"}, "State 1", `?IDT=${IDT}&page=after`); // logs {state:1}, "State 1", "?state=1"
      }
  }   
   
   }
});

  var fileList = document.getElementById("fileName");

    fileList.addEventListener('change', function(event){

      var files = event.target.files;
      var text = '';
      var fileBox = document.getElementById("fileInfo");

      if(files.length != 0){
        fileBox.style.display = "block";
      }
      else if(files.length == 0){
        fileBox.style.display = "none";
      }

      var totalFile=0;
      for(var i =0;i<files.length;i++){
        text = text + "<div class=\"fileAttach\"><span class=\"fSpan\">" + files[i].name + "</span>";
        text =  text + files[i].size + "byte"+"</div>";

        totalFile += Number(files[i].size);

      }
      document.getElementById("fileInfo").innerHTML = text;
      
     
      
      var limit = totalFile;

      if(totalFile > 1 && totalFile < 1000){
        totalFile = totalFile + "byte";
      }
      else if(totalFile > 1000 && totalFile <1000000){
        totalFile /= 1000;
        totalFile = totalFile.toFixed(2) + "KB";
      }
      else if(totalFile > 1000000 && totalFile < 1000000000){
        totalFile /= 1000000;
        totalFile = totalFile.toFixed(2) + "MB";
      }
      document.getElementById("totalFile").innerHTML = "전체" + ' ' + totalFile + ' ' +  "<i id = \"deleteAll\" class=\"fa fa-times\" aria-hidden=\"true\"></i>";

      findDeleteButton();
      
      var send =  document.getElementById("getSend");

      if(limit > 10000000){
        alert("첨부가능한 파일 용량을 초과하였습니다.");

        send.disabled = true;
        send.style="background-color:black;";
      }
      else{
        if(senderCheck.value == '' || receiverCheck.value == '' || titleCheck.value== ''){
          send.disabled = true;
          send.style="background-color:black;";
        }    
        else{
          checkMailForm();

        }
      }
      
    });

function findDeleteButton(){
  console.log("let's delete");
  var clickDelete = document.getElementById("deleteAll");
  
  clickDelete.addEventListener('click', function(event){
      

      document.getElementById("fileName").value="";
   
      document.getElementById("fileInfo").innerHTML = "";
      document.getElementById("totalFile").innerHTML = "";

      var fileBox = document.getElementById("fileInfo");
      fileBox.style.display = "none";

      checkMailForm();


     });
}
var senderCheck = document.getElementById("sname");
var receiverCheck = document.getElementById("fname");
var titleCheck = document.getElementById("tname");


senderCheck.addEventListener('change', function(event){
  checkMailForm();
});

receiverCheck.addEventListener('change', function(event){
  if(checkMailForm() == 1){
    alert("메일형식이 올바르지 않습니다.");
  }
});

titleCheck.addEventListener('change', function(event){
  checkMailForm();
});

function checkMailForm(){
   senderCheck = document.getElementById("sname");
   receiverCheck = document.getElementById("fname");
   titleCheck = document.getElementById("tname");

  var send =  document.getElementById("getSend");
  var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  //0 : 발송가능, 1: 메일형식 잘못, 2 : 그외

  if(senderCheck.value == '' ||  titleCheck.value== ''){
    send.disabled = true;
    send.style="background-color:black;";
    
    if(exptext.test(receiverCheck.value)==false){
      //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우			
        return 1;
    }
    else{
      return 2;
    }
  }    
  else{   
				if(exptext.test(receiverCheck.value)==false){
		    	//이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우			
            return 1;
        }
        else{
          send.disabled = false;
          send.style='false';
          return 0;
     }
  }
}
