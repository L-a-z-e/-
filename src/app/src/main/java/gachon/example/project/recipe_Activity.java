package gachon.example.project;

import android.support.annotation.Nullable;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import java.util.ArrayList;

public class recipe_Activity extends AppCompatActivity {
    android.support.v7.widget.Toolbar toolbar;
    TabLayout tabLayout;
    ViewPager pager;

    ArrayList<Fragment> fraglist=new ArrayList<>();
    ArrayList<String> titlelist=new ArrayList<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recipe_);



        toolbar=(android.support.v7.widget.Toolbar)findViewById(R.id.aaa);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("레시피 보고 선택");
        tabLayout=(TabLayout)findViewById(R.id.tabs);

        category sub1=new category();
        category2 sub2=new category2();
        category3 sub3=new category3();
        category4 sub4=new category4();
        fraglist.add(sub1);
        fraglist.add(sub2);
        fraglist.add(sub3);
        fraglist.add(sub4);
        titlelist.add("카테고리별");
        titlelist.add("난이도별");
        titlelist.add("즐겨찾기");
        titlelist.add("레시피 게시판");


        pager=(ViewPager)findViewById(R.id.pager);
        FragmentManager manager=getSupportFragmentManager();
        pageradapter adapter=new pageradapter(manager);

        pager.setAdapter(adapter);
        tabLayout.setupWithViewPager(pager);



    }
    class pageradapter extends FragmentPagerAdapter {

        public pageradapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int i) {
            return fraglist.get(i);
        }

        @Override
        public int getCount() {
            return fraglist.size();
        }

        @Nullable
        @Override
        public CharSequence getPageTitle(int position) {
            return titlelist.get(position);
        }
    }
}
