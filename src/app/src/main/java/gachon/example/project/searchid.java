package gachon.example.project;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
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

public class searchid extends AppCompatActivity {
EditText email_search;
TextView id_search;
Button findbtn;
String email;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_searchid);
        email_search=(EditText)findViewById(R.id.email_search);
        id_search=(TextView)findViewById(R.id.id_search);
        findbtn=(Button)findViewById(R.id.findbtn);
    findbtn.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            new JSONTask().execute("http://192.168.0.19:65000/users/findid");
        }
    });



    }
    class JSONTask extends AsyncTask<String, String, String> {
        @Override
        public String doInBackground(String... urls) {
          email=email_search.getText().toString();
            HttpURLConnection con = null;
            BufferedReader reader = null;
            try {


                JSONObject jsonObject = new JSONObject();
                jsonObject.accumulate("email", email);


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


            if(test.equals("DB_ERROR"))
            {
                id_search.setText("등록되지 않은 이메일입니다.");

            }
            else
            {
               id_search.setText(test);
            }

        }
    }
}
