/* 템플릿으로 명함을 만드는 메서드 */
window.onload=function(){
    
    /* 클릭, 더블클릭 이벤트 리스너 등록 */
    let cardTag = document.getElementById("P1-wrap");
    cardTag.addEventListener('click', (e)=>{
        console.log("수정 상자 오픈");
        openModiBox(e);
    });
    cardTag.addEventListener('dbclick', (e)=>{
        console.log("텍스트박스 오픈");
        openTextBox(e);
    })


    /* let textTagArr = document.getElementsByTagName("h2","h3","p","span")
    for(let i = 0; i<textTagArr.length; i++){
        
    } */
    

}

function openModiBox(e){
    
}
function openTextBox(e){
    
}










