let scroll = {    // console 창에 출력하고, 스크롤 위치 바닥으로 고정
 count: 0,
  
  toConsole(text) {
    this.count++;
 
     writeConsole(text);
    
    if(this.count > 11){
      scrollDown();
    }
    }
}

let VM = {        // 자판기 
  moneyInVM: 0,
  numOfBill: 0,
};

let ME = {       // 내 돈
  moneyLeft: 10000,
 };

let List = [  // 제품명,가격,재고
   ["콜라","사이다","커피","소주","맥주","와인","물","주스"]
  ,["100원","200원","300원","400원","500원","600원","700원","800원"]
  ,[0,0,0,0,0,0,0,0]
  ];

let money50 = document.getElementById("mNo1");
getEvent(money50,event);        // 50원

let money100 = document.getElementById("mNo2");
getEvent(money100,event);       // 100원

let money500 = document.getElementById("mNo3");
getEvent(money500,event);       // 500원

let money1000 = document.getElementById("mNo4");
getEvent(money1000,event);      // 1000원

// addEventListener wrapper 함수 - 드래그앤 드랍 구현
function getEvent(money,event){    
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
    let waste;
   
     function onMouseMove(event) {
       moveAt(event.clientX, event.clientY);

       money.hidden = true;
       let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
       money.hidden = false;

      if (!elemBelow) return;

  let droppableBelow = elemBelow.closest('.droppable'); // drop 판단
  let wastableBelow = elemBelow.closest('div');         // div 판단1
      
     waste = wastableBelow.className || wastableBelow.id;// div 판단2
     //console.log(waste+' + '+elemBelow+' + '+droppableBelow);
     
        if (currentDroppable != droppableBelow) {
         currentDroppable = droppableBelow;
          if (currentDroppable) { 
            enterDroppable(currentDroppable);
          }
        }
      }
    
  document.addEventListener('mousemove', onMouseMove);

      money.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
         money.style.left = firstX+ 'px';
         money.style.top = firstY + 'px';

        leaveDroppable(money,currentDroppable,waste);
        currentDroppable = null;
         money.onmouseup = null;
      };
 });
}
 function enterDroppable(elem) {      // 투입구 색깔 변화
      elem.style.background = 'blue';
}

function checkMoneyLeft(){        // 남은 지갑내 돈 반환
  return ME.moneyLeft
}

function leaveDroppable(money,elem,waste) { // 투입 성공
 // console.log(money.id + ' + ' + waste);
  coinSlotBox.style.background = '';
  
  let value;
  let moneyLeft = checkMoneyLeft();   // 지갑에 남은 돈 체크
  
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
    
    let elem = document.getElementById('currentMoney');

    if(waste == "droppable"){
     insertMoney(value);               // 투입 성공 = 자판기 돈 넣기
   }
     else if(waste != undefined){
         wasteMoney(value);
     }
   }
  else{
    console.log('not enough money');
    scroll.toConsole("돈이 모자랍니다. </br>");
    showStat();
  }
}

function insertMoney(value){                 // 자판기에 돈 넣기
  let flag = 1;         // 1이면 투입가능, 0이면 투입 불가
  if(VM.numOfBill >= 2 && value == 1000){
    flag = 0;
    console.log('no more bills!');
    scroll.toConsole("지폐는 더 이상 안 들어갑니다. </br>");
    showStat();
  }
  
  if(VM.moneyInVM + value > 3000 && flag == 1){
    flag = 0;
    console.log('more than 3000!');
    scroll.toConsole("더 이상 돈이 안 들어갑니다. </br>");
    showStat();
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
    
    showStat();
       if(value == 1000) {
         console.log('bill!');
        VM.numOfBill++;
     }
  }
}

function wasteMoney(value){           // 돈 떨어트림
  ME.moneyLeft -= value;
  let elem2 = document.getElementById('currentMoney');
  elem2.innerHTML = "현재 남아있는 돈 : "+ME.moneyLeft + " 원";
  scroll.toConsole("돈을 떨어뜨리셨습니다. </br>");
  showStat();
}

function showStat(){                // 현재 상황 콘솔 표시
 // console.log(ME.moneyLeft+' + '+VM.moneyInVM);
}


function random() {       // 자판기 product를 random하게 뿌림
  
  let randomNum = [];
  
  while(randomNum.length < 8){
    let r = (Math.random() * 8) + 1;
    r = Math.floor(r);
    
    let flag = 0;
    
    for(let i=0;i<randomNum.length;i++){
      if(randomNum[i] == r){
        flag = 1;
        break;
      }
    }
    if(flag == 0){
      randomNum.push(r);
    }
  }
  
 // alert(randomNum);
  
 let arr = List[0];
 let arr2 = List[1];
  
   
  for(let i=0;i<8;i++){
    let name = "gNo";
    name = name+randomNum[i];
    
    let elem = document.getElementById(name);
    let productName = elem.firstElementChild;
    productName.innerHTML = arr[i];
    let productPrice = elem.lastElementChild;
    productPrice.innerHTML = arr2[i];
   }
  
  randomInven();    // product 재고 1~3 랜덤 설정
  //alert(List[2]);
 }

 document.addEventListener("DOMContentLoaded", random);

function randomInven(){           // product 재고 1~3 랜덤 설정
 for(let i=0;i<8;i++){
   
   let r = (Math.random() * 3) + 1;
   r = Math.floor(r);
   
   List[2][i] = r;
    } 
}

// 브라우저 d&d 기능 off
  money50.ondragstart =  money100.ondragstart =  money500.ondragstart =  money100.ondragstart =  function() {
    return false;
};

// 물건 구매
 goodsSection.addEventListener('click', function(event){
   if(event.target.className == "product" || event.target.className ==="price"){
   
     let productText = event.target.parentElement.firstElementChild.innerHTML;
     
     let priceText = event.target.parentElement.lastElementChild.innerHTML;

     let price = Number(priceText[0]+priceText[1]+priceText[2]);
     let check = checkLeft(event.target.parentElement.firstElementChild.innerHTML);
     
     if(check != -1){  // 재고 체크
        
      if(VM.moneyInVM >= price){   // 자판기에 투입 된 돈 > 물건 가격
      VM.moneyInVM -= price;
      let elem = document.getElementById('insertedMoney');
      elem.innerHTML = "현재 금액 : "+VM.moneyInVM + " 원";
      scroll.toConsole(productText + "을 구입하셨습니다. <br/>");
      List[2][check]--;
        if(List[2][check] == 0){
         event.target.parentElement.lastElementChild.innerHTML = "품절";
        }
     }
     else{
       scroll.toConsole("돈을 더 투입하십시오. <br/>");
     }
    }
   else{
       scroll.toConsole("품절되었습니다. <br/>");
    event.target.parentElement.lastElementChild.innerHTML = "품절";
    }
   }
 });

returnButton.addEventListener('click', function(event){   // 반환버튼
  ME.moneyLeft +=  VM.moneyInVM;
  VM.moneyInVM = 0;
  VM.numOfBill = 0;
  
   let elem = document.getElementById('insertedMoney');
   elem.innerHTML = "현재 금액 : "+VM.moneyInVM + " 원";
   scroll.toConsole("돈을 반환 합니다.  </br>");
    
   let elem2 = document.getElementById('currentMoney');
   elem2.innerHTML = "현재 남아있는 돈 : "+ME.moneyLeft + " 원";
  
});
function checkLeft(value){ // 재고가 남아 있으면 해당 제품 idx 아니면 -1
  let idx;

  for(let i =0;i<8;i++){
    if(List[0][i] == value){
      idx = i;
      break;
    }
  }
  
  if(List[2][idx] > 0){
    return idx;
  }
  else{
    return -1;
  }
 }



// 콘솔창에 표시
function writeConsole(text){
  let elem = document.getElementById('console');
  elem.innerHTML += text;
 }

// 스크롤 위치 디폴트 = 아래
function scrollDown(){
 var objDiv = document.getElementById("console");
 objDiv.scrollTop = objDiv.scrollHeight;
}

