const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   url = require('url');
const   session = require('express-session');
const   methodOverride = require('method-override');
const   multer = require('multer');
const   async = require('async');
const   upload = multer({dest: __dirname + '/../public/images/uploads/menu'});  // 업로드 디렉터리를 설정한다.
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


//  -----------------------------------  메뉴리스트 기능 -----------------------------------------
// (관리자용) 등록된 메뉴리스트를 브라우져로 출력합니다.
const PrintMenuList = (req,res) => {
  let    htmlstream = '';
  let    sql_str;
  let    page = req.params.page;
       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminmenulist.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from menu;"; // 상품조회SQL

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
                                                       menudata : results }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                        page : page,
                                                        page_num : 10,
                                                        leng : Object.keys(results).length, 
                                                        menudata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'메뉴리스트기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 메뉴리스트 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};
// 메뉴 상세정보를 출력합니다.
const PrintMenuDetail = (req,res) => {
  let    htmlstream = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;
       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminmenulistdetail.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from menu where menunum = ?;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, [query.menunum], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                        menudata : results
                                                     }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'메뉴상세정보기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 메뉴상세정보 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};
//  -----------------------------------  메뉴등록기능 -----------------------------------------
// 메뉴등록 입력양식을 브라우져로 출력합니다.
const PrintAddMenuForm = (req,res) => {
    let    htmlstream = '';

       if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminmenuupload.ejs','utf8'); // 괸리자메뉴등록화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
         res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                           'logurl': '/users/logout',
                                           'loglabel': '로그아웃',
                                         }));
       }
       else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'메뉴등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 메뉴등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};
// 메뉴등록 양식에서 입력된 메뉴정보를 신규로 등록(DB에 저장)합니다.
const AddMenu = (req,res) => {
  let    body = req.body;
  let    htmlstream = '';
  let    datestr, y, m, d, regdate;
  let    prodimage = '/images/uploads/menu/'; // 상품이미지 저장디렉터리
  let    picfile = req.file;
  let    result = { originalName  : picfile.originalname,
                   size : picfile.size     }

       console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).

       if (req.session.auth && req.session.admin) {
          if (body.menuname == '' || datestr == '') {
             console.log("메뉴이름이 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">메뉴이름이 입력되지 않아 등록할 수 없습니다');
          }
          else {

              prodimage = prodimage + picfile.filename;
              db.query('INSERT INTO menu(menuname, meterial, difficulty, category, recipenum, image, recipeexistence, uploaduser) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [body.menuname, body.meterial, body.difficulty, body.category, body.recipenum, prodimage, 'X', body.uploaduser], (error, results, fields) => {
               if (error) {
                   console.log(error);
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'메뉴등록 오류',
                                 'warn_message':'메뉴를 등록할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                } else {
                   console.log("메뉴등록에 성공하였으며, DB에 메뉴가 등록되었습니다.!");
                   res.redirect('/adminmenu/list/1');
                }
           });
       }
      }
     else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'메뉴등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 메뉴등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};
//  -----------------------------------  메뉴삭제기능 -----------------------------------------
// 삭제메뉴리스트를 브라우저에 출력합니다.
const PrintDeleteMenuForm = (req,res) => {
  let    htmlstream = '';
  let    sql_str;
  let    page = req.params.page;
       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminmenudelete.ejs','utf8'); // 괸리자메뉴삭제리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from menu;"; // 상품조회SQL

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
                                                       menudata : results }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                        page : page,
                                                        page_num : 10,
                                                        leng : Object.keys(results).length,                                                      
                                                        menudata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'메뉴삭제기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 메뉴삭제 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};
// 삭제메뉴리스트의 체크박스 정보를 받아 DB로부터 메뉴를 삭제합니다.
const DeleteMenu = (req,res) => {
  let    sql_str1;
  let    sql_str2;
  let    htmlstream = '';
  let    body = req.body;
    sql_str1 = "DELETE from menu where menunum = ?";
    sql_str2 = "DELETE from recipe where menunum = ?";
    console.log(body.menunum);
    //console.log(typeof(body.usernum));
    if(typeof(body.menunum) == "string"){
      async.waterfall([
        function(callback){
          db.query(sql_str2,[body.menunum], (error, results, fields) => {  // 상품조회 SQL실행
            if (error) {
                htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'메뉴삭제 오류',
                                 'warn_message':'메뉴를 삭제할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                //res.status(562).end("AdminPrintProd: DB query is failed")  // 조회된 상품이 없다면, 오류메시지 출력
                console.log(error);
            }        
        }); // db.query()
        callback(null);
        },
        function(callback){
          db.query(sql_str1,[body.menunum], (error, results, fields) => {  // 상품조회 SQL실행
            if (error) {
                htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'메뉴삭제 오류',
                            'warn_message':'메뉴를 삭제할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                            'return_url':'/' }));
                //res.status(562).end("AdminPrintProd: DB query is failed")  // 조회된 상품이 없다면, 오류메시지 출력
                console.log(error);
            }
        }); // db.query()
        callback(null);
        }
      ], function(error, result){
        if(error){
          console.log(error);
        }
      });
      res.redirect('/adminmenu/list/1');
    }else{
      async.waterfall([ // 여러개의 메뉴를 삭제할 경우에는 비동기식을 동기식으로 바꿔준다.
        function(callback){
          for(var i=0;i<body.menunum.length;i++){
            db.query(sql_str2,[body.menunum[i]], (error, results, fields) => {  // 상품조회 SQL실행
                if (error) {
                    htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                    res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'메뉴삭제 오류',
                                 'warn_message':'메뉴를 삭제할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                    //res.status(562).end("AdminPrintProd: DB query is failed")  // 조회된 상품이 없다면, 오류메시지 출력
                    console.log(error);
                }
            }); // db.query()
          }
          callback(null);
        },
        function(callback){
          for(var i=0;i<body.menunum.length;i++){
            db.query(sql_str1,[body.menunum[i]], (error, results, fields) => {  // 상품조회 SQL실행
                if (error) {
                    htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                    res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                   'warn_title':'메뉴삭제 오류',
                                   'warn_message':'메뉴를 삭제할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                   'return_url':'/' }));
                    //res.status(562).end("AdminPrintProd: DB query is failed")  // 조회된 상품이 없다면, 오류메시지 출력
                    console.log(error);
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
      res.redirect('/adminmenu/list');
    }
};

// 메뉴리스트에서 검색결과를 출력합니다.
const SearchMenu = (req,res) => {
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
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminmenulist.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from menu where menuname = ?"; // 상품조회SQL
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, [query.menuname],(error, results, fields) => {  // 상품조회 SQL실행
               if (error) { 
                 console.log(error);
                 res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 사용자메뉴
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/adminmenulist.ejs','utf8'); // 카테고리별 제품리스트
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
                                                        menudata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'로그인 필요',
                            'warn_message':'메뉴검색을 하려면, 로그인이 필요합니다.',
                            'return_url':'/' }));
       }
};
// 메뉴삭제리스트에서 검색결과를 출력합니다.
const SearchMenuDelete = (req,res) => {
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
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminmenudelete.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from menu where menuname = ?"; // 상품조회SQL
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, [query.menuname],(error, results, fields) => {  // 상품조회 SQL실행
               if (error) { 
                 console.log(error);
                 res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 사용자메뉴
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/adminmenudelete.ejs','utf8'); // 카테고리별 제품리스트
                   htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
                   res.end(ejs.render(htmlstream2,  {  'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       page : page,
                                                       page_num : 10,
                                                       leng : Object.keys(results).length,
                                                       menudata : results
                                                    }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                        page : page,
                                                        page_num : 10,
                                                        leng : Object.keys(results).length,
                                                        menudata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'로그인 필요',
                            'warn_message':'레시피검색을 하려면, 로그인이 필요합니다.',
                            'return_url':'/' }));
       }
};
// REST API의 URI와 핸들러를 매핑합니다.
router.get('/list/:page', PrintMenuList);
router.get('/listdetail', PrintMenuDetail);
router.get('/upload', PrintAddMenuForm);
router.post('/upload', upload.single('photo'), AddMenu);
router.get('/delete/:page', PrintDeleteMenuForm);
router.delete('/delete', DeleteMenu);
router.get('/search', SearchMenu);
router.get('/searchdelete', SearchMenuDelete);
router.get('/', function(req, res) { res.send('respond with a resource 111'); });

module.exports = router;
