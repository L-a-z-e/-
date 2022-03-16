package gachon.example.project;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;

public class ingredient_Activity extends AppCompatActivity {
Button meat,seafood,vegetable,fruit,sauce,dairy_nut;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ingredient_);

        meat=(Button)findViewById(R.id.meat);
        seafood=(Button)findViewById(R.id.seafood);
        vegetable=(Button)findViewById(R.id.vegetable);
        sauce=(Button)findViewById(R.id.sauce);
        dairy_nut=(Button)findViewById(R.id.dairy_nut);
        fruit=(Button)findViewById(R.id.fruit);


    }
}
