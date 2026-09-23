package com.comeback.mjg;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(LockdownPlugin.class);
        super.onCreate(savedInstanceState);
        handleInterceptionIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleInterceptionIntent(intent);
    }

    private void handleInterceptionIntent(Intent intent) {
        if (intent != null && intent.hasExtra("intercepted_package")) {
            String pkg = intent.getStringExtra("intercepted_package");
            String appName = mapPackageToName(pkg);
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().post(() -> {
                    getBridge().getWebView().evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('lockdown-interception', { detail: { app: '" + appName + "', package: '" + pkg + "' } }));",
                        null
                    );
                });
            }
        }
    }

    private String mapPackageToName(String pkg) {
        if (pkg == null) return "Distraction";
        if (pkg.contains("instagram")) return "Instagram";
        if (pkg.contains("youtube")) return "YouTube";
        if (pkg.contains("twitter")) return "X / Twitter";
        if (pkg.contains("musically")) return "TikTok";
        if (pkg.contains("reddit")) return "Reddit";
        if (pkg.contains("facebook")) return "Facebook";
        if (pkg.contains("snapchat")) return "Snapchat";
        return pkg;
    }
}
