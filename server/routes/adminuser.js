const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   url = require('url');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   methodOverride = require('method-override');
const   async = require('async');
const   router = express.Router();

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'root',            // DB접속 아이디
    password: 'gachon654321',  // DB암호
    database: 'project'         //사용할 DB명
});
router.use(methodOverride('_method'));
router.use(bodyParser.urlencoded({ extended: false }));
const PrintUserList = (req,res) => {
  let    htmlstream = '';
  let    sql_str;
  let    page = req.params.page;
       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminuserlist.ejs','utf8'); // 회원리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT userid, password, email from users where userid != 'admin'"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                  'logurl': '/users/logout',
                                                  'loglabel': '로그아웃',
                                                   page : page,
                                                   page_num : 10,
                                                   leng : Object.keys(results).length,
                                                   userdata : results }));  // 조회된 상품정보
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃', 
                                                        page : page,
                                                        page_num : 10,
                                                        leng : Object.keys(results).length,
                                                        userdata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'회원관리기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 회원관리 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};
const PrintDeleteUserList = (req,res) => {
  let    htmlstream = '';
  let    sql_str;
  let    page = req.params.page;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminuserdelete.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from users where userid != 'admin'"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                    res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                      'logurl': '/users/logout',
                                                      'loglabel': '로그아웃',
                                                       page : page,
                                                       page_num : 10,
                                                       leng : Object.keys(results).length,
                                                       userdata : results }));  // 조회된 상품정보
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                        page : page,
                                                        page_num : 10,
                                                        leng : Object.keys(results).length,
                                                        userdata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'회원관리기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 회원관리 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};

const DeleteUser = (req,res) => {
  let    sql_str;
  let    body = req.body;
    sql_str = "DELETE from users where usernum = ?";
    console.log(body.usernum);
    //console.log(typeof(body.usernum));
    if(typeof(body.usernum) == "string"){
      db.query(sql_str,[body.usernum], (error, results, fields) => {  // 상품조회 SQL실행
          if (error) {
              //res.status(562).end("AdminPrintProd: DB query is failed")  // 조회된 상품이 없다면, 오류메시지 출력
              console.log(error);
              htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                'warn_title':'회원삭제 오류',
                                'warn_message':'조회된 회원이 없습니다.',
                                'return_url':'/' }));
          }else{
            res.redirect('/adminuser/list');
          }
      }); // db.query()
    }else{
      async.waterfall([ // 여러명의 회원을 삭제할 경우에는 비동기식을 동기식으로 바꿔준다.
        function(callback){
          for(var i=0;i<body.usernum.length;i++){
            db.query(sql_str,[body.usernum[i]], (error, results, fields) => {  // 상품조회 SQL실행
                if (error) {
                    //res.status(562).end("AdminPrintProd: DB query is failed")  // 조회된 상품이 없다면, 오류메시지 출력
                    console.log(error);
                    htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                    res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'회원삭제 오류',
                                      'warn_message':'조회된 회원이 없습니다.',
                                      'return_url':'/' }));
                    }
            }); // db.query()
          }
          callback(null);
        }
      ], function(error, result){
        if(error){
          console.log(error);
        }
      });
      res.redirect('/adminuser/list');
    }
};
//회원검색
const SearchUser = (req,res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  let    page = req.params.page;
  const  query = url.parse(req.url, true).query;
       //console.log(body.productname);
       console.log("넘어온 값:" + query.userid);
       if (req.session.auth)   {   // 로그인된 경우에만 처리한다

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminuserlist.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from users where userid = ?"; // 상품조회SQL
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, [query.userid],(error, results, fields) => {  // 상품조회 SQL실행
               if (error) { 
                 console.log(error);
                 res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 사용자메뉴
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/adminuserlist.ejs','utf8'); // 카테고리별 제품리스트
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
                   res.end(ejs.render(htmlstream2,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃', 
                                                        page : page,
                                                        page_num : 10,
                                                        leng : Object.keys(results).length,
                                                        userdata : results         
                                                    }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     console.log(results);
                     console.log(Object.keys(results).length);
                     res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                        page : page,
                                                        page_num : 10,
                                                        leng : Object.keys(results).length,
                                                        userdata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'로그인 필요',
                            'warn_message':'회원검색을 하려면, 로그인이 필요합니다.',
                            'return_url':'/' }));
       }
};
//삭제할 회원검색
const SearchDelete = (req,res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  let    page = req.params.page;
  const  query = url.parse(req.url, true).query;
       //console.log(body.productname);
       console.log("넘어온 값:" + query.userid);
       if (req.session.auth)   {   // 로그인된 경우에만 처리한다

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminuserdelete.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from users where userid = ?"; // 상품조회SQL
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, [query.userid],(error, results, fields) => {  // 상품조회 SQL실행
               if (error) { 
                 console.log(error);
                 res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 사용자메뉴
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/adminuserdelete.ejs','utf8'); // 카테고리별 제품리스트
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
                   res.end(ejs.render(htmlstream2,  {  'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       page : page,
                                                       page_num : 10,
                                                       leng : Object.keys(results).length,
                                                       userdata : results
                                                    }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                        page : page,
                                                        page_num : 10,
                                                        leng : Object.keys(results).length,
                                                        userdata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'로그인 필요',
                            'warn_message':'회원검색을 하려면, 로그인이 필요합니다.',
                            'return_url':'/' }));
       }
};
router.get('/list/:page', PrintUserList);// 구매자 리스트를 출력
router.get('/delete/:page', PrintDeleteUserList);
router.delete('/delete', DeleteUser);
router.get('/search', SearchUser);
router.get('/searchdelete', SearchDelete);
router.get('/', function(req, res) { res.send('respond with a resource 111'); });

module.exports = router;
