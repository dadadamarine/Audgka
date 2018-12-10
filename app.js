//main file , entry file
var express = require('express');
var app = express(); // 익스프레스 모듈에서 함수를 가져오고, 그 함수를 실행하면 app을 반환
var bodyParser = require('body-parser'); // post 라우팅시 req.body를 사용하기 위한 모듈
var mysql = require("mysql"); 
var js_sha2 = require("sha256"); // 비밀번호 해싱을 위한 모듈
var session = require("express-session");
//정적인 파일의 위치 디렉토리를 지정
//public폴더에 정적인 파일 가져다 두면, 사용자 에게 정적인 파일을 서비스 할 수 있음.    
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false})); //이 app으로 들어오는 모든 요청은 이 미들웨어를 먼저 통과한 후에 라우터가 동작하게 됨
//bodyParser: 가장 앞에서 동작, 사용자가 post로 보낸 요청이 있다면 , req객체가 원래 가지고 있지 않던 body를 추가함.
app.use(session({
    secret:"audgkaleremword",
    resave: false,
    saveUninitialized: true
}))

app.set('view engine', 'ejs'); // 뷰 엔진으로 ejs사용 //app.set('views', './views');
app.set('views', './views'); // 노드가 템플릿 파일을 찾을때, views폴더 안에있는 경로로 템플릿 파일을 찾게됨 // 안적어도 됨.


var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '123456',
    database : 'o2'
});

connection.connect();



/*조회 :  var sql = "SELECT * FROM topic";

/*삽입 :  var sql = "INSERT INTO topic (author, title, description) VALUES('kdj', 'swift', 'mac programing la..')";

/*삽입 :  var sql = "INSERT INTO topic (author, title, description) VALUES(?,?,?)";
var params= ['supervisor', 'watcher', 'ddfajknskef'];

/*변경 :  var sql = "UPDATE topic SET title=?, author=? WHERE id=?";
var params= ['NPM', 'kdj', '1']; */

/* var sql = "DELETE FROM topic WHERE id=?";
var params=[1]; */

/* connection.query(sql, params, (err,rows,fields)=>{
    if(err) console.log(err);
    else{
        console.log('rows', rows);
    }
}); */




app.get("/",(req,res)=>{
   // res.render('intro.ejs');
   res.redirect("/main");
});

app.get("/main", (req,res)=>{ // 라우터
    var userName =req.session.userName;
    console.log(userName, " 접속합니다.");
    res.render('main.ejs', {userName : userName});
});
app.get("/help" , (req,res)=>{
    res.redirect('/board/notice');
})
/* app.get("/item",(req,res)=>{
    res.render('item.ejs');
}); */
app.get("/templates" , (req,res)=>{
    var userName =req.session.userName;
    res.render('templates.ejs',{userName : userName});
})

app.get("/board" , (req,res)=>{
    res.redirect('/board/notice');
})
app.get("/board/notice" , (req,res)=>{
    var userName =req.session.userName;
    res.render('boardNotice.ejs', {userName : userName});
})
app.get("/board/ask" , (req,res)=>{
    var userName =req.session.userName;
    res.render('boardAsk.ejs', {userName : userName});
})
app.get("/board/new" , (req,res)=>{
    var userId= req.session.userId;
    var userName =req.session.userName;
    if(userId && userName){
        res.render('boardWrite.ejs',{ userId : userId ,userName : userName});
    }else{
        res.redirect('/auth/login');
    }
})



app.get("/admin" , (req,res)=>{
    var userId = req.session.userId;
    if(userId === "admin"){
        var sql = "SELECT userId , name FROM user";
        connection.query(sql, (err, rows, field)=>{
            if(err){
                console.log(err);
                res.status(500).send("Internal server error");
            }else{
                console.log(rows[0].userId);
                res.render('admin.ejs' ,{rows: rows});
                
            }
        });
    }else{
        res.redirect("/main");
    }

})

app.post("/auth/delete" , (req,res)=>{
    var sql = "DELETE FROM user WHERE userId = ?";
    console.log(req.body.userId);
    var params = [req.body.userId]
    connection.query(sql, params, (err, rows, field)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal server error");
        }else{
            res.redirect('/admin');
        }
    });
})

app.get("/auth/login", (req,res)=>{ // 라우터 , 로그인 페이지
    res.render('login.ejs');
});

app.post("/auth/login", (req,res)=>{ // 로그인 요청
    var sql = "SELECT pw, name FROM user WHERE userId = ?";
    var userId= req.body.userId;
    var userPW = req.body.userPW;
    var userName;
    connection.query(sql, [userId], (err, rows, field)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal server error");
        }else{
            if(!rows[0]){
                //아이디가 올바르지 않음.
                res.redirect('/auth/login');
            }else if(js_sha2(userPW) === rows[0].pw){
                // 성공
                var userName = rows[0].name;
                console.log(new Date() ," 로그인 : " , userId , userName );
                req.session.userId = userId;
                req.session.userName = userName;
                res.redirect('/main');
            }else{
                // 비밀번호 오류
                console.log(new Date() ," 비밀번호 오류 : " , userId );
                res.redirect('/auth/login');
            }
        }
    });
});

app.get("/auth/logout", (req,res)=>{
    delete req.session.userName; //delete: 객체에서 특정 속성 제거 , js명령어
    delete req.session.userId;
    res.redirect('/main');
});

app.get("/auth/signup", (req,res)=>{
    res.render('signupAgree.ejs');
});

app.get("/auth/signup/info", (req,res)=>{
    res.render('signup.ejs');
    
});

app.post("/auth/signup", (req,res)=>{
    var sql = "INSERT INTO user (userId, pw, name) VALUE(?, SHA2(?,256), ?)";
    var params = [req.body.userId, req.body.userPW, req.body.userName];
    connection.query(sql , params, (err,rows,fields)=>{
        if(err){
            console.log('err');
            res.status(500).send("회원가입에 실패하였습니다.");
        }else{
            res.redirect('/auth/login');
        }
    })

});

app.get('/audgka/:id/make', (req,res)=>{
    /* if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send("result = " + req.session.count);  */
    res.render('maker.ejs' , {userName : req.session.userName});
});

/* 
app.get('/topic/add', (req,res)=>{
    var sql = "SELECT id, title FROM topic";
    connection.query(sql, (err, rows, fields)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal server error");
        }else{
            res.render('add.ejs', {topics:rows});
        }
        
    })

}); */

app.get(['/topic', '/topic/:id'], (req,res)=>{
    
    var sql = "SELECT id, title FROM topic;";   
    connection.query(sql, (err, topics, fields)=>{
        
        if(err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }
        else{
            var id= req.params.id;
            if(id){
                var sql = "SELECT * FROM topic WHERE id=?";
                connection.query(sql, [id], (err, topic, fields)=>{
                    if(err) console.log(err);
                    else{
                        res.render('topic.ejs', {topics : topics , topic: topic[0]}); // 토픽은 한개여도 배열로 리턴됨 
                    }
                });
            }else{
                res.render('topic.ejs', {topics : topics, topic:""} );  
            }
        }
    });
});



app.post('/topic', (req,res)=>{
    var sql = "INSERT INTO topic (title , description, author) VALUES(?, SHA2(?,256), ?)"
    var params=[req.body.title, req.body.description, req.body.author];
    connection.query(sql, params, (err, rows, fields)=>{
        if(err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }else{
            res.redirect('/topic/'+rows.insertId);
        }

    });
})


app.get("/audgka/:id", (req, res)=>{
    res.render('audgka.ejs');
});


/* 
app.get("/admit", (req, res)=>{
    res.send('hi admit, <img src="/admit.jpg"></img>');
});
 */
app.get('/form', (req,res)=>{
    res.render('form.ejs');
});

 
app.post('/form_receiver', (req,res)=>{
    var text = req.body.text;
    //기본적으로는 undefined인 body를 사용하기 위해서는 미들웨어가 필요함

    var textarea = req.body.textarea;
    res.send(text+ " , " + textarea+ " , " + "by POST");
});


app.get('setting/mysql',(req,res)=>{
    var sql = "CREATE TABLE posts ( id bigint(20) unsigned NOT NULL AUTO_INCREMENT, subject varchar(255) NOT NULL, content mediumtext, created datetime, user_id int(10) unsigned NOT NULL, user_name varchar(32) NOT NULL, hit int(10) unsigned NOT NULL default '0',   PRIMARY KEY (id) )";
    connection.query(sql,(err, rows, fields)=>{
        if(err) {
            console.log(err);
            res.status(500).send("테이블 생성 오류");
        }else{
            res.redirect('/topic/'+rows.insertId);
        }

    });
})



app.listen(3000, ()=>{
    console.log("Connected 3000 port");
}); // 3000포트 실행, 실행 완료시 콜백함수를 실행함.
