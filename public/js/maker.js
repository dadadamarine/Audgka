var shareUrl;

/* 템플릿으로 명함을 만드는 메서드 */
document.getElementById("templateFrame")=function(){
    



    /* 클릭, 더블클릭 이벤트 리스너 등록 */
    let cardTag = document.getElementById("P1-wrap"); //명함에 리스너 추가
    console.log(cardTag);
    let memory_temp;
    let isBoxClosed=1; // 1:툴박스 닫힘, 0= 툴박스 열림
    /* Tool Box 닫는 이벤트 */
    let makerSection = document.getElementById("makerSection");
    let textEditBoxCover = document.getElementById("textEditBoxCover");
    makerSection.addEventListener("click",(e)=>{
        if(e.target.id === "textEditBoxCover"){ // 텍스트 수정 박스 닫기 이벤트
            
            // 텍스트 상자, 텍스트 툴바 외의 검은부분을 눌렀을때 종료
            let inputText = document.getElementById("textArea").value; 
            //console.log(memory_temp);
            memory_temp.innerText=inputText;
            closeTextEditBox(e);
            console.log("텍스트 상자 닫기 ");
            //console.log(document.getElementById("textArea").value);
        }else if(e.target.id === "makerSection" ){
            closeToolBox(e);
            console.log("툴박스 닫기");
            isBoxClosed=1;
        }else{
            /* Tool Box 여는 이벤트 */
            if(isBoxClosed){ 
                memory_temp=e.target;
                openToolBox(e);
                isBoxClosed=0;
                console.log("툴박스 열기");

            }else if(memory_temp === e.target){ // 같은요소를 한번더 클릭했을경우.
                /* Text Edit Box 여는 이벤트 */
                if(isTextTag(e)){ // 텍스트 태그일경우 텍스트설정창도 연다.
                    memory_temp=e.target;
                    openTextEditBox(e);
                }
            }else{ // 툴바가 열려있는채로 다른요소를 클릭한경우
                //해당 요소의 툴바를 연다.
                memory_temp=e.target;
                openToolBox(e);
                isBoxClosed=0;
                console.log("툴박스 열기");
            }
        }
    }, {capture:true});


    /*  
    cardTag.addEventListener('dblclick', (e)=>{
        console.log("텍스트박스 열기");
        if(isTextTag(e)){
            memory_temp=e.target;
            openTextEditBox(e);
        }
        

    });
    */

    /* Text Edit Box 닫는 이벤트 */
    /*
    let textEditBoxCover =document.getElementById("textEditBoxCover");
    textEditBoxCover.addEventListener('click', (e)=>{
        console.log("텍스트 상자 닫기 ");
        //console.log(e.currentTarget);
        //console.log(e.target)
        if(e.target.id === e.currentTarget.id){
            // 텍스트 상자, 텍스트 툴바 외의 검은부분을 눌렀을때 종료
            let inputText = document.getElementById("textArea").value; 
            //console.log(memory_temp);
            memory_temp.innerText=inputText;
            closeTextEditBox(e);
            //console.log(document.getElementById("textArea").value);
        }
    });
    */
    textEditBoxCover.addEventListener('mouseleave', (e)=>{
        //mouseout은 자식중 하나에서 벗어날때도 체크
        let blockState = window.getComputedStyle(textEditBoxCover).getPropertyValue("display");
        if(blockState==="block"){
            console.log("마우스 아웃 ");
            let inputText = document.getElementById("textArea").value; 
            memory_temp.innerText=inputText;
            closeTextEditBox(e);
            document.getElementById("textArea").value="";
        }
    });


}

function openToolBox(e){
    document.getElementById("toolBox").style="display:block;";
}
function closeToolBox(e){
    document.getElementById("toolBox").style="display:none;"
}
function openTextEditBox(e){

    /*  텍스트의 내용 반영 */
    let targetText = e.target.innerText;

    document.getElementById("textArea").value = targetText;
    console.log("텍스트 창 값 : " +document.getElementById("textArea").value);
    console.log("태그의 값 : " +targetText);
    //console.log(textArea_innerText);
    /* text의 스타일 반영 */

    let fontSize = window.getComputedStyle(e.target).getPropertyValue("font-size");
    let textArea_styleQuery = "color:white; font-size:" + fontSize+ ";"


    /* 상자들의 크기, 위치 설정 */

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

    //console.log("offset들 엘리먼트, 카드순",elementTop, elementLeft, cardTop, cardLeft);
    let top = elementTop - cardTop - 45; // 30은 text 툴바의 높이.
    let left = elementLeft - cardLeft ; //+ cardBlockLeft

    // 텍스트상자는 요소의 넓이, 높이의 1.5배 가져감.
    let width = e.target.offsetWidth * 1.5;
    let height = e.target.offsetHeight * 1.5;
    textArea_styleQuery += "width:"+ width+"px ; height:" + height +"px ;";
    document.getElementById("textArea").style=textArea_styleQuery;


    //위치 반영
    let textEditBox_styleQuery= "position:absolute; top:"+top+"px; left:"+left+"px;  transform:translate(-16.66%, -16.66%);";
    //추가된 넓이 1/3의 절반인 1/6만큼 왼쪽으로 이동. , 위쪽으로는 1/6 + 툴바의 높이만큼
    //let styleQuery= "position:absolute; top:"+top+"px; left:"+left+"px;";
    //console.log(styleQuery);
    document.getElementById("textEditBox").style=textEditBox_styleQuery;


    //텍스트 상자 열기
    document.getElementById("textEditBoxCover").style="display:block;"
    document.getElementById("textArea").focus();
}
function closeTextEditBox(e){
    document.getElementById("textEditBoxCover").style="display:none;"
}

function isTextTag(e){
    let tagName = e.target.tagName;
    tagName= tagName.toLowerCase();
    //console.log("isTextTag, 태그명 : " +tagName);
    switch(tagName){
        case 'h1'   :
        case 'h2'   :   
        case 'h3'   :
        case 'h4'   :
        case 'h5'   :
        case 'h6'   :
        case 'p'    :
        case 'span' : return true;
        default :  return false;
    }
}

function onPreviewClicked(target){
    let templateSource= document.getElementById("templateFrame").contentWindow.document.documentElement.outerHTML;
    //console.log("" + templateSource);
    let form = document.getElementById("previewForm");

    document.getElementById("previewSource").value = templateSource;
    var wnd = window.open("", "previewWindow", "width=1000,height=1000");
    form.submit();
    //#issue 미리보기 기능
}
function onAddClicked(target){
    //템플릿 소스 input에 등록
    let templateSource = document.getElementById("templateFrame").contentWindow.document.documentElement.outerHTML;
    document.getElementById("templateSourceInput").value = templateSource;
    console.log(templateSource);

    //창열기
    let item = document.querySelector("#link-box-cover");
    item.classList.remove('display-none');
    target.classList.add('menu-clicked');
 
}

function onCloseClicked(target){
    let item = document.querySelector("#link-box-cover");
    item.classList.add('display-none');
    document.getElementById("cardAdd").classList.remove('menu-clicked');
}
function onshareClicked(target){
    //클립보드에 복사시키기
    shareUrl ="www.audgka.com/about/kcj0205"
    //prompt("이 명함의 주소가 복사되었습니다. \n게시판이나 메신저 창에서 Ctrl+V를 눌러보세요.", url );
    prompt("다음의 주소를 복사하여 게시판이나 \n메신저 창에서 Ctrl+V를 눌러보세요.", shareUrl );
}
function loadFile(event){
    var output = document.getElementById("output");
    output.src=URL.createObjectURL(event.target.files[0]);
}