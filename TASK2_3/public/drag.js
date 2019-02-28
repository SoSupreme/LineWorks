class Drag{
    constructor(money){
        this.money = money;
     }

    addEvent(money){    
        money.addEventListener('mousedown', function(event){
          
         let firstX = event.target.offsetLeft;
         let firstY = event.target.offsetTop;
          
         let shiftX = event.clientX - money.getBoundingClientRect().left;
         let shiftY = event.clientY - money.getBoundingClientRect().top;
          
            money.style.position = 'absolute';
            money.style.zIndex = 1000;
            document.body.append(money);
      
            moveAt(event.pageX, event.pageY);
          
           function moveAt(pageX, pageY) {
              money.style.left = pageX - shiftX + 'px';
              money.style.top = pageY - shiftY + 'px';
            }
          let currentDroppable = null;
         
           function onMouseMove(event) {
             moveAt(event.clientX, event.clientY);
      
             money.hidden = true;
             let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
             money.hidden = false;
      
            if (!elemBelow) return;
      
        let droppableBelow = elemBelow.closest('.droppable'); // drop 판단
            
          
              if (currentDroppable != droppableBelow) {
               currentDroppable = droppableBelow;
                if (currentDroppable) { 
                  Drag.enterDroppable(currentDroppable);
                }
              }
            }
          
        document.addEventListener('mousemove', onMouseMove);
      
            money.onmouseup = function() {
              document.removeEventListener('mousemove', onMouseMove);
               money.style.left = firstX+ 'px';
               money.style.top = firstY + 'px';
      
              Drag.leaveDroppable(money,currentDroppable);
              currentDroppable = null;
               money.onmouseup = null;
            };
       });
      }
}

Drag.enterDroppable = function(elem){
      elem.style.background = 'blue';
}

Drag.checkMoneyLeft = function(){ 
  return ME.moneyLeft
}

Drag.leaveDroppable = function(money,elem){ // 투입 성공
   // console.log(money.id + ' + ' + waste);
   coinSlotBox.style.background = '';
     
   let value;
   let moneyLeft = Drag.checkMoneyLeft();   // 지갑에 남은 돈 체크
   
   if(money.id == "mNo1"){
     value = 50;
   }
   else if(money.id == "mNo2"){
     value = 100;
   }
   else if(money.id == "mNo3"){
     value = 500;
   }
   else{
     value = 1000;
   }  
   
   if(value <= moneyLeft){             // 지갑 돈이 남아 있을 경우
     
     //let elem = document.getElementById('currentMoney');
 
     if(elem != null){
      Drag.insertMoney(value);               // 투입 성공 = 자판기 돈 넣기
    }
      else if(elem == null){
          Drag.wasteMoney(value);
      }
    }
   else{
     console.log('not enough money');
     scroll.toConsole("돈이 모자랍니다. </br>");
   }
}

Drag.insertMoney = function(value){ // 자판기에 돈 넣기
  let flag = 1;         // 1이면 투입가능, 0이면 투입 불가
     if(VM.numOfBill >= 2 && value == 1000){
       flag = 0;
       console.log('no more bills!');
       scroll.toConsole("지폐는 더 이상 안 들어갑니다. </br>");
     }
     
     if(VM.moneyInVM + value > 3000 && flag == 1){
       flag = 0;
       console.log('more than 3000!');
       scroll.toConsole("더 이상 돈이 안 들어갑니다. </br>");
     }
     
     if(flag == 1){              // 자판기에 돈 넣기 성공
       VM.moneyInVM += value;
       console.log('money in VM');
       ME.moneyLeft -= value;
      
        let elem = document.getElementById('insertedMoney');
        elem.innerHTML = "현재 금액 : "+VM.moneyInVM + " 원";
        scroll.toConsole(value+" 원을 넣었습니다. </br>");
       
        let elem2 = document.getElementById('currentMoney');
        elem2.innerHTML = "현재 남아있는 돈 : "+ME.moneyLeft + " 원";
       
          if(value == 1000) {
            console.log('bill!');
           VM.numOfBill++;
        }
     }
}

Drag.wasteMoney = function(value){   // 돈 떨어트림
  ME.moneyLeft -= value;
  let elem2 = document.getElementById('currentMoney');
  elem2.innerHTML = "현재 남아있는 돈 : "+ME.moneyLeft + " 원";
  scroll.toConsole("돈을 떨어뜨리셨습니다. </br>");
}

 
  