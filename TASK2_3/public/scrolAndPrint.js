class ScrollAndPrint{
 
    writeConsole(text){
        let elem = document.getElementById('console');
        elem.innerHTML += text;
       }

       scrollDown(){
        var objDiv = document.getElementById("console");
        objDiv.scrollTop = objDiv.scrollHeight;
       }
}

