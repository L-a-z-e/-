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
const   upload = multer({dest: __dirname + '/../public/images/uploads/recipes'});  // 업로드 디렉터리를 설정한다.
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

const PrintRecipeList = (req,res) => {
    let    htmlstream = '';
    let    sql_str;
    let    page = req.params.page;
         if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
             htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminrecipelist.ejs','utf8'); // 괸리자메인화면
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
             sql_str = "SELECT * from menu;"; // 상품조회SQL
  
             res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
  
             db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
                 if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
                 else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                     res.end(ejs.render(htmlstream,  {   'title' : '자취세끼',
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
                              'warn_title':'레시피관리기능 오류',
                              'warn_message':'관리자로 로그인되어 있지 않아서, 레시피관리 기능을 사용할 수 없습니다.',
                              'return_url':'/' }));
         }
  
};
const PrintRecipeDetail = (req,res) => {
  let    htmlstream = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;
       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminrecipelistdetail.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from recipe where menunum = ?;"; 

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, [query.menunum], (error, results, fields) => {  
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {  
                     res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                        image : query.image,
                                                        menuname : query.menuname,
                                                        menunum : query.menunum,
                                                        recipedata : results,
                                                        recipenum : query.recipenum,
                                                        leng : Object.keys(results).length
                                                     }));  
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'레시피상세정보기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 레시피상세정보 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};
const PrintAddRecipeForm = (req,res) => {
    let    htmlstream = '';
    const  query = url.parse(req.url, true).query;
    if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
      htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminrecipeupload.ejs','utf8'); // 괸리자레시피등록화면
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

      res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
      res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                        'logurl': '/users/logout',
                                        'loglabel': '로그아웃',
                                         menuname : query.menuname,
                                         recipenum : query.recipenum,
                                         menunum : query.menunum
                                      }));
    }
    else {
      htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
      res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                         'warn_title':'레시피등록기능 오류',
                         'warn_message':'관리자로 로그인되어 있지 않아서, 레시피등록 기능을 사용할 수 없습니다.',
                         'return_url':'/' }));
    }

};
const AddRecipe = (req,res) => {
    let    body = req.body;
    let    htmlstream = '';
    let    sql_str;
    //let    datestr, y, m, d, regdate;
    let    recipeorderimage = '/images/uploads/recipes/'; // 상품이미지 저장디렉터리
    var    recipe = new Array(10);
    var    recipeimage = new Array(10);
    let    picfile = req.files;
    /*let    result = { originalName  : picfile.originalname,
                     size : picfile.size     }*/
         //레피시 조리 방법을 배열로 받아옵니다.
         for(var i = 0; i < 10; i ++){
             recipe[i] = null;
             recipeimage[i] = null;
         }           
         // 각 조리순서당 이미지를 배열로 받아옵니다.
         for(var i = 0; i < picfile.length; i++){
             recipe[i] = body.recipeorder[i];
             recipeimage[i] = recipeorderimage + picfile[i].filename;
         }
         //console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).
         //console.log(picfile);
         sql_str = "INSERT INTO recipe VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
         if (req.session.auth && req.session.admin) { 
                //prodimage = prodimage + picfile.filename;         
                db.query(sql_str,
                      [parseInt(body.menunum), recipe[0], recipeimage[0], recipe[1], recipeimage[1], recipe[2],recipeimage[2],
                      recipe[3], recipeimage[3], recipe[4], recipeimage[4], recipe[5], recipeimage[5],
                      recipe[6], recipeimage[6], recipe[7], recipeimage[7], recipe[8], recipeimage[8],
                      recipe[9], recipeimage[9]], (error, fields) => {
                 if (error) {
                     console.log(error);
                     htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                     res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                   'warn_title':'레시피등록 오류',
                                   'warn_message':'레시피를 등록할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                   'return_url':'/' }));
                  } else {
                     console.log("레시피등록에 성공하였으며, DB에 레시피가 등록되었습니다.!");
                     res.redirect('/adminrecipe/list/1');
                  }
                });
        }
       else {
           htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
           res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                              'warn_title':'레시피등록기능 오류',
                              'warn_message':'관리자로 로그인되어 있지 않아서, 레시피등록 기능을 사용할 수 없습니다.',
                              'return_url':'/' }));
         }
};
const PrintUpdateRecipeForm = (req,res) => {
    let    htmlstream = '';
    const  query = url.parse(req.url, true).query;
    if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
      htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminrecipeupdate.ejs','utf8'); // 괸리자레시피등록화면
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

      res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
      res.end(ejs.render(htmlstream,  { 'title' : '자취세끼',
                                        'logurl': '/users/logout',
                                        'loglabel': '로그아웃',
                                         menuname : query.menuname,
                                         recipenum : query.recipenum,
                                         menunum : query.menunum
                                      }));
    }
    else {
      htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
      res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                         'warn_title':'레시피등록기능 오류',
                         'warn_message':'관리자로 로그인되어 있지 않아서, 레시피등록 기능을 사용할 수 없습니다.',
                         'return_url':'/' }));
    }

};
const UpdateRecipe = (req,res) => {
    let    body = req.body;
    let    htmlstream = '';
    let    sql_str;
    //let    datestr, y, m, d, regdate;
    let    recipeorderimage = '/images/uploads/recipes/'; // 상품이미지 저장디렉터리
    var    recipe = new Array(10);
    var    recipeimage = new Array(10);
    let    picfile = req.files;
    /*let    result = { originalName  : picfile.originalname,
                     size : picfile.size     }*/
         //레피시 조리 방법을 배열로 받아옵니다.
         for(var i = 0; i < 10; i ++){
             recipe[i] = null;
             recipeimage[i] = null;
         }           
         // 각 조리순서당 이미지를 배열로 받아옵니다.
         for(var i = 0; i < picfile.length; i++){
             recipe[i] = body.recipeorder[i];
             recipeimage[i] = recipeorderimage + picfile[i].filename;
         }
         //console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).
         //console.log(picfile);
         sql_str = "UPDATE recipe SET recipeorder1 = ?, orderimage1 = ?, recipeorder2 = ?, orderimage2 = ?," +
         "recipeorder3 = ?, orderimage3 = ?, recipeorder4 = ?, orderimage4 = ?, recipeorder5 = ?, orderimage5 = ?," +
         "recipeorder6 = ?, orderimage6 = ?, recipeorder7 = ?, orderimage7 = ?, recipeorder8 = ?, orderimage8 = ?," +
         "recipeorder9 = ?, orderimage9 = ?, recipeorder10 = ?, orderimage10 = ? where menunum = ?";
         if (req.session.auth && req.session.admin) { 
                //prodimage = prodimage + picfile.filename;         
                db.query(sql_str,
                      [recipe[0], recipeimage[0], recipe[1], recipeimage[1], recipe[2],recipeimage[2],
                      recipe[3], recipeimage[3], recipe[4], recipeimage[4], recipe[5], recipeimage[5],
                      recipe[6], recipeimage[6], recipe[7], recipeimage[7], recipe[8], recipeimage[8],
                      recipe[9], recipeimage[9], parseInt(body.menunum)], (error, fields) => {
                 if (error) {
                     console.log(error);
                     htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                     res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                   'warn_title':'레시피수정 오류',
                                   'warn_message':'레시피를 수정할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                   'return_url':'/' }));
                  } else {
                     console.log("레시피수정에 성공하였으며, DB에 레시피가 수정되었습니다.!");
                     res.redirect('/adminrecipe/list/1');
                  }
                });
        }
       else {
           htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
           res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                              'warn_title':'레시피등록기능 오류',
                              'warn_message':'관리자로 로그인되어 있지 않아서, 레시피등록 기능을 사용할 수 없습니다.',
                              'return_url':'/' }));
         }
};
// 레시피를 메뉴이름으로 검색합니다.
const SearchRecipe = (req,res) => {
    let    htmlstream = '';
    let    htmlstream2 = '';
    let    sql_str;
    let    page = req.params.page;
    const  query = url.parse(req.url, true).query;
         console.log("넘어온 값:" + query.userid);
         if (req.session.auth && req.session.admin)   {   // 로그인된 경우에만 처리한다
  
             htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 사용자메뉴
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminrecipelist.ejs','utf8'); // 카테고리별 제품리스트
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
                     htmlstream2 = htmlstream2 + fs.readFileSync(__dirname + '/../views/adminrecipelist.ejs','utf8'); // 카테고리별 제품리스트
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
// REST API의 URI와 핸들러를 매핑합니다.

router.get('/', function(req, res) { res.send('respond with a resource 111'); });
router.get('/list/:page', PrintRecipeList);
router.get('/listdetail', PrintRecipeDetail);
router.get('/upload', PrintAddRecipeForm);
router.post('/upload', upload.array('photo'), AddRecipe);
router.get('/update', PrintUpdateRecipeForm);
router.put('/update', upload.array('photo'), UpdateRecipe);
router.get('/search', SearchRecipe);
module.exports = router;
