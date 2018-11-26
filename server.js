//node.js 중 http 모듈을 사용
const http = require('http');


const hostname = '127.0.0.1';
const port = 3000;

//서버 객체 생성
// 서버를 생성했을때 출력할 내용(res인자)
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
}); 


// 바라보고 있을 포트 + 어떤 ip를 타고온 사람을 수용할 것인가(hostname)
// listen 은 시간이 걸리는 작업이기에, 비동기로 작동하게 함 
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});