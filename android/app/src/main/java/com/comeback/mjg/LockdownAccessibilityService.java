package com.comeback.mjg;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * LockdownAccessibilityService detects launches of blacklisted apps
 * and brings comeback.mjg into the foreground to enforce the 90-second Urge Surfer protocol.
 */
public class LockdownAccessibilityService extends AccessibilityService {
    private static final String TAG = "LockdownShield";

    // Blacklisted distraction apps monitored by default
    private static final Set<String> BLACKLISTED_PACKAGES = new HashSet<>(Arrays.asList(
        "com.instagram.android",          // Instagram
        "com.google.android.youtube",     // YouTube
        "com.twitter.android",            // X / Twitter
        "com.zhiliaoapp.musically",       // TikTok
        "com.reddit.frontpage",           // Reddit
        "com.facebook.katana",            // Facebook
        "com.snapchat.android"            // Snapchat
    ));

    private long lastInterceptionTime = 0;

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event == null || event.getEventType() != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            return;
        }

        CharSequence packageNameChar = event.getPackageName();
        if (packageNameChar == null) {
            return;
        }

        String packageName = packageNameChar.toString();

        // Never intercept comeback.mjg itself
        if (packageName.equals(getPackageName())) {
            return;
        }

        if (BLACKLISTED_PACKAGES.contains(packageName)) {
            long now = System.currentTimeMillis();
            // Debounce within 3 seconds to prevent duplicate intent launches
            if (now - lastInterceptionTime < 3000) {
                return;
            }
            lastInterceptionTime = now;
            Log.d(TAG, "Distraction package intercepted: " + packageName + ". Bringing comeback.mjg to foreground!");

            Intent launchIntent = new Intent(this, MainActivity.class);
            launchIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK |
                Intent.FLAG_ACTIVITY_CLEAR_TOP |
                Intent.FLAG_ACTIVITY_SINGLE_TOP
            );
            launchIntent.putExtra("mode", "urge_surf");
            launchIntent.putExtra("intercepted_package", packageName);
            launchIntent.putExtra("source", "android_accessibility");
            startActivity(launchIntent);
        }
    }

    @Override
    public void onInterrupt() {
        Log.d(TAG, "LockdownAccessibilityService interrupted.");
    }
}
