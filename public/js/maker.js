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
    document.getElementById("toolBox").style="display:block;"
}
function closeToolBox(e){
    document.getElementById("toolBox").style="display:none;"
}
function openTextEditBox(e){
    document.getElementById("textEditBoxCover").style="display:block;"
}
function closeTextEditBox(e){
    document.getElementById("textEditBoxCover").style="display:none;"
}









