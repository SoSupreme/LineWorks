class Random{
    constructor(List){
        this.List = List;
    }

    random() {       // 자판기 product를 random하게 뿌림
  
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
        
       }

       randomInven(){           // product 재고 1~3 랜덤 설정
        for(let i=0;i<8;i++){
          
          let r = (Math.random() * 3) + 1;
          r = Math.floor(r);
          
          List[2][i] = r;
           } 
       }
}
    