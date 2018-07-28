'use strict';

module.exports = {

	'page': (script) => {
		return '<!DOCTYPE html><html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>smart.cv.log1n</title>'
			 + '<link rel="shortcut icon" href="https://vog3lm-0x1.firebaseapp.com/images/logos/fox.white.png" type="image/x-icon">'
			 + '<link rel="icon" ref="https://vog3lm-0x1.firebaseapp.com/images/logos/fox.white.png" type="image/x-icon">'+script+'</head>'
			 + '<body>'
			 	+ '<img src="https://vog3lm-0x1.firebaseapp.com/images/logos/fox.gray.png" alt="fox" title="Smart Print Login Page" style="position:absolute;width:10%;left:50%;top:50%;transform:translate(-50%,-50%);">'
				+ '<a href="https://vog3lm-0x1.firebaseapp.com" style="position:absolute;left:50%;top:60%;transform:translate(-50%,-50%);font-size:2rem;font-family:monospace;text-decoration:none;color:gray;">Sie werden weitergeleitet.<br>Falls nicht, hier klicken.</a>'
			 + '</body></html>';
	}
	,'script': (mail,pass,leed) => {
		/* firebase.auth().onAuthStateChanged(...) is executed right after registration */
		return '<script type="text/javascript" src="https://www.gstatic.com/firebasejs/5.3.0/firebase-app.js"></script>'
			 + '<script type="text/javascript" src="https://www.gstatic.com/firebasejs/5.3.0/firebase-auth.js"></script>'
	 		 + '<script type="text/javascript">'
				+ 'firebase.initializeApp({apiKey:"AIzaSyDmXSkwOam-aQ37z8-3d5aH-X257lIVS34",authDomain:"vog3lm-0x1.firebaseapp.com",projectId:"vog3lm-0x1",});'
				+ 'firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(()=>{var f=0;'
					+ 'firebase.auth().onAuthStateChanged(function(u){if(u){window.user=u;window.localStorage.setItem("u",u);window.localStorage.setItem("l","'+leed+'");window.location.replace("https://vog3lm-0x1.firebaseapp.com");}else{if(0==f){f=f+1;}else{window.localStorage.setItem("e","Invalid authentication. Access Denied");window.location.replace("https://vog3lm-0x1.firebaseapp.com/403");}}});'
					+ 'return firebase.auth().signInWithEmailAndPassword("'+mail+'","'+pass+'");'
				+ '}).catch(function(err){window.localStorage.setItem("e","Authentication Error. "+err.code+". "+err.message);window.location.replace("https://vog3lm-0x1.firebaseapp.com/503");});'
			 	+ 'window.onload=setTimeout(()=>{window.localStorage.setItem("e","Authentication Error. auth/network-request-failed. Timeout");window.location.replace("https://vog3lm-0x1.firebaseapp.com/503");},3000);'
			 + '</script>';
	}
	,'error': (msg) => {
		return '<script type="text/javascript">window.localStorage.setItem("e","'+msg+'");window.location.replace("https://vog3lm-0x1.firebaseapp.com/503")</script>';
	}
	,'fail': (msg) => {
		return '<script type="text/javascript">window.localStorage.setItem("e","'+msg+'");window.location.replace("https://vog3lm-0x1.firebaseapp.com/403")</script>';
	}

};