//main file , entry file
var express = require('express');
var app = express(); // 익스프레스 모듈에서 함수를 가져오고, 그 함수를 실행하면 app을 반환


//정적인 파일의 위치 디렉토리를 지정
//public폴더에 정적인 파일 가져다 두면, 사용자 에게 정적인 파일을 서비스 할 수 있음.
app.use(express.static('public'));



app.get("/", (req,res)=>{ // 라우터
    res.send("Hello home page");
});

app.get("/admit", (req, res)=>{
    res.send('hi admit, <img src="/admit.jpg"></img>');
});

app.get("/login", (req,res)=>{ // 라우터
    res.send("Hello login page");
});

app.listen(3000, ()=>{
    console.log("Connected 3000 port");
}); // 3000포트 실행, 실행 완료시 콜백함수를 실행함.