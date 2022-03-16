package gachon.example.project;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import java.util.ArrayList;

public class category3 extends Fragment {

    String title;

    ListView list3;
    public category3() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        ArrayList<String> ar=new ArrayList<String>();
        View v1=inflater.inflate(R.layout.category3, container, false);

        list3=(ListView)v1.findViewById(R.id.categorylist3);
        recipe_adapter adapter=new recipe_adapter();

        list3.setAdapter(adapter);


        return v1;
    }
}