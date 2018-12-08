/* 템플릿으로 명함을 만드는 메서드 */
window.onload=function(){
    
    /* 클릭, 더블클릭 이벤트 리스너 등록 */
    let cardTag = document.getElementById("P1-wrap"); //명함에 리스너 추가
    console.log(cardTag);


    /* Tool Box 여는 이벤트 */
    cardTag.addEventListener('click', (e)=>{
        //console.log("툴박스 닫기");
        openToolBox(e);
    });

    /* Text Edit Box 여는 이벤트 */
    cardTag.addEventListener('dblclick', (e)=>{
        //console.log("텍스트박스 오픈");
        openTextEditBox(e);

    });

    /* Tool Box 닫는 이벤트 */
    let makerSection = document.getElementById("makerSection")
    makerSection.addEventListener("click",(e)=>{
        //console.log("툴박스 닫기");
        if(e.target.id === e.currentTarget.id){
            closeToolBox(e);
        }
    })


    /* Text Edit Box 닫는 이벤트 */
    let textEditBoxCover =document.getElementById("textEditBoxCover");
    textEditBoxCover.addEventListener('click', (e)=>{
        //console.log("텍스트 상자 닫기 ");
        //console.log(e.currentTarget);
        //console.log(e.target)
        if(e.target.id === e.currentTarget.id){
            closeTextEditBox(e);
        }
    });

    textEditBoxCover.addEventListener('mouseleave', (e)=>{
        //mouseout은 자식중 하나에서 벗어날때도 체크

        //console.log("마우스 아웃 ");
        //console.log(e.currentTarget);
        //console.log(e.target)
        if(e.target.id === e.currentTarget.id){
            
        }
        closeTextEditBox(e);
    });


}

function openToolBox(e){
    document.getElementById("toolBox").style="display:block;";
}
function closeToolBox(e){
    document.getElementById("toolBox").style="display:none;"
}
function openTextEditBox(e){
    //window 기준 클릭한 요소의 offset
    let elementOffset= e.target.getBoundingClientRect(); 
    let elementTop = elementOffset.top;
    let elementLeft= elementOffset.left;
    //window에서 명함 상자까지의 offset
    let cardOffset = document.getElementById("P1-wrap").getBoundingClientRect();
    let cardTop = cardOffset.top;
    let cardLeft = cardOffset.left;

/*     let cardBlockOffset = document.getElementById("PGs-Wrap").getBoundingClientRect();
    let cardBlockLeft = cardBlockOffset.left;
    // 카드~ 요소까지의 거리 */

    console.log("offset들 엘리먼트, 카드순",elementTop, elementLeft, cardTop, cardLeft);
    let top = elementTop - cardTop - 45; // 30은 text 툴바의 높이.
    let left = elementLeft - cardLeft ; //+ cardBlockLeft

    // 텍스트상자는 요소의 넓이, 높이의 1.5배 가져감.
    let width = e.target.offsetWidth * 1.5;
    let height = e.target.offsetHeight * 1.5;
    let qu= document.getElementById("textArea").style="width:"+ width+"px ; height:" + height +"px ;";
    console.log(qu);

    //위치 반영
    let styleQuery= "position:absolute; top:"+top+"px; left:"+left+"px;  transform:translate(-16.66%, -16.66%);";
    //추가된 넓이 1/3의 절반인 1/6만큼 왼쪽으로 이동. , 위쪽으로는 1/6 + 툴바의 높이만큼
    //let styleQuery= "position:absolute; top:"+top+"px; left:"+left+"px;";
    console.log(styleQuery);
    document.getElementById("textEditBox").style=styleQuery;

    //텍스트 상자 열기
    document.getElementById("textEditBoxCover").style="display:block;"
}
function closeTextEditBox(e){
    document.getElementById("textEditBoxCover").style="display:none;"
}









