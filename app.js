//main file , entry file
var express = require('express');
var app = express(); // 익스프레스 모듈에서 함수를 가져오고, 그 함수를 실행하면 app을 반환
var bodyParser = require('body-parser'); // post 라우팅시 req.body를 사용하기 위한 모듈
var mysql = require("mysql"); 
var js_sha2 = require("sha256"); // 비밀번호 해싱을 위한 모듈
var session = require("express-session");
var fs = require('fs');
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
    var countB = Math.floor(Math.random() * 5 + 1);
    var userName =req.session.userName;
    console.log(userName, " 접속합니다.");
    res.render('main.ejs', {userName : userName, countB:countB});
});

app.get("/help" , (req,res)=>{
    var userName =req.session.userName;

    res.render('help.ejs' ,{userName : userName});
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
    var sql = 'SELECT userId, title, id FROM posts WHERE type = 1';
    connection.query(sql, (err, rows, fields)=>{
        if(err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }else{
            var userName =req.session.userName;
            res.render('boardNotice.ejs', {userName : userName , rows:rows});
        }
    })
})
app.get("/board/ask" , (req,res)=>{
    var sql = 'SELECT userId, title, id FROM posts WHERE type = 2';
    connection.query(sql, (err, rows, fields)=>{
        if(err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }else{
            var userName =req.session.userName;
            res.render('boardAsk.ejs', {userName : userName , rows:rows});
        }
    })

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

app.get("/board/:id" , (req,res)=>{
    var id = req.params.id;
    var userName = req.session.userName;
    var sql = "SELECT * FROM posts WHERE id = ?";
    connection.query(sql, [id], (err, rows, fields)=>{
        if(err){
            console.log(err);
            res.status(500).send("해당 게시물이 없습니다");
        }else{
            var row = rows[0];
            res.render('boardDetail.ejs', {userName:userName , userId : row.userId, userEmail: row.userEmail, type : row.type, title : row.title, description: row.description});   
        }
    });
});



app.post("/board/new" , (req,res)=>{
    console.log(req.body);
    var userId= req.body.userId;
    var userName =req.body.userName;
    if(req.body.email2){
        var email = req.body.email1 + "@" + req.body.email2;
    }else{
        var email = req.body.email1 + "@" +req.body.email3;
    }
    var type = req.body.categoryList;
    var title = req.body.title;
    var content = req.body.content;
    console.log(userId);
    console.log(type);
    console.log(content);
    var sql = "INSERT INTO posts (userId, userEmail, title,  description, type) VALUES(?, ?, ?, ?, ?)"
    var params=[userId, email, title, content, type];
    connection.query(sql, params, (err, rows, fields)=>{
        if(err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }else{
            if( type === 1 ){
                res.redirect('/board/notice');
            }else{
                res.redirect('/board/ask');
            }
        }

    });
});



app.get("/admin" , (req,res)=>{
    var userId = req.session.userId;
    var userName = req.session.userName;
    if(userId === "admin"){
        var sql = "SELECT userId , name FROM user";
        connection.query(sql, (err, rows, field)=>{
            if(err){
                console.log(err);
                res.status(500).send("Internal server error");
            }else{
                console.log(rows[0].userId);
                res.render('admin.ejs' ,{userName:userName,  rows: rows});
                
            }
        });
    }else{
        res.redirect("/main");
    }

})

app.get("/admin/ask" , (req,res)=>{
    var userId = req.session.userId;
    var userName = req.session.userName;
    if(userId === "admin"){
        var sql = 'SELECT userId, title FROM posts WHERE type = 2';
        connection.query(sql, (err, rows, field)=>{
            if(err){
                console.log(err);
                res.status(500).send("Internal server error");
            }else{
                console.log(rows[0].userId);
                res.render('adminAsk.ejs' ,{userName:userName,  rows: rows});
                
            }
        });
    }else{
        res.redirect("/main");
    }

})

app.get("/admin/notice" , (req,res)=>{
    var userId = req.session.userId;
    var userName = req.session.userName;
    if(userId === "admin"){
        var sql = "SELECT userId , name FROM user";
        connection.query(sql, (err, rows, field)=>{
            if(err){
                console.log(err);
                res.status(500).send("Internal server error");
            }else{
                console.log(rows[0].userId);
                res.render('adminNotice.ejs' ,{userName:userName,  rows: rows});
            }
        });
    }else{
        res.redirect("/main");
    }

})

app.post("/ask/delete" , (req,res)=>{
    var sql = "DELETE FROM posts WHERE userId = ?, title = ?";
    var params = [req.body.userId, req.body.title]
    connection.query(sql, params, (err, rows, field)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal server error");
        }else{
            res.redirect('/admin/ask');
        }
    });
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
    var msg = req.query.msg;
    res.render('login.ejs', {msg : msg});
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



//제작페이지
app.get('/audgka/:id/make', (req,res)=>{
    /* if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send("result = " + req.session.count);  */
    var number = req.params.id;
    //res.render('templates/template_'+number+'.ejs' , {userName : req.session.userName});
    res.render('maker.ejs' , {userName : req.session.userName, templateId : number}); 
    // req에서 파라미터로 전송된 id 값을 템플릿에 전송해줌.
});


//명함 등록요청
app.post('/audgka/:id/make', (req,res)=>{
    var userId = req.session.userId;
    var address = req.body.url; // 카드의 url
    var ogTitle = req.body.ogTitle;
    var ogDescription = req.body.ogDescription;
    var ogImage = req.body.ogImage; //#issue submit한 이미지를 받는법.
    var templateSource = req.body.templateSource;
    var templateId = req.params.id;
    var userId = req.session.userId;
    if(!userId) res.redirect('/auth/login'+'?msg=로그인이 필요한 서비스입니다.');

    var sql = "SELECT address FROM user_templates WHERE address = ?"
    connection.query(sql, [address], (err, rows, fields)=>{
        if(err){
            console.log(err);
            res.status(500).send("inner DB error");
        }else{
            if(rows[0]){
                console.log("명함 주소 중복");
                res.send("명함 주소가 중복되었습니다.");
            }else{
                //중복 아닐경우
                sql = "INSERT INTO user_templates (templateId, userId, title, content, ogTitle, ogDescription, ogImage, address) VALUE(?,?,?,?,?,?,?,?)"
                var params = [templateId, userId, "empty", "empty", ogTitle, ogDescription, ogImage, address ];
                connection.query(sql, params, (err,rows,fields)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send("inner DB error");
                    }else{
                        let fileName = ''+address+'.ejs';
                
                        fs.writeFile("./views/about/"+fileName , templateSource, 'utf-8', (e)=>{
                            if(e){
                                console.log(e);
                                res.send("fs error" );
                            }else{
                                res.redirect('/about/'+address);
                            }
                        });
                    }
                });
                
            }
            
        }
    });

/*     let fileName = ''+address+'.ejs';
    //저장 후 렌더링 시켜서 보이기
    
    fs.writeFile("./views/about/"+fileName , templateSource, 'utf-8', (e)=>{
        if(e){
            console.log(e);
            res.send("fs error" );
        }else{
        }
    }); */


    //res.render('templates/template_'+number+'.ejs' , {userName : req.session.userName});
    //res.render('maker.ejs' , {userName : req.session.userName, templateId : number}); 
});

app.get('/about/:id', (req,res)=>{
    var id = req.params.id;
    var sql = "SELECT * FROM user_templates WHERE address = ?";
    var params = [id];
    connection.query(sql, params, (err, rows, fields)=>{
        if(err){
            console.log(err);
            res.status(500).send("inner DB error");
        }else{
            res.render('about/'+id+'.ejs', {ogTitle: rows[0].ogTitle, ogDescription : rows[0].ogDescription, ogImage : rows[0].ogImage });
        }
    });
});

app.get('/about/preview', (req,res)=>{
    res.render('about/preview.ejs', {});
});
//명함 미리보기 post요청
app.post('/about/preview', (req,res)=>{
    var previewSource = req.body.previewSource;
    console.log(previewSource);
    let fileName = 'preview.ejs';
    //저장 후 렌더링 시켜서 보이기
    
    fs.writeFile("./views/about/"+fileName , previewSource, 'utf-8', (e)=>{
        if(e){
            console.log(e);
            res.send("fs error" );
        }else{
            res.redirect('/about/preview');
        }
    });
});




app.get('/audgka/template/:id', (req,res)=>{
    var number = req.params.id;
    let ogTitle = "";
    let ogDescription = "";
    let ogImage = "";
    res.render('templates/template_'+number+'.ejs' , {userName : req.session.userName, ogTitle:ogTitle, ogDescription:ogDescription, ogImage:ogImage});
    // iframe안에서 위의 변수들이 렌더링 되지 않는것을 확인함. 나중에 수정
});


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


app.get("/about/:name", (req, res)=>{
    let name = req.params.name;

    res.render('about/'+name+'.ejs');
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


app.get('/setting/mysql',(req,res)=>{
    var sql = "CREATE TABLE posts ( id bigint(20) unsigned NOT NULL AUTO_INCREMENT, userId varchar(150) NOT NULL, userEmail varchar(150) NOT NULL,title varchar(150) NOT NULL , description TEXT NULL, type varchar(10) NOT NULL, created datetime, hit int(10) unsigned NOT NULL default '0', reviews int(10) unsigned NOT NULL default '0', PRIMARY KEY (id) )";
    /* 수정  : ALTER TABLE posts CHANGE usedId userId varchar(30) NOT NULL; */
    // 한글 ALTER TABLE posts convert to charset utf8
    connection.query(sql,(err, rows, fields)=>{
        if(err) {
            console.log(err);
            res.status(500).send("테이블 생성 오류");
        }else{
            res.send(rows);
        }

    });
})
app.get('/setting/mysql/templates',(req,res)=>{
    var sql = "CREATE TABLE templates ( id INT unsigned NOT NULL AUTO_INCREMENT, userId INT NOT NULL, title varchar(150) NOT NULL , content LONGTEXT NOT NULL, created DATETIME NULL, hit INT unsigned NOT NULL default '0', reviews int(10) unsigned NOT NULL default '0', PRIMARY KEY (id) ) DEFAULT CHARSET=utf8";
    /* 수정  : ALTER TABLE posts CHANGE usedId userId varchar(30) NOT NULL; */
    // 한글 ALTER TABLE posts convert to charset utf8
    connection.query(sql,(err, rows, fields)=>{
        if(err) {
            console.log(err);
            res.status(500).send("테이블 생성 오류");
        }else{
            res.send(rows);
        }

    });
})

app.get('/setting/mysql/user_templates',(req,res)=>{
    var sql = "CREATE TABLE user_templates ( id INT unsigned NOT NULL AUTO_INCREMENT, templateId INT default 0, userId varchar(150) NOT NULL, title varchar(150) NOT NULL , content LONGTEXT NOT NULL, address varchar(150) NOT NULL, ogTitle varchar(150) NOT NULL, ogDescription text NOT NULL, ogImage varchar(150) NOT NULL, created DATETIME NULL, hit INT unsigned NOT NULL default '0', reviews int(10) unsigned NOT NULL default '0', PRIMARY KEY (id) ) DEFAULT CHARSET=utf8";
    /* 수정  : ALTER TABLE posts CHANGE usedId userId varchar(30) NOT NULL; */
    // 한글 ALTER TABLE posts convert to charset utf8
    connection.query(sql,(err, rows, fields)=>{
        if(err) {
            console.log(err);
            res.status(500).send("테이블 생성 오류");
        }else{
            res.send(rows);
        }

    });
})
app.get('/setting/mysql/user_templates/add',(req,res)=>{
/*     var sql = "CREATE TABLE templates ( id INT unsigned NOT NULL AUTO_INCREMENT, userId varchar(150) NOT NULL, template_id INT NOT NULL , content LONGTEXT NOT NULL, created DATETIME NULL, hit INT unsigned NOT NULL default '0', reviews int(10) unsigned NOT NULL default '0', PRIMARY KEY (id) )"; */
    /* 수정  : ALTER TABLE posts CHANGE usedId userId varchar(30) NOT NULL; */
    // 한글 ALTER TABLE posts convert to charset utf8
  /*   connection.query(sql,(err, rows, fields)=>{
        if(err) {
            console.log(err);
            res.status(500).send("테이블 생성 오류");
        }else{
            res.send(rows);
        }

    }); */
    res.render('audgka.ejs');
    console.log('audgka.ejs');
})


app.get('/templates/add',(req,res)=>{
    res.render('templateAdd.ejs');
});

app.post('/templates/add', (req, res)=>{
  let userId = req.body.userId;
  let title = req.body.title;
  let content = req.body.content;
  sql = "INSERT INTO TEMPLATES (userId, title, content) VALUES(?,?,?)" 
  var params = [userId , title, content];
  connection.query(sql, params, (err, rows,fields)=>{
    if(err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }else{
        let pk = rows.insertId;
        let fileName = 'templates/template_'+pk+'.ejs';
        //저장 후 렌더링 시켜서 보이기
        
        fs.writeFile("./views/"+fileName , content, 'utf-8', (e)=>{
            if(e){
                console.log(e);
                res.send("fs error" );
            }else{
                console.log("음");
                res.redirect('/audgka/'+ pk +'/make');
                //? 스크립트를 폼으로 받아,  렌더링 페이지를 넘겨줄때 문제가 생김.
            }
        });
    }
  }) 
})



app.listen(3000, ()=>{
    console.log("Connected 3000 port");
}); // 3000포트 실행, 실행 완료시 콜백함수를 실행함.

//7시 46분