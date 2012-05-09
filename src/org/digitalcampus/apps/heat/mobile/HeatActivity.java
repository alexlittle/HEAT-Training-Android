package org.digitalcampus.apps.heat.mobile;

import org.apache.cordova.*;
import android.os.Bundle;

public class HeatActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}