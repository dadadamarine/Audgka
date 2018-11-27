//main file , entry file
var express = require('express');
var app = express(); // 익스프레스 모듈에서 함수를 가져오고, 그 함수를 실행하면 app을 반환
var bodyParser = require('body-parser');
var mysql = require("mysql");

//정적인 파일의 위치 디렉토리를 지정
//public폴더에 정적인 파일 가져다 두면, 사용자 에게 정적인 파일을 서비스 할 수 있음.    
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false})); //이 app으로 들어오는 모든 요청은 이 미들웨어를 먼저 통과한 후에 라우터가 동작하게 됨
//bodyParser: 가장 앞에서 동작, 사용자가 post로 보낸 요청이 있다면 , req객체가 원래 가지고 있지 않던 body를 추가함.
app.set('view engine', 'ejs'); // 뷰 엔진으로 ejs사용 //app.set('views', './views');



var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '123456',
    database : 'o2'
});

connection.connect();
var sql = "SELECT * FROM topic";
connection.query(sql, (err, rows, fields)=>{
    if(err) console.log(err);
    else{
        //console.log('rows', rows);
        //console.log('fields', fields);
    }
} );

connection.end();



app.get("/",(req,res)=>{
    res.render('intro.ejs');
});

app.get("/main", (req,res)=>{ // 라우터
    res.render('main.ejs');
});

app.get("/item",(req,res)=>{
    res.render('item.ejs');
});


app.get("/admit", (req, res)=>{
    res.send('hi admit, <img src="/admit.jpg"></img>');
});

app.get("/login", (req,res)=>{ // 라우터
    res.render('login.ejs');
});

app.post("/login", (req,res)=>{
    res.render('main.ejs')
})

app.get('/form', (req,res)=>{
    res.render('form.ejs');
});

app.get('/form_receiver', (req,res)=>{
    //query string | ?id=2 | 에 따라 다른 값을 보여줌
    //req.query.(input 태그의 name) 으로 쿼리값 사용가능
    var text =req.query.text;
    var textarea = req.query.textarea;
    res.send(text+" , " + textarea);
});

app.post('/form_receiver', (req,res)=>{
    var text = req.body.text;
    //기본적으로는 undefined인 body를 사용하기 위해서는 미들웨어가 필요함

    var textarea = req.body.textarea;
    res.send(text+ " , " + textarea+ " , " + "by POST");
});






app.listen(3000, ()=>{
    console.log("Connected 3000 port");
}); // 3000포트 실행, 실행 완료시 콜백함수를 실행함.