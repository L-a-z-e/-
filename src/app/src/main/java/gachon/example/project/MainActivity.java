package gachon.example.project;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class MainActivity extends AppCompatActivity {
Button loginbtn,registerbtn,searchid,searchpasswd;
String userid, password;
boolean roginisok;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        loginbtn=(Button)findViewById(R.id.loginbtn);
        registerbtn=(Button)findViewById(R.id.registerbtn);
        searchid=(Button)findViewById(R.id.searchid);
        searchpasswd=(Button)findViewById(R.id.searchpasswd);
        loginbtn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                System.out.println("서버연결 시도...");
                new JSONTask().execute("http://192.168.0.19:65000/users/login");

            }
        });

        registerbtn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent register_i=new Intent(MainActivity.this,register_Activity.class);
                startActivity(register_i);
                }
            });

        searchid.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent searchid_i=new Intent(MainActivity.this,searchid.class);
                startActivity(searchid_i);
            }
        });

        searchpasswd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent searchpasswd_i=new Intent(MainActivity.this,searchpasswd.class);
                startActivity(searchpasswd_i);
            }
        });


        }
    class JSONTask extends AsyncTask<String, String, String> {
        @Override
        public String doInBackground(String... urls) {
            userid = ((EditText) (findViewById(R.id.userid_main))).getText().toString();
            password = ((EditText) (findViewById(R.id.password_main))).getText().toString();

            HttpURLConnection con = null;
            BufferedReader reader = null;
            try {


                JSONObject jsonObject = new JSONObject();
                jsonObject.accumulate("userid", userid);
                jsonObject.accumulate("password", password);
                URL url = new URL(urls[0]);

                con = (HttpURLConnection) url.openConnection();
                con.setRequestMethod("POST");
                con.setRequestProperty("Cache-Control", "no-cache");//캐시 설정
                con.setRequestProperty("Content-Type", "application/json");//application JSON 형식으로 전송
                con.setDoInput(true);                         // 서버에서 읽기 모드 지정
                con.setDoOutput(true);                       // 서버로 쓰기 모드 지정
                con.connect();
                //서버로 보내기위해서 스트림 만듬
                OutputStream outStream = con.getOutputStream();
                //버퍼를 생성하고 넣음
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outStream));
                writer.write(jsonObject.toString());
                writer.flush();
                writer.close();//버퍼를 받아줌

                InputStream stream = con.getInputStream();
                reader = new BufferedReader(new InputStreamReader(stream));
                StringBuffer buffer = new StringBuffer();

                String line = "";
                while ((line = reader.readLine()) != null) buffer.append(line);
                return buffer.toString();

            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            } finally {
                con.disconnect();
                try {
                    if (reader != null)
                        reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return null;

        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            System.out.println(s);
            String test = s;
            System.out.println(s);


            if(test.equals("SUCCESS"))
            {
                Toast toast = Toast.makeText(getApplicationContext(), "로그인 되었습니다.", Toast.LENGTH_LONG);
                toast.show();
                Intent intent = new Intent(getApplicationContext(), home_Activity.class);
                intent.putExtra("userid",userid);
                 startActivity(intent);

            }
            else if(test.equals("PASSWORD_ERROR"))
            {
                Toast toast = Toast.makeText(getApplicationContext(), "비밀번호가 틀렸습니다.", Toast.LENGTH_LONG);
                toast.show();
            }else{
                Toast toast = Toast.makeText(getApplicationContext(), "회원정보가 없습니다.", Toast.LENGTH_LONG);
                toast.show();
            }

        }
    }
}
