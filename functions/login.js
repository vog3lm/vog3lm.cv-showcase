'use strict';

module.exports = {

	'page': (script) => {
		return '<!DOCTYPE html><html lang="de"><head><meta name="theme-color" content="#222222"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>'
			 + '<title>smart.cv.log1n</title>'
			 + '<link rel="shortcut icon" href="images/fox.white.png" type="image/x-icon">'
			 + '<link rel="icon" ref="images/fox.white.png" type="image/x-icon">'+script+'</head>'
			 + '<body>'
				+ ''
			 + '</body></html>';
	}
	,'script': (mail,pass,leed) => {
		var passLeedByStorage = 'window.localStorage.setItem("l","'+leed+'");'
		var domain = 'https://vog3lm-0x1.firebaseapp.com';
		return '<script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js"></script>'
			 + '<script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js"></script>'
	 		 + '<script type="text/javascript">'
				+ 'firebase.initializeApp({apiKey:"AIzaSyDmXSkwOam-aQ37z8-3d5aH-X257lIVS34",authDomain:"vog3lm-0x1.firebaseapp.com",projectId:"vog3lm-0x1"});const a=firebase.auth();'
				+ 'a.onAuthStateChanged(function(u){if(u){window.user=u;window.localStorage.setItem("u",u);window.localStorage.setItem("l","'+leed+'");window.location.replace("'+domain+'");}else{window.localStorage.setItem("e","Invalid authentication. Access Denied");window.location.replace("'+domain+'/503");}});'
				+ 'a.signInWithEmailAndPassword("'+mail+'","'+pass+'").catch(function(error){window.localStorage.setItem("e","Authentication Error. "+error.code+". "+error.message);window.location.replace("'+domain+'/503");});'
			 + '</script>';
	}
	,'error': (msg) => {
		var domain = 'https://vog3lm-0x1.firebaseapp.com';
		return '<script type="text/javascript">window.localStorage.setItem("e","'+msg+'");window.location.replace("'+domain+'/503")</script>';
	}
	,'fail': (msg) => {
		var domain = 'https://vog3lm-0x1.firebaseapp.com';
		return '<script type="text/javascript">window.localStorage.setItem("e","'+msg+'");window.location.replace("'+domain+'/403")</script>';
	}



};