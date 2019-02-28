class Buy{
    constructor(goodsSection,event){
        this.goodsSection = goodsSection;
        this.event = event;
    }

    getEvent(goodsSection){ 
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
        
    }
}

class Return{

  constructor(returnButton,event){
    this.returnButton = returnButton;
    this.event = event;
}

  getEvent(returnButton){ 

    returnButton = document.getElementById("returnButton");

     
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
      
  }
}

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