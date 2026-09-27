package X;

import android.content.Context;
import com.facebook.react.modules.dialog.DialogModule;
import com.instagram.common.session.UserSession;
import com.instagram.react.modules.navigator.IgReactNavigatorModule;
import com.instagram.react.modules.product.IgReactPurchaseExperienceBridgeModule;
import java.util.Iterator;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* JADX INFO: renamed from: X.0LIv, reason: invalid class name and case insensitive filesystem */
/* JADX INFO: loaded from: classes9.dex */
public final class C540070LIv {
    public static final C540070LIv A00 = new C540070LIv();

    public static final C637502fN A00(Context context, AbstractC437201oA abstractC437201oA, String str, String str2) {
        C848303Vx c848303VxA0L = C021O.A0L(AbstractC5121020p.A0J(abstractC437201oA), C377650EsV.A00, abstractC437201oA);
        c848303VxA0L.A0H = "accounts/verify_email_code/";
        c848303VxA0L.APm(IgReactPurchaseExperienceBridgeModule.RN_SHOP_PAY_CODE, str2);
        c848303VxA0L.APm("email", str);
        return AnonymousClass0221.A0P(c848303VxA0L, C022U.A02(0, 9, 85), C1093604Sg.A00(context));
    }

    public static final C637502fN A01(EnumC1228504sV enumC1228504sV, UserSession userSession, String str, String str2, String str3) {
        C1312205Ei.A0S(userSession);
        JSONArray jSONArray = new JSONArray();
        JSONObject jSONObjectA11 = AbstractC5121020p.A11();
        try {
            jSONObjectA11.put("link_id", str);
            jSONObjectA11.put(IgReactNavigatorModule.URL, str2);
            jSONObjectA11.put(DialogModule.KEY_TITLE, str3);
            jSONObjectA11.put("link_type", enumC1228504sV.toString());
        } catch (JSONException unused) {
        }
        jSONArray.put(jSONObjectA11);
        C637302fL c637302fLA0J = C021O.A0J(AbstractC636802fG.A01, C374630End.A00, userSession);
        c637302fLA0J.A0H = "accounts/update_bio_links/";
        return AnonymousClass0221.A0P(c637302fLA0J, "updated_links", jSONArray.toString());
    }

    public static final C637502fN A02(AbstractC437201oA abstractC437201oA, String str, String str2) {
        C1312205Ei.A0K(str2);
        C637002fI c637002fI = AbstractC636802fG.A01;
        C365840EYs c365840EYs = C365840EYs.A00;
        C848303Vx c848303VxA06 = c637002fI.A06(c365840EYs, c365840EYs, null, abstractC437201oA);
        c848303VxA06.A08(AnonymousClass0009.A01);
        c848303VxA06.A0H = "users/check_username/";
        c848303VxA06.APm(C022U.A00(), str);
        c848303VxA06.APm("_uuid", str2);
        c848303VxA06.A0H("is_group_creation", false);
        return C021O.A0S(c848303VxA06);
    }

    public static final C637502fN A03(UserSession userSession) {
        C637302fL c637302fLA0K = C021O.A0K(AbstractC5121020p.A0J(userSession), C374670Enh.A00, userSession);
        c637302fLA0K.A0H = "accounts/current_user/";
        return AnonymousClass0213.A0R(c637302fLA0K, "edit", "true");
    }

    public static final C637502fN A04(UserSession userSession) {
        C637302fL c637302fLA0K = C021O.A0K(AbstractC5121020p.A0J(userSession), C374670Enh.A00, userSession);
        c637302fLA0K.A0H = "accounts/current_user/";
        c637302fLA0K.APm("edit", "true");
        return AnonymousClass0213.A0R(c637302fLA0K, "ig_personal_info", "true");
    }

    public static final C637502fN A05(UserSession userSession, C538430LCn c538430LCn, String str, boolean z) {
        C637302fL c637302fLA0J = C021O.A0J(AbstractC5121020p.A0J(userSession), C374960EoA.A00, userSession);
        c637302fLA0J.A0H = "accounts/edit_profile/";
        c637302fLA0J.APm(C022U.A00(), c538430LCn.A0R);
        c637302fLA0J.APm("first_name", c538430LCn.A0I);
        c637302fLA0J.APm(C022U.A02(9, 12, 77), c538430LCn.A0P);
        c637302fLA0J.APm("email", c538430LCn.A0G);
        c637302fLA0J.APm("biography", c538430LCn.A0C);
        EnumC1234604tU enumC1234604tU = c538430LCn.A02;
        c637302fLA0J.A0G("primary_profile_link_type", enumC1234604tU != null ? enumC1234604tU.A00 : null);
        c637302fLA0J.A0H("show_fb_link_on_profile", c538430LCn.A0d);
        c637302fLA0J.A0H("show_fb_page_link_on_profile", c538430LCn.A0e);
        if (z) {
            c637302fLA0J.APm("gender", String.valueOf(c538430LCn.A00));
        }
        return AnonymousClass0221.A0P(c637302fLA0J, C022U.A02(0, 9, 85), str);
    }

    public static final C637502fN A06(UserSession userSession, String str) {
        C637302fL c637302fLA0J = C021O.A0J(AbstractC5121020p.A0J(userSession), C375820EpY.A00, userSession);
        c637302fLA0J.A0H = "accounts/send_sms_code/";
        return AnonymousClass0221.A0P(c637302fLA0J, C022U.A02(9, 12, 77), str);
    }

    public static final C637502fN A07(UserSession userSession, String str, int i) {
        C637302fL c637302fLA0J = C021O.A0J(AbstractC5121020p.A0J(userSession), C374960EoA.A00, userSession);
        c637302fLA0J.A0H = "accounts/set_gender/";
        c637302fLA0J.APm("gender", String.valueOf(i));
        return AnonymousClass0213.A0R(c637302fLA0J, "custom_gender", str);
    }

    public static final C637502fN A08(UserSession userSession, String str, String str2, boolean z) {
        C637302fL c637302fLA0J = C021O.A0J(AbstractC5121020p.A0J(userSession), C376040Epu.A00, userSession);
        c637302fLA0J.A0H = "accounts/verify_sms_code/";
        c637302fLA0J.APm(C022U.A02(9, 12, 77), str);
        c637302fLA0J.APm(C022U.A02(63, 17, 88), str2);
        if (z) {
            c637302fLA0J.APm("has_sms_consent", "true");
        }
        return C021O.A0S(c637302fLA0J);
    }

    public static final C637502fN A09(UserSession userSession, List list) {
        boolean zA1F = C000H.A1F(userSession, list);
        JSONArray jSONArray = new JSONArray();
        int size = list.size();
        for (int i = 0; i < size; i++) {
            jSONArray.put(list.get(i));
        }
        C637302fL c637302fLA0J = C021O.A0J(AbstractC636802fG.A01, C374630End.A00, userSession);
        c637302fLA0J.A0H = "accounts/update_bio_links/";
        AnonymousClass0213.A1O(c637302fLA0J, jSONArray, "ordered_link_ids");
        return AnonymousClass0213.A0S(c637302fLA0J, zA1F);
    }

    public final C637502fN A0A(Context context, UserSession userSession, Integer num, String str) {
        C1312205Ei.A0T(userSession);
        C1312205Ei.A0L(context);
        C637302fL c637302fLA0J = C021O.A0J(AbstractC636802fG.A01, C377170Erj.A00, userSession);
        c637302fLA0J.A0H = "accounts/initiate_phone_number_confirmation/";
        AnonymousClass0221.A15(context, c637302fLA0J, "phone_id", AnonymousClass0217.A0O(c637302fLA0J, userSession, C022U.A02(9, 12, 77), str).A04(EnumC614302bd.A2f));
        c637302fLA0J.APm("send_source", AbstractC477540IpE.A00(num));
        if (C770240UbP.A00(context)) {
            c637302fLA0J.APm("android_build_type", C021X.A11(((EnumC563390MAn) EnumC563390MAn.A02.getValue()).name()));
        }
        if (AnonymousClass0228.A01(userSession).E7Q()) {
            c637302fLA0J.A0Q = true;
        }
        return C021O.A0S(c637302fLA0J);
    }

    public final C637502fN A0B(Context context, UserSession userSession, Integer num, String str, String str2, List list) {
        C637302fL c637302fLA0J = C021O.A0J(AbstractC5121020p.A0J(userSession), C999320d3l.A00, userSession);
        c637302fLA0J.A0H = "accounts/send_confirm_email/";
        AnonymousClass0221.A15(context, c637302fLA0J, C022U.A02(0, 9, 85), C1093604Sg.A00(context));
        c637302fLA0J.APm("send_source", AbstractC477540IpE.A00(num));
        c637302fLA0J.A0G("email", str);
        c637302fLA0J.A0G("phone_id", str2);
        if (list != null && !list.isEmpty()) {
            JSONArray jSONArray = new JSONArray();
            Iterator it = list.iterator();
            while (it.hasNext()) {
                AnonymousClass0213.A1a(it, jSONArray);
            }
            AnonymousClass0213.A1O(c637302fLA0J, jSONArray, "google_tokens");
        }
        if (AnonymousClass0228.A01(userSession).E7Q()) {
            c637302fLA0J.A0Q = true;
        }
        return C021O.A0S(c637302fLA0J);
    }
}
