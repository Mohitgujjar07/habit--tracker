package com.comeback.mjg;

import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.view.accessibility.AccessibilityManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.List;

@CapacitorPlugin(name = "LockdownShield")
public class LockdownPlugin extends Plugin {

    @PluginMethod
    public void isNative(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("native", true);
        ret.put("platform", "android");
        call.resolve(ret);
    }

    @PluginMethod
    public void checkStatus(PluginCall call) {
        Context context = getContext();
        boolean accessibilityEnabled = isAccessibilityServiceEnabled(context);
        boolean overlayPermission = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            overlayPermission = Settings.canDrawOverlays(context);
        }

        JSObject ret = new JSObject();
        ret.put("accessibilityEnabled", accessibilityEnabled);
        ret.put("overlayEnabled", overlayPermission);
        call.resolve(ret);
    }

    @PluginMethod
    public void openAccessibilitySettings(PluginCall call) {
        Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
        call.resolve();
    }

    @PluginMethod
    public void openOverlaySettings(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + getContext().getPackageName())
            );
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
        }
        call.resolve();
    }

    private boolean isAccessibilityServiceEnabled(Context context) {
        AccessibilityManager am = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);
        if (am == null) return false;
        List<AccessibilityServiceInfo> enabledServices = am.getEnabledAccessibilityServiceList(
            AccessibilityServiceInfo.FEEDBACK_ALL_MASK
        );
        String myService = context.getPackageName() + "/" + LockdownAccessibilityService.class.getName();
        for (AccessibilityServiceInfo service : enabledServices) {
            if (myService.equals(service.getId())) {
                return true;
            }
        }
        return false;
    }
}
