package gachon.example.project;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import java.util.ArrayList;

public class category extends Fragment {

    String title;

    ListView list1;
    public category() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        ArrayList<String> ar=new ArrayList<String>();
        View v1=inflater.inflate(R.layout.category, container, false);

        RecyclerView recyclerView = v1.findViewById(R.id.categorylist);
        RecyclerView.LayoutManager layoutManager;
        recyclerView.setHasFixedSize(true);
        layoutManager=new LinearLayoutManager(getContext());



        recyclerView.setLayoutManager(layoutManager);

        recipe_cycle adapter = new recipe_cycle();
        recyclerView.setAdapter(adapter);



        return v1;
    }
}
