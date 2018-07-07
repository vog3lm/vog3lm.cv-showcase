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
const cors = require('cors')({origin:true});
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const fs = require('fs');
const pdfkit = require('pdfkit')
/* local script imports */
const error = require('./error');


/* validate received token */
const validateFirebaseIdToken = (req, res, next) => {
	if ((!req.headers.authorization || !req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) && !req.cookies.__session) {
		error.noToken('global/validateFirebaseIdToken(req,res,next)')
		res.status(403).send('Unauthorized - No token found!');
	} else {
		let idToken;
		if (req.headers.authorization && req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) {
			console.log('Found "Authorization" header');
			idToken = req.headers.authorization.split('CONTENT_ID_TOKEN::')[1];
		} else if(null != req.cookies.__session) {
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




/* in memory db */
var db = {};
var vb = {};
var pb = {};
var cb = {};
var lb = {};
/* in memory db */
var bucketUrl = 'vog3lm-0x1.appspot.com';
/*  pre load credentials from bucketUrl */
var secretUrl = path.join(os.tmpdir(),'store.secret.js')
gcs.bucket(bucketUrl).file('w3b.cv.c3rt/store.secret.js').download({'destination':secretUrl}).then(()=>{
	console.log('GCS object downloaded to', secretUrl);
	fs.readFile(secretUrl,'utf8',(err,data) => {
		try{
			if(!err){
				var json = JSON.parse(data);
				db = json.credStore;
				vb = json.viewStore;
				pb = json.pdfStore;
			} else {throw err}
			console.log('Successfully load local dependencies.','creds: ',Object.keys(db).length,'views:',Object.keys(vb).length);
		}catch(e){
			error.failStorage(e);
			db = {};
			vb = {};
			pb = {};
		}
	});
	return;
}).catch((e) => {	/* https://firebase.google.com/docs/storage/web/handle-errors */
	error.noStorage('load(store.secret.js)',e)
	db = {}
	vb = {}
});
/*  pre load content from bucketUrl */
var contentUrl = path.join(os.tmpdir(),'store.content.js')
gcs.bucket(bucketUrl).file('w3b.cv.c3rt/store.content.js').download({'destination':contentUrl}).then(()=>{
	console.log('GCS object downloaded to', contentUrl);
	fs.readFile(contentUrl,'utf8',(err,data) => {
		try{if(!err){cb = JSON.parse(data);} 
			else{throw err;}
			console.log('Successfully load local dependencies.','content: ',Object.keys(cb).length,'views:',Object.keys(cb).length);
		}catch(e){
			error.failStorage(e);
			cb = {};
		}
	});
	return;
}).catch((e) => {
	error.noStorage('load(store.leeds.js)',e)
	cb = {}
});
/*  pre load leeds from bucketUrl */
var leedUrl = path.join(os.tmpdir(),'store.leeds.js')
gcs.bucket(bucketUrl).file('w3b.cv.c3rt/store.leeds.js').download({'destination':leedUrl}).then(()=>{
	console.log('GCS object downloaded to', leedUrl);
	fs.readFile(leedUrl,'utf8',(err,data) => {
		try{if(!err){lb = JSON.parse(data);} 
			else{throw err;}
			console.log('Successfully load local dependencies.','leed: ',Object.keys(lb).length,'views:',Object.keys(lb).length);
		}catch(e){
			error.failStorage(e);
			lb = {};
		}
	});
	return;
}).catch((e) => {
	error.noStorage('load(store.leeds.js)',e)
	lb = {}
});


/* data transfer */
var dto = {"cols":[],"recs":[],"meta":{"state":"error","type":"dto","id":null,"tag":""}};
var vto = {"view":null,"meta":{"state":"error","type":null,"q":null,"tag":""}};
/*	/qr/?qR1D=id	*//* !
	qR client -> https://vog3lm-0x1.firebaseapp.com -> https://us-central1-vog3lm-0x1.cloudfunctions.net/test/?qR1D=id&v=view
	qR client    									<- login page
	qR client -> google auth domain
	qR client -> redirect content page
	qR client <- logged content view
*/
exports.qr = functions.https.onRequest((req,res)=>{
	var qrDomain = 'https://vog3lm-0x1.firebaseapp.com'
	if('PXHTajCVg' === req.query.qR1D){
		qrDomain = 'http://192.168.178.28:5000'
	}
	var qrPage = ''
		+ '<!DOCTYPE html><html lang="de"><head><title>vog3lm.cv.redirect</title>'
		+ '<link rel="shortcut icon" href="'+qrDomain+'/images/favicon.coyote.poly_white.b.png" type="image/x-icon">'
		+ '<link rel="icon" ref="'+qrDomain+'/images/favicon.coyote.poly_white.b.png" type="image/x-icon">[INJ:SCRIPT]'
		+ '</head><body></body></html>';
	if(0 === Object.keys(db)){
		error.noQrIdBase('qr(req,res)')
		return res.status(200).send(qrPage.replace('[INJ:SCRIPT]','</script><script type="text/javascript">window.location.replace("'+qrDomain+'/404")</script>'));
	}
	if (!req.query.qR1D){
		error.noQrId('qr(req,res)');
		return res.status(200).send(qrPage.replace('[INJ:SCRIPT]','</script><script type="text/javascript">window.location.replace("'+qrDomain+'/404")</script>'));
	}
	if(!db.hasOwnProperty(req.query.qR1D)){
		error.invalidQrId('qr(req,res)',req.query.q);
		return res.status(200).send(qrPage.replace('[INJ:SCRIPT]','</script><script type="text/javascript">window.location.replace("'+qrDomain+'/404")</script>'));
	}
	var qrCreds = db[req.query.qR1D];
	var qrRedirect = qrDomain;
	console.log('qr login done',qrCreds.mail,qrCreds.pass);
	return res.status(200).send(qrPage.replace('[INJ:SCRIPT]',
		  '<script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js"></script>'
		+ '<script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js">'
		+ '</script><script type="text/javascript">'
			+ 'firebase.initializeApp({apiKey:"AIzaSyDmXSkwOam-aQ37z8-3d5aH-X257lIVS34",authDomain:"vog3lm-0x1.firebaseapp.com",projectId:"vog3lm-0x1"});const a=firebase.auth();'
			//+ 'a.onAuthStateChanged(function(u){if(u){window.user = u;console.log("login ok","'+qrRedirect+'",window.user);}else{console.error("login fail","'+qrDomain+'/404");}});'
			//+ 'a.signInWithEmailAndPassword("'+qrCreds.mail+'","'+qrCreds.pass+'").catch(function(error){console.error("login error","'+qrDomain+'/404",error);});'
			/* pass user by url */
			//+ 'a.onAuthStateChanged(function(u){if(u){window.location.replace("'+qrRedirect+'/?u="+JSON.stringify(u));alert("stop")}else{window.location.replace("'+qrDomain+'/404");}});'
			//+ 'a.signInWithEmailAndPassword("'+qrCreds.mail+'","'+qrCreds.pass+'").catch(function(error){console.error("login error","'+qrDomain+'/404",error);});'
			/* pass user by window *//* same-origin policy (same host, same port) */
			+ 'a.onAuthStateChanged(function(u){if(u){window.user = u;window.localStorage.setItem("u",u);window.location.replace("'+qrRedirect+'");}else{window.location.replace("'+qrDomain+'/404");}});'
			+ 'a.signInWithEmailAndPassword("'+qrCreds.mail+'","'+qrCreds.pass+'").catch(function(error){window.location.replace("'+qrDomain+'/404");});'
		+ '</script>'));
});


exports.pdf = functions.https.onRequest((req,res) => {

    cors(req, res, () => {

		if((!req.headers.authorization || !req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) /*&& !req.cookies.__session*/) {
			error.noToken('pdf(req,res)');
			return res.status(401).send('Invalid user authorization.');
		} 
		let idToken;
		if(req.headers.authorization && req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) {
			idToken = req.headers.authorization.split('CONTENT_ID_TOKEN::')[1];
		} else if(null != req.cookies.__session) {
			idToken = req.cookies.__session;
		} else {
			error.noAuth('pdf(req,res)');
			return res.status(401).send('Invalid user authorization method.');
		}
		admin.auth().verifyIdToken(idToken).then((user) => {
			if(0 === Object.keys(pb)){
				error.noPdfBase('pdf(req,res)');
				return res.redirect(500);
			}
			if(!req.query.q){
				error.noQ('pdf(req,res)');
				return res.redirect(404);
			}
			if(!pb.hasOwnProperty(req.query.q)){
				error.invalidQ('pdf(req,res)',req.query.q);
				return res.redirect(404);
			}

			var pdfName = pb[req.query.q]
	 		var pdfUrl = path.join(os.tmpdir(),'file.pdf')
	 		var pdf = gcs.bucket(bucketUrl).file('w3b.cv.p6fs/'+pdfName).download({'destination':pdfUrl}).then(()=>{
	 			var pdf = fs.readFileSync(pdfUrl)
	 			var tmp = {'pdf':pdf.toString('base64'),'name':pdfName}
	 			return res.status(200).send(tmp);
			}).catch((e) => {
				error.noStorage('load(file.pdf)',e);
				return res.status(500).send(e);
			});

		});

    });

});





/*	/mvp/?q=view	*//* dev
	qR client -> https://vog3lm-0x1.firebaseapp.com -> https://us-central1-vog3lm-0x1.cloudfunctions.net/mvp/?q=view
	qR client    									<- content
*/
exports.mvp = functions.https.onRequest((req,res) => {

	cors(req, res, () => { // cross-origin policy

		if((!req.headers.authorization || !req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) /*&& !req.cookies.__session*/) {
			error.noToken('mvp(req,res)');
			return res.status(401).send('Invalid user authorization.');
		} 
		let idToken;
		if(req.headers.authorization && req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) {
			idToken = req.headers.authorization.split('CONTENT_ID_TOKEN::')[1];
		} else if(null != req.cookies.__session) {
			idToken = req.cookies.__session;
		} else {
			error.noAuth('mvp(req,res)');
			return res.status(401).send('Invalid user authorization method.');
		}
		admin.auth().verifyIdToken(idToken).then((user) => {
			if(0 === Object.keys(vb)){
				error.noViewBase('mvp(req,res)');
				return res.redirect(500);
			}
			if(!req.query.q){
				error.noQ('mvp(req,res)');
				return res.redirect(404);
			}
			if(!vb.hasOwnProperty(req.query.q)){
				error.invalidQ('mvp(req,res)',req.query.q);
				return res.redirect(404);
			}

			var dataRecord = JSON.parse(JSON.stringify(dto)); // clone data transfer object
			var viewRecord = cb[vb[req.query.q]];
			if(null != viewRecord){
				for(var i=0; i < viewRecord.length; i++){
					console.log("for all view records",i);
					var data = JSON.parse(JSON.stringify(vto)); // clone view transfer object
					var meta = data.meta;

					meta.type = viewRecord[i].type; // text|table|html
					data.view = viewRecord[i].view;

					if(viewRecord[i].hasOwnProperty('meta')){
						for(var key in viewRecord[i].meta){
							meta[key] = viewRecord[i].meta[key];
						}
					}

					meta.q = req.query.q;
					meta.state = 'success';

					data.meta = meta;
					dataRecord['cols'].push(req.query.q);
					dataRecord['recs'].push(data);
				};
			}else{
				console.error('fuck something went wrong!')
			}
			var meta = dataRecord.meta;
			meta.id = req.query.q;
			meta.state = 'success';
			console.log('mvp dto build',dataRecord)
			return res.status(200).send(dataRecord);
		}).catch((error) => {
			console.error(error);
			return res.status(401).send(error);
		});

	});
});
