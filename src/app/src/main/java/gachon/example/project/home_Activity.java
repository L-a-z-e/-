package gachon.example.project;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import android.support.v7.widget.Toolbar;

public class home_Activity extends AppCompatActivity {
Button ingredient_menu,recipe_menu,btnOpenDrawer,btnCloseDrawer;
    DrawerLayout drawerLayout;
   View drawerView,header;
   Toolbar toolbar;
   NavigationView navigationView;
    ActionBarDrawerToggle drawerToggle;
    TextView navtext;
    LayoutInflater inflater;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_);
        final Intent loading_i=new Intent(home_Activity.this,loading.class);
        startActivity(loading_i);

        ingredient_menu=(Button)findViewById(R.id.ingredient_menu);
        recipe_menu=(Button)findViewById(R.id.recipe_menu);
        recipe_menu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                    Intent recipe_i=new Intent(home_Activity.this,recipe_Activity.class);
                    startActivity(recipe_i);
            }
        });
        ingredient_menu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent ingredient_i=new Intent(home_Activity.this,ingredient_Activity.class);
                startActivity(ingredient_i);
            }

        });

        toolbar = (Toolbar) findViewById(R.id.toolbar);
        drawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        navigationView = (NavigationView) findViewById(R.id.navigation_view);
        View nav_header_view = navigationView.getHeaderView(0);
        navtext= (TextView) nav_header_view.findViewById(R.id.nav_text);

        if(!(((getIntent().getStringExtra("userid")))==null)){

        navtext.setText(getIntent().getStringExtra("userid")+ "님");}







        InitializeLayout();

        navigationView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                switch (menuItem.getItemId())
                {
                    case R.id.item1:
                        Intent login_i=new Intent(home_Activity.this,MainActivity.class);
                        startActivity(login_i);

                        break;
                    case R.id.item2:
                        Toast.makeText(getApplicationContext(), "SelectedItem 2", Toast.LENGTH_SHORT).show();
                        break;
                    case R.id.item3:
                        Toast.makeText(getApplicationContext(), "SelectedItem 3", Toast.LENGTH_SHORT).show();
                        break;
                    case R.id.item4:
                        Toast.makeText(getApplicationContext(), "SelectedItem 4", Toast.LENGTH_SHORT).show();
                        break;
                }

                DrawerLayout drawer = findViewById(R.id.drawer_layout);
                drawer.closeDrawer(GravityCompat.START);
                return true;
            }
        });



    }

    public void InitializeLayout()
    {
        //toolBar를 통해 App Bar 생성
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        //App Bar의 좌측 영영에 Drawer를 Open 하기 위한 Incon 추가
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_format_list_bulleted_black_24dp);
        getSupportActionBar().setTitle("");

        DrawerLayout drawLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        NavigationView navigationView = (NavigationView) findViewById(R.id.navigation_view);

        ActionBarDrawerToggle actionBarDrawerToggle = new ActionBarDrawerToggle(
                this,
                drawLayout,
                toolbar,
                R.string.navigation_drawer_open,
                R.string.navigation_drawer_close
        );

        drawLayout.addDrawerListener(actionBarDrawerToggle);
    }
    public void onBackPressed() {
        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }
}
