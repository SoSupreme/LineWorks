var t = document.getElementById('container');

if(t.addEventListener){
var timerId;
var time;
/////////////// mousedown
    t.addEventListener('mousedown', function(event){
       if(event.target.className == 'up-button'){
    calc(event.target.previousElementSibling,1);
       }
      else if(event.target.className == 'down-button'){
  calc(event.target.previousElementSibling.previousElementSibling,-1);
      }
      else{
      }
  }); 
 /////////////// mousedown
 ///////////////// mouseup
  t.addEventListener('mouseup', function(event){
  clearInterval(time);
  clearTimeout(timerId);
      });
/////////////// mouseup

/////////////// mouseout
  t.addEventListener('mouseout', function(event){
  clearInterval(time);
  clearTimeout(timerId);
      });
/////////////// mouseout

/////////////// onflur
     t.addEventListener('focusout', function(event){
   str(event.target);
  });
 /////////////// onflur
} 


else if(t.attachEvent){			// IE8 용 
var timerId;
var time;

 t.attachEvent('onmousedown', function(event){
     if(event.srcElement.className == 'up-button'){
	calc(event.srcElement.previousSibling,1,8);
  }
    else if(event.srcElement.className == 'down-button'){
	calc(event.srcElement.previousSibling.previousSibling,-1,8);
}
    else{
}
 })

t.attachEvent('onmouseup', function(event){
window.clearTimeout(timerId);
window.clearTimeout(time);
})

t.attachEvent('onmouseout', function(event){
window.clearTimeout(timerId);
window.clearTimeout(time);
})

t.attachEvent('onfocusout', function(event){
var num = event.srcElement;
str(event.srcElement);
})
}

/////////////// 함수  

function str(num){                             // 숫자만 골라냄  

  var arr=[];
  var len = num.value.length;
  
  for(var i=0;i<len;i++){                    
    if(0<= num.value[i] && num.value[i] <=9){
      arr.push(num.value[i]);
    }
  }
  
 var knum = arr.join('');                   // 100~300 범위 안에 숫자인지 확인
  if(knum < 100){
    num.value = 100
  }
  else if(knum > 300){
    num.value = 300
  }   
  else{
      num.value = knum
  }
}

function calc(num,pm,ie){          // Up,Down 증감 계산  
  var timeF;
  var timeS;
  var wt1;
  var wt2;
  if(ie == 8){
    timeF = window.setTimeout;
    timeS = window.setInterval;
  }
  else{
    timeF = setTimeout;
    timeS = setInterval;
   }
  
     timerId = timeF(function(){
     if(num.value <300 && pm == 1){
      num.value++
       }   
     else if(num.value > 100 && pm == -1){
          num.value--;
        }
    time  = timeS(function(){
      if(num.value <300 && pm == 1){
      num.value++
       }   
     else if(num.value > 100 && pm == -1){
          num.value--;
        }
   },100)
 },500);
 }
 /////////////// 함수  
