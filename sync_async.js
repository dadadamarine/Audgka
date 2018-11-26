var fs = require("fs");

// sync방식
console.log(1);
var data = fs.readFileSync('data.txt', {encoding:'utf8'});
console.log(data);  


//async 방식


console.log(2);
fs.readFile('data.txt', {encoding:'utf8'}, (err, data)=>{
    //readfile실행후에 끝나면, readFile 함수는 전달된 익명함수를 실행함. 에러있으면 에러를전달, 데이터가 있으면 데이터 전달. (에러가 없으면 err엔 null이 전달)
    console.log(3);
    console.log(data);
});
console.log(4);