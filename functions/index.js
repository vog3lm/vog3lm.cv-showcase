'use strict';

const functions = require('firebase-functions');
const configuration = functions.config().firebase;
const admin = require('firebase-admin');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
admin.initializeApp(configuration);
var auth = admin.auth();
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const fs = require('fs');

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



const test = express();
test.use(cors);
test.use(cookieParser);
test.use(validateFirebaseIdToken);
test.get('/', (req, res) => {

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
exports.test = functions.https.onRequest(test);

var bucketUrl = 'vog3lm-0x1.appspot.com';
var localsUrl = path.join(os.tmpdir(),'store.secret.js')
/*  PRE LOAD STORAGE SECRETS  */
gcs.bucket(bucketUrl).file('w3b.cv.c3rt/store.secret.js').download({'destination':localsUrl}).then(()=>{
	console.log('GCS object downloaded to', localsUrl);
	fs.readFile(localsUrl,'utf8',(error,data) => {
		try{
			if(!error){
				var json = JSON.parse(data);
				db = json.credStore;
				vb = json.viewStore;
				console.log('Successfully load local dependencies.','creds: ',Object.keys(db).length,'views:',Object.keys(vb).length);
			} else {
				throw error
			}
		}catch(e){
			console.error('Failed to parse local dependencies! Invalid JSON.',e);
			db = {};
			vb = {};
		}
	});
	return;
}).catch((error) => {	/* https://firebase.google.com/docs/storage/web/handle-errors */
	console.error('Failed to load GCS dependencies! Error:',error.error,'Code:',error.code,'Errors:',error.errors)
	db = {}
	vb = {}
});

/* 	vog3lm smart cv mobile qr code login backend api */
var db = {};
var vb = {};

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
}*/

/*	/qr/?qR1D=id	*//*	TODO TODO MOVE TO DB FILE 
	qR client -> https://vog3lm-0x1.firebaseapp.com -> https://us-central1-vog3lm-0x1.cloudfunctions.net/test/?qR1D=id&v=view
	qR client    									<- login page
	qR client -> google auth domain
	qR client -> redirect content page
	qR client <- logged content view
*/
exports.qr = functions.https.onRequest((req,res)=>{
	var qrDomain = 'https://vog3lm-0x1.firebaseapp.com'
	var qrPage = ''
		+ '<!DOCTYPE html><html lang="de"><head><title>vog3lm.cv.redirect</title>'
		+ '<link rel="shortcut icon" href="'+qrDomain+'/images/favicon.coyote.poly_white.b.png" type="image/x-icon">'
		+ '<link rel="icon" ref="'+qrDomain+'/images/favicon.coyote.poly_white.b.png" type="image/x-icon">[INJ:SCRIPT]'
		+ '</head><body></body></html>';
	if(0 === Object.keys(db)){
		console.error('No qR ID database was found. Make sure you preload qR ID authentication database!');
		return res.status(200).send(qrPage.replace('[INJ:SCRIPT]','</script><script type="text/javascript">window.location.replace("'+qrDomain+'/404")</script>'));
	}
	if (!req.query.qR1D){
		console.error('No qR ID token was passed as a content ID token in the request parameters.',
			'Make sure you authorize your request by providing the following parameter pair: qR1D=token');
		return res.status(200).send(qrPage.replace('[INJ:SCRIPT]','</script><script type="text/javascript">window.location.replace("'+qrDomain+'/404")</script>'));
	}
	if(!db.hasOwnProperty(req.query.qR1D)){
		console.error('No user was found for this qR ID token.', 'Make sure you pass existing qR ID tokens as parameter pair: qR1D=token');
		return res.redirect(404).end();
	}
	var qrCreds = db[req.query.qR1D]
	var qrRedirect = qrDomain+'/reader'+'?q='+req.query.qR1D;
	return res.status(200).send(qrPage.replace('[INJ:SCRIPT]',
		  '<script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js"></script>'
		+ '<script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js">'
		+ '</script><script type="text/javascript">'
			+ 'firebase.initializeApp({apiKey:"AIzaSyDmXSkwOam-aQ37z8-3d5aH-X257lIVS34",authDomain:"vog3lm-0x1.firebaseapp.com",projectId:"vog3lm-0x1"});const a=firebase.auth();'
		//	+ 'a.onAuthStateChanged(function(u){if(u){window.user = u;console.log("'+qrRedirect+'");}else{console.error("'+qrDomain+'/404");}});'
		//	+ 'a.signInWithEmailAndPassword("'+qrCreds.mail+'","'+qrCreds.pass+'").catch(function(error){console.error("'+qrDomain+'/404",error);});'
			+ 'a.onAuthStateChanged(function(u){if(u){window.user = u;window.location.replace("'+qrRedirect+'");}else{window.location.replace("'+qrDomain+'/404");}});'
			+ 'a.signInWithEmailAndPassword("'+qrCreds.mail+'","'+qrCreds.pass+'").catch(function(error){window.location.replace("'+qrDomain+'/404");});'
		+ '</script>'));
});
/*	/mvp/?q=view	*//*	TODO TODO MOVE TO DB FILE
	qR client -> https://vog3lm-0x1.firebaseapp.com -> https://us-central1-vog3lm-0x1.cloudfunctions.net/mvc/?q=view
	qR client    									<- content
*/

var dto = {"cols":[],"recs":[],"meta":{"state":"success","type":"dto","id":"","tag":""}};
var vto = {"view":"unset","meta":{"state":"success","type":"vto","id":"test","tag":"test"}};

exports.mvp = functions.https.onRequest((req,res)=>{
	if(0 === Object.keys(vb)){
		console.error('No view ID database was found. Make sure you preload view content database!');
		return res.redirect(404);
	}
	if(!req.query.q){
		console.error('No query parameter q was passed as a content ID token in the request parameters.',
			'Make sure you authorize your request by providing the following parameter pair: q=view');
		return res.redirect(404);
	}
	if(!vb.hasOwnProperty(req.query.q)){
		console.error('No view was found for this query parameter.', 'Make sure you pass existing view tokens as parameter pair: q=view');
		return res.redirect(404);
	}
	var testData = vb[req.query.q];

	var data = JSON.parse(JSON.stringify(vto));
	data.view = testData;
	return res.status(200).send(data);
});


exports.mvc = functions.https.onRequest((req,res)=>{
	if(0 === Object.keys(vb)){
		console.error('No view ID database was found. Make sure you preload view content database!');
		return res.redirect(404);
	}
	if(!req.query.q){
		console.error('No query parameter q was passed as a content ID token in the request parameters.',
			'Make sure you authorize your request by providing the following parameter pair: q=view');
		return res.redirect(404);
	}
	if(!vb.hasOwnProperty(req.query.q)){
		console.error('No view was found for this query parameter.',
			'Make sure you pass existing view tokens as parameter pair: q=view');
		return res.redirect(404);
	}
	var testPage = '<div>'+'[INJ:CONTENT]'+'</div>';
	testPage = testPage.replace('[INJ:CONTENT]',JSON.stringify(vb[req.query.q]));

	var data = JSON.parse(JSON.stringify(vto));
	data.view = testPage
	return res.status(200).send(data);
});

