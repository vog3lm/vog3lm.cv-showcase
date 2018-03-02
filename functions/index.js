'use strict';

const functions = require('firebase-functions');
const configuration = functions.config().firebase;
const admin = require('firebase-admin');
admin.initializeApp(configuration);
var auth = admin.auth();
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const crypto = require('crypto');
const path = require('path');



/* vog3lm smart cv private content backend api */
const validateFirebaseIdToken = (req, res, next) => {
	if ((!req.headers.authorization || !req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) && !req.cookies.__session) {
		console.error('No Firebase ID token was passed as a content id token in the Authorization header.',
			'Make sure you authorize your request by providing the following HTTP header:',
			'Authorization: content id token <Firebase ID Token>',
			'or by passing a "__session" cookie.');
		res.status(403).send('Unauthorized - No token found!');
	} else {
		let idToken;
		if (req.headers.authorization && req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) {
			console.log('Found "Authorization" header');
			idToken = req.headers.authorization.split('CONTENT_ID_TOKEN::')[1];
		} else {
			console.log('Found "__session" cookie');
			idToken = req.cookies.__session;
		}
		auth.verifyIdToken(idToken).then((decodedIdToken) => {
			/*{
				iss: 'https://securetoken.google.com/vog3lm-0x1',
				aud: 'vog3lm-0x1',
				auth_time: 1519730309,
				user_id: 'l4T7jA2H5YXXczBgjEp75fQKZBs2',
				sub: 'l4T7jA2H5YXXczBgjEp75fQKZBs2',
				iat: 1519819973,
				exp: 1519823573,
				email: 'test@user.de',
				email_verified: false,
				firebase:{ 
					identities: {email:[Object]},
			 		sign_in_provider: 'password'
			 	},
				uid: 'l4T7jA2H5YXXczBgjEp75fQKZBs2' 
			}*/
			req.user = decodedIdToken;
			return next();
		}).catch((error) => {
			res.status(403).send('Unauthorized - Token Expired');
		});
	}
	return;
};
const mvc = express();
mvc.use(cors);
mvc.use(cookieParser);
mvc.use(validateFirebaseIdToken);
mvc.get('/', (req, res) => {

	/* funzt sicher aber iwi umstaendlich */
	var hat = {'title':'vog3lm.cv','manifest':'./manifest.json','fav':'https://vog3lm-0x1.firebaseapp.com/images/favicon.coyote.poly_white.b.png'}
	var cre = {'mail':'test@user.de','pass':'44920420'}
	var js = ['https://www.gstatic.com/firebasejs/4.9.1/firebase.js'
			 ,'https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js'
			 ,'https://code.jquery.com/jquery-2.2.4.min.js'
			 ,'./js/backend.js'
			 ,'./js/animate.dotNet.js']
	var css = ['./css/font-awesome.min.css'
			  ,'./css/landing.white.css']
//	var methods = {get:()=>{return 'Name Vom User oder sonst was...'}} // bad bad bad...aber geht
//	return res.render("landing",{'hat':hat,'css':css,'js':js,'cre':cre});
	res.send(`Hello ${req.user.email} on ${req.user.aud}`);
});
exports.mvc = functions.https.onRequest(mvc);




/* token from header not available with qr code *//* unused...someday maybe
const getQrRequestTokenFromHeader = (req, res, next) => {
	if (!req.headers.authorization || !req.headers.authorization.startsWith('[qR1D]::[')) {
		console.error('No qR ID token was passed as a content id token in the Authorization header.',
			'Make sure you authorize your request by providing the following HTTP header:',
			'Authorization: [qR1D]::[token]');
		res.status(404).redirect(redirectUrl);
		req.qrToken = 'unset';
	} else {
		req.qrToken = req.headers.authorization.split('[qR1D]::[')[1]
	}
	return next();
}
*//* 	vog3lm smart cv mobile qr code login backend api */
var db = {'PXHTajCVg':{'mail':'test@user.de','pass':'44920420'}
		 ,'1w9cBiU7Q':{'mail':'test@user.de','pass':'44920420'}
		 ,'PT5VTsF8R':{'mail':'test@user.de','pass':'44920420'}
		 ,'6PW2gsYzD':{'mail':'test@user.de','pass':'44920420'}
		 ,'O2FNkkqqE':{'mail':'test@user.de','pass':'44920420'}}

const qr = express();
qr.set('view engine', 'pug')
qr.set('views', path.join(__dirname,'templates'));
qr.use(express.static(path.join(__dirname, "static")));
qr.use(cors);
/*	/qr/?qR1D=12345]	*//*
	qR client -> https://us-central1-vog3lm-0x1.cloudfunctions.net/qr/?qR1D=PXHTajCVgPkXKQgn54r]
	qR client <- page
	qR client -> login request
	qR client <- login grant
	qR client -> redirect https://vog3lm-0x1.firebaseapp.com/
*//*
 	FUNKTIONIERT NICHT
	LOGGT SICH MIT DER https://us-central1-vog3lm-0x1.cloudfunctions.net/ DOMAIN EIN 
 	SESSION GEHT BEIM REDIRECT AUF https://vog3lm-0x1.firebaseapp.com/ VERLOREN (DOMAIN DIVERGENCE)
 	GANZE SEITE BAUEN DAUERT VOLL LANG
*/
qr.get('/', (req, res) => {
	if (!req.query.qR1D){
		console.error('No qR ID token was passed as a content ID token in the request parameters.',
			'Make sure you authorize your request by providing the following parameter pair: qR1D=token');
		return res.status(404).send('Ooops');
	}

	req.qrToken = req.query.qR1D
	req.qrCreds = db[req.qrToken];
	console.log('qr ID token: ',req.qrToken)
	if(!req.qrCreds){
		console.error('No qR ID credentials were found in database for the ID token in the request parameters.'
					 ,'The current ID token could be expired. Try to request a new one.'
					 ,'DB::'+JSON.stringify(db),'qR1D::'+req.qrToken);
		return res.status(404).send('Ooops');
	}
	console.log('qR ID credentials: ',req.qrCreds)
	var js = ['https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js'
			 ,'https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js'
			 ,'https://code.jquery.com/jquery-2.2.4.min.js'
			 ,'./js/backend.js'
			 ,'./js/animate.dotNet.js'];
	var css = ['./css/font-awesome.min.css'
			  ,'./css/landing.white.css'];

	var redirectUrl = 'https://vog3lm-0x1.firebaseapp.com';
	// route redirect with no history
	var hat = {'title':'vog3lm.cv.redirect','fav':'https://vog3lm-0x1.firebaseapp.com/images/favicon.coyote.poly_white.b.png'};
	var cre = {'mail':'test@user.de','pass':'44920420','apiKey':'AIzaSyDmXSkwOam-aQ37z8-3d5aH-X257lIVS34','authDomain':'vog3lm-0x1.firebaseapp.com','projectId':'vog3lm-0x1'};
	var route = {'error':redirectUrl+'/404','qr':redirectUrl};
	return res.status(200).render("qr",{'hat':hat,'cre':cre,'route':route});
});
exports.test = functions.https.onRequest(qr);

/*	/qr/?qR1D=12345]	*//*
	qR client -> https://vog3lm-0x1.firebaseapp.com -> https://us-central1-vog3lm-0x1.cloudfunctions.net/test/?qR1D=PXHTajCVgPkXKQgn54r]
	qR client    									<- login page
	qR client -> login domain https://vog3lm-0x1.firebaseapp.com
	qR client -> redirect https://vog3lm-0x1.firebaseapp.com
	qR client <- logged in https://vog3lm-0x1.firebaseapp.com
*/
exports.qr = functions.https.onRequest((req,res)=>{
	var qrRedirect = 'https://vog3lm-0x1.firebaseapp.com'
	var qrPage = ''
		+ '<!DOCTYPE html><html lang="de"><head><title>vog3lm.cv.redirect</title>'
		+ '<link rel="shortcut icon" href="'+qrRedirect+'/images/favicon.coyote.poly_white.b.png" type="image/x-icon">'
		+ '<link rel="icon" ref="'+qrRedirect+'/images/favicon.coyote.poly_white.b.png" type="image/x-icon">';
	if (!req.query.qR1D){
		console.error('No qR ID token was passed as a content ID token in the request parameters.',
			'Make sure you authorize your request by providing the following parameter pair: qR1D=token');
		return res.status(200).send(qrPage + '</script><script type="text/javascript">window.location.replace("'+qrRedirect+'/404")</script>')
	}
	req.qrToken = req.query.qR1D
	req.qrCreds = db[req.qrToken];
	console.log('qr ID token: ',req.qrToken)
	if(!req.qrCreds){
		console.error('No qR ID credentials were found in database for the ID token in the request parameters.'
					 ,'The current ID token could be expired. Try to request a new one.'
					 ,'qR1D::'+req.qrToken);
		return res.status(200).send(qrPage + '</script><script type="text/javascript">window.location.replace("'+qrRedirect+'/404")</script>')
	}
	console.log('qR ID credentials: ',req.qrCreds);
	qrPage = qrPage
	+ '<script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js">'
	+ '</script><script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js"></script><script type="text/javascript">'
	+ 'firebase.initializeApp({apiKey:"AIzaSyDmXSkwOam-aQ37z8-3d5aH-X257lIVS34",authDomain: "vog3lm-0x1.firebaseapp.com",projectId: "vog3lm-0x1"});const a = firebase.auth();'
	+ 'a.onAuthStateChanged(function(u){if(u){window.user = u;window.location.replace("'+qrRedirect+'");}else{window.location.replace("'+qrRedirect+'/404");}});'
	+ 'a.signInWithEmailAndPassword("'+req.qrCreds.mail+'","'+req.qrCreds.pass+'").catch(function(error){window.location.replace("'+qrRedirect+'/404");});'
	+ '</script></head><body></body></html>';
	return res.status(200).send(qrPage);
});




