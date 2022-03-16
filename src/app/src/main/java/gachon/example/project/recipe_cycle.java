package gachon.example.project;

import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.support.v7.widget.RecyclerView.ViewHolder;
import java.util.ArrayList;

class recipe_cycle extends RecyclerView.Adapter<recipe_cycle.ViewHolder>{

    public class ViewHolder extends  RecyclerView.ViewHolder {


        public ViewHolder(View view) {
            super(view);

        }
    }
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.recipelist, viewGroup, false);
        recipe_cycle.ViewHolder viewHolder = new ViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {

    }

    @Override
    public int getItemCount() {
        return 30;
    }
}
