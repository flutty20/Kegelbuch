package com.example.hase9.kegelbuch;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MainActivity extends AppCompatActivity {
    private Button BTNNSpiel;
    private Button BTNNSpieler;
    private Button BTNEinstellungen;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        BTNNSpiel =(Button)findViewById(R.id.BTNNSpiel);
        BTNNSpieler=(Button)findViewById(R.id.BTNNSpieler);
        BTNEinstellungen=(Button)findViewById(R.id.BTNEinstellungen);

        BTNNSpieler.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openActivityNeuerSpieler();
            }
        });

        BTNNSpiel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openActivityNeuesSpiel();
            }
        });

        BTNEinstellungen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openActivityEinstellungen();
            }
        });
    }

    private void openActivityNeuerSpieler() {
        Intent intent = new Intent(this,neuerSpieler.class);
        startActivity(intent);
    }
    private void  openActivityNeuesSpiel() {
        Intent intent = new Intent(this,Spiel.class);
        startActivity(intent);

    }
    private void  openActivityEinstellungen() {
        Intent intent = new Intent(this,Einstellungen.class);
        startActivity(intent);
    }
}
