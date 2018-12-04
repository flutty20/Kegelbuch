package com.example.hase9.kegelbuch;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class neuerSpieler extends AppCompatActivity {
    private Button BTNZurueck;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_neuer_spieler);

        BTNZurueck=(Button)findViewById(R.id.BTNZurueck);

        BTNZurueck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openActivityZurueck();
            }
        });
    }


    private void openActivityZurueck() {
        Intent intent = new Intent(this,MainActivity.class);
        startActivity(intent);
    }
}