/**
 *
 * @param {Prepare firebase} config
 */

function gf_google_clean_config(config) {
	var config = config.replace('const', '');
	var config = config.replace('=', '');
	var config = config.replace('firebaseConfig', '');
	var config = config.replace(';', '');
	return eval('(' + config + ')');
}

var firebaseConfig = firebase_data.firebaseConfig;
firebaseConfig = gf_google_clean_config(firebaseConfig);

// Initialize Firebase.
firebase.initializeApp(firebaseConfig);
var ui = new firebaseui.auth.AuthUI(firebase.auth());
firebase.auth();
var uiConfig = {
	callbacks: {
		signInSuccessWithAuthResult: function (authResult, redirectUrl) {
			var user_token = authResult.user.xa;
			var phone_number = authResult.user.phoneNumber;
			jQuery('.gf_google_sms_otp_field').attr('type', 'text').val(phone_number);
			localStorage.setItem('gf_firebase_user_token', user_token);
			localStorage.setItem('gf_firebase_api_key', firebaseConfig.apiKey);
			jQuery('.gf_firebase_user_token').val(user_token);
			jQuery('.gf_firebase_api_key').val(firebaseConfig.apiKey);
			jQuery(".gf_google_sms_otp_field").attr("readonly", "readonly");
		},
		uiShown: function () {
			document.getElementsByClassName(
				'firebaseui-card-footer'
			)[0].style.display = 'none';
		},
	},
	signInFlow: 'popup',
	signInSuccessUrl: null,
	signInOptions: [
		{
			provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			recaptchaParameters: {
				type: 'image', // 'audio'
				size: 'normal', // 'invisible' or 'compact'
				badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
			},
		},
	],
};

if (typeof firebase_data.firebase_countries !== 'undefined' && firebase_data.firebase_countries.length > 0) {
	uiConfig.signInOptions[0].whitelistedCountries = firebase_data.firebase_countries;
	if (typeof firebase_data.firebase_default_country === 'undefined' || firebase_data.firebase_default_country.length <= 0) {
		uiConfig.signInOptions[0].defaultCountry = firebase_data.firebase_countries[0];
	}
}

if (typeof firebase_data.firebase_default_country !== 'undefined' && firebase_data.firebase_default_country.length > 0) {
	uiConfig.signInOptions[0].defaultCountry = firebase_data.firebase_default_country;
}

if (typeof firebase_data.firebase_recpatcha_type !== 'undefined' && firebase_data.firebase_recpatcha_type.length > 0) {
	if (firebase_data.firebase_recpatcha_type === 'rec1') {
		uiConfig.signInOptions[0].recaptchaParameters.size = 'normal';
	} else {
		uiConfig.signInOptions[0].recaptchaParameters.size = 'invisible';
	}
}

ui.start('.gf_google_sms_otp', uiConfig);

jQuery(document).bind('gform_post_render', function () {
	if (jQuery('.gf_google_sms_otp').length > 0) {
		ui.start('.gf_google_sms_otp', uiConfig);
	}
});


var oldScroll = jQuery(window).scrollTop();
jQuery( window ).one('scroll', function() {
    jQuery(window).scrollTop( oldScroll ); //disable scroll just once
});

jQuery(document).on('gform_post_render', function (event, form_id, current_page) {
	if (jQuery('.gf_firebase_user_token')) {
		jQuery('.gf_firebase_user_token').val(localStorage.getItem('gf_firebase_user_token'));
	}

	if (jQuery('.gf_firebase_api_key')) {
		jQuery('.gf_firebase_api_key').val(localStorage.getItem('gf_firebase_api_key'));
	}
});


jQuery(document).on('gform_confirmation_loaded', function (event, formId) {
	localStorage.removeItem('gf_firebase_user_token');
	localStorage.removeItem('gf_firebase_api_key');
});
