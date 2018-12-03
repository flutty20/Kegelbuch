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
private Button btNSpiel;
    private Button btNSpieler;
    private Button btE;
    private Intent intent;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btNSpiel =(Button)findViewById(R.id.BTNNSpiel);
        btNSpieler=(Button)findViewById(R.id.BTNNSpieler);
        btE=(Button)findViewById(R.id.BTNEinstellungen);

        btNSpieler.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openActivity();
            }
        });
    }

    private void openActivity() {
        intent = new Intent(this,neuerSpieler.class);
        startActivity(intent);
    }
}
