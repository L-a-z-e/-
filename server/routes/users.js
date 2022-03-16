const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'root',            // DB접속 아이디
    password: 'gachon654321',  // DB암호
    database: 'project'         //사용할 DB명
});
router.get('/', function(req, res) { res.send('respond with a resource 111'); });

// ------------------------------------  로그인기능 --------------------------------------

// 로그인 화면을 웹브라우져로 출력합니다.
const PrintLoginForm = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/login_form.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
           res.end(ejs.render(htmlstream,  { 'title' : '자취세끼site',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',                                          
                                              }));
       }
       else {
          res.end(ejs.render(htmlstream, { 'title' : '자취세끼site',
                                          'logurl': '/users/auth',
                                          'loglabel': '로그인',                                  
                                          }));
       }

};

// 로그인을 수행합니다. (사용자인증처리)
const HandleLogin = (req, res) => {
  let body = req.body;
  let userid, userpass, username;
  let sql_str;
  let htmlstream = '';

      console.log(body.uid);
      console.log(body.pass);
      htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
      if (body.uid == '' || body.pass == '') {
         console.log("아이디나 암호가 입력되지 않아서 로그인할 수 없습니다.");
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_title':'로그인 오류',
                                     'warn_message':'아이디나 암호가 입력되지 않아서 로그인할 수 없습니다.',
                                     'return_url':'/' }));
      }
      else {
       sql_str = "SELECT userid, password from users where userid ='"+ body.uid +"' and password='" + body.pass + "';";
       console.log("SQL: " + sql_str);
       db.query(sql_str, (error, results, fields) => {
         if (error) { res.status(562).end("Login Fail as No id in DB!"); }
         else {
            if (results.length <= 0) {  // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)
                  res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_title':'로그인 오류',
                                     'warn_message':'등록된 계정이나 암호가 틀립니다.',
                                     'return_url':'/' }));
             } else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)
               results.forEach((item, index) => {
                  userid = item.userid;  userpass = item.password; username = item.username;
                  console.log("DB에서 로그인성공한 ID/암호:%s/%s", userid, userpass);
                  if (body.uid == userid && body.pass == userpass) {
                     req.session.auth = 99;      // 임의로 수(99)로 로그인성공했다는 것을 설정함
                     req.session.who = username; // 인증된 사용자명 확보 (로그인후 이름출력용)
                     if (body.uid == 'admin')    // 만약, 인증된 사용자가 관리자(admin)라면 이를 표시
                          req.session.admin = true;
                     res.redirect('/');
                  }
                }); /* foreach */
              } // else
            }  // else
       });
   }
}
const HandleSignUp = (req,res) =>{
    //이메일 유효성검사 코드
    let reg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    console.log('Android에서 회원가입 요청 보냄');
    let sql_str1 = 'SELECT * FROM users WHERE userid = ?';
    let sql_str2 = 'INSERT INTO users(userid, password, email) VALUES(?,?,?)';
    let body = req.body;
    console.log(req.body);
    console.log('POST 데이터 받음');
    db.query(sql_str1, [body.userid], (error, results) => {
        if (error) {     
            console.log(error);
            res.end("error");
        } else {
            // 입력받은 데이터가 이메일 양식인지 판단합니다
            if(reg.test(body.email) == false){
              res.end("emailerror");
            }
            else if (results[0] == null && body.password1 == body.password2) {
                db.query(sql_str2, [body.userid, body.password1, body.email], (error) => {
                        if (error) {
                            res.end("error");
                            console.log(error);
                        } else {
                            console.log('Insertion into DB was completed!');
                            res.end("OK");
                        }
                }); // db.query();
            } else {
                  res.end("error");
            }              
      }
    });
};
const HandleLoginMobile = (req,res) => {
    console.log('Android에서 로그인 요청 보냄');
    let sql_str = 'SELECT * FROM users WHERE userid = ?';
    let body = req.body;
    console.log(req.body);
    console.log('POST 데이터 받음');
    db.query(sql_str, [body.userid], (error, results) => {
        if (error) {     
            console.log(error);
            res.end("error");
        } else {
            if (results[0] == null) {
              res.end("DB_ERROR");
            } else {
                  if(body.password == results[0].password){
                      res.end("SUCCESS");
                      req.session.auth = 99;      // 임의로 수(99)로 로그인성공했다는 것을 설정함
                      req.session.who = body.userid;
                  }else{
                      res.end("PASSWORD_ERROR");
                      
                  }
            }
        }                     
    });
};
const UserFindId = (req,res) => {
  let body=req.body;
  console.log('Android에서 아이디찾기 요청 보냄');
  let sql_str = 'SELECT * FROM users WHERE email = ?';
  console.log(body);
    console.log('POST 데이터 받음');
  db.query(sql_str, [body.email], (error, results) => {
    if (error) {     
        console.log(error);
        res.end("error");
    } else {
        if (results[0] == null) {
          res.end("DB_ERROR");
        } else {              
           res.end(results[0].userid);              
        }
    }  
  });    
  
};
const UserFindPassword = (req,res) => {
  console.log('Android에서 비밀번호 요청 보냄');
  let sql_str = 'SELECT * FROM users WHERE userid = ?';
  let body = req.body;
  console.log(req.body);
  console.log('POST 데이터 받음');
  db.query(sql_str, [body.userid], (error, results) => {
      if (error) {     
          console.log(error);
          res.end("error");
      } else {
          if (results[0] == null) {
            res.end("DB_ERROR");
          } else {
                if(body.email == results[0].email){
                    res.end("SUCCESS");
                }else{
                    res.end("EMAIL_ERROR");
                }
          }
      }                     
  });
};
const UserAlterPassword = (req,res) => {
  console.log('Android에서 비밀번호 요청 보냄');
  let sql_str = 'UPDATE users set password = ? where userid = ?';
  let body = req.body;
  console.log(req.body);
  console.log('POST 데이터 받음');
  if(body.passwd1==body.passwd2){
  db.query(sql_str, [body.passwd1, body.userid], (error, results) => {
      if (error) {     
          console.log(error);
          res.end("error");
      } else {
          res.end("SUCCESS");
      }                     
  });}
  else{

    res.end("error");
  }
};
// REST API의 URI와 핸들러를 매핑합니다.
//  URI: http://xxxx/users/auth
router.get('/auth', PrintLoginForm);   // 로그인 입력화면을 출력
router.post('/auth', HandleLogin);     // 로그인 정보로 인증처리
router.post('/signup', HandleSignUp);
router.post('/login', HandleLoginMobile);
router.post('/findid', UserFindId);
router.post('/findpassword', UserFindPassword);
router.put('/alterpassword', UserAlterPassword);
// ------------------------------  로그아웃기능 --------------------------------------

const HandleLogout = (req, res) => {
       req.session.destroy();     // 세션을 제거하여 인증오작동 문제를 해결
       res.redirect('/');         // 로그아웃후 메인화면으로 재접속
}

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/logout', HandleLogout);       // 로그아웃 기능

module.exports = router;
