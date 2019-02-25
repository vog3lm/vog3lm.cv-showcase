'use strict';

let coldStartCredentials = true;
let coldStartLeeds = true;
let coldStartViews = true;
let coldStartContents = true;
let coldStartPdfs = true;

const functions = require('firebase-functions');
const admin = require('firebase-admin');
/* admin.initializeApp({}) *//* fast */
admin.initializeApp(functions.config().firebase);
const auth = admin.auth();
const database = admin.database();
const express = require('express');
const cors = require('cors')({origin:true});
/* local script imports */
const logError = require('./error');
const logInfo = require('./info');
const qrLogin = require('./login');
const webJobs = require('./jobs');

/* pre load data *//* async */
let credentials = null
let leeds = null
let views = null
let contents = null
let pdfs = null

/* manage users */
exports.userCreate = functions.auth.user().onCreate((user) => {
	console.log('create new user',user);
	if(null === credentials){
		database.ref('credData').on("value",(snapshot) => {
			console.log(snapshot)
			credentials = snapshot.val();
			coldStartCredentials = false;
			user.updateProfile({'displayName':'No Name','photoURL':'No Photo'});
		});
	}else{
		user.updateProfile({'displayName':'No Name','photoURL':'No Photo'});
    }
});/*
exports.userAuthState = auth.onAuthStateChanged(function(user) {
	if(user){
		console.log('user logged in',user);
		if(null === credentials){
			database.ref('credData').on("value",(snapshot) => {
				console.log(snapshot)
				credentials = snapshot.val();
				coldStartCredentials = false;
				user.updateProfile({'displayName':'No Name','photoURL':'No Photo'});
			});
		}else{
			user.updateProfile({'displayName':'No Name','photoURL':'No Photo'});
	    }
	}
});
exports.userDelete = functions.auth.user().onDelete((user) => {
	console.log('create new user',user);
});*/

/* validate received token */
const validateFirebaseIdToken = (req, res, next) => {
	if ((!req.headers.authorization || !req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) && !req.cookies.__session) {
		logError.noToken('global/validateFirebaseIdToken(req,res,next)')
		res.status(403).send('Unauthorized - No token found!');
	} else {
		let idToken;
		if(req.headers.authorization && req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')){
			idToken = req.headers.authorization.split('CONTENT_ID_TOKEN::')[1];
			logInfo.headerAuth('',idToken);
		}else if(null !== req.cookies.__session) {
			idToken = req.cookies.__session;
			logInfo.headerAuth('',idToken);
		}
		auth.verifyIdToken(idToken).then((decodedIdToken) => {
			/*{
				iss: 'https://securetoken.google.com/vog3lm-0x1',
				aud: 'vog3lm-0x1',
				auth_time: 1519730309,
				user_id: '',
				sub: '',
				iat: 1519819973,
				exp: 1519823573,
				email: 'test@user.de',
				email_verified: false,
				firebase:{ 
					identities: {email:[Object]},
			 		sign_in_provider: 'password'
			 	},
				uid: '' 
			}*/
			req.user = decodedIdToken;
			return next();
		}).catch((error) => {
			res.status(403).send('Unauthorized - Token Expired');
		});
	}
	return;
};
/*	/qr/?qR1D=id	*//* !
	qR client -> https://vog3lm-0x1.firebaseapp.com/qr/qR1D=id -> req = {path=/qr/id
																		 query={}
																		 originalUrl=/qr/id
																		 params={0:/qr/id}}
	qR client -> https://us-central1-vog3lm-0x1.cloudfunctions.net/qr/?qR1D=id&v=view -> req = {path=/
																								query={qR1D:id}
																								originalUrl=/?qR1D=id
																								params={0:'/'}}
	qR client    												<- login page
	qR client -> google auth domain
	qR client -> redirect content page
	qR client <- logged content page
*/
exports.qr = functions.https.onRequest((req,res) => {
	/* check qr id */
	let qrId = null;
	if(req.originalUrl.indexOf('?') !== -1 && '/' === req.path){
		if(!req.query.qR1D){
			logError.noQrId('qr(req,res) 1');
			return res.status(200).send(qrLogin.page(qrLogin.fail('No login token found. Pass a login token!')));
		}
		qrId = req.query.qR1D;
	}else if('/' !== req.path && -1 !== req.originalUrl.indexOf('/qr/')){
		let tmp = req.originalUrl;
		tmp = tmp.substring(tmp.indexOf('/qr/')+4,tmp.length);
		if(9 !== tmp.length){
			logError.invalidQrId('qr(req,res) 1',tmp);
			return res.status(200).send(qrLogin.page(qrLogin.fail('No login token found. Pass a login token!')));
		}
		qrId = tmp;
	}else{
		logError.noQrId('qr(req,res) 2');
		return res.status(200).send(qrLogin.page(qrLogin.fail('No query parameter found. Pass query parameter!')));
	}
	if(null === credentials || null === leeds){
		/* TODO nested promise :: still not solved, changed eslint rules instead */
		database.ref('credData').on("value",(snapshot) => {
			credentials = snapshot.val();
			coldStartCredentials = false;
			logInfo.loadGdb('credData',Object.keys(credentials).length,'credentials');
			database.ref('leedData').on("value",(snapshot) => {
				leeds = snapshot.val();
				coldStartLeeds = false;
				logInfo.loadGdb('leedData',Object.keys(leeds).length,'leeds');
				return webJobs.qr(qrId,credentials,leeds,res);
			}, (errorObject) => {
				logError.noStorage('leeds',errorObject);
				return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
			});
		}, (errorObject) => {
			logError.noStorage('credentials',errorObject)
			return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
		});
		/* TODO nested promise :: still not solved, changed eslint rules instead */
	}else{
		return webJobs.qr(qrId,credentials,leeds,res);
	}
});
/*	/fly/?qR1D=id&q=view	*//* !
	qR client -> https://vog3lm-0x1.firebaseapp.com/fly/qR1D/q -> req = {path=/fly/id/view
																		 query={}
																		 originalUrl=/fly/id/view
																		 params={0:/fly/id/view}}
	qR client -> https://us-central1-vog3lm-0x1.cloudfunctions.net/qr/?qR1D=id&v=view -> req = {path=?qR1D=id&q=view
																								query={qR1D:id,q=view}
																								originalUrl=?qR1D=id&q=view
																								params={0:'/'}}
	qR client    												<- login page
	qR client -> google auth domain
	qR client -> redirect content page
	qR client <- logged content page, open view on the fly
*/
exports.flyer = functions.https.onRequest((req,res)=>{
	/* check qr id and view */
	let qrId = null;
	let flyId = null;
	if(req.originalUrl.indexOf('?') !== -1 && '/' === req.path){
		if(!req.query.qR1D){
			logError.noQrId('fly(req,res) 1');
			return res.status(200).send(qrLogin.page(qrLogin.fail('No login token found. Pass a login token!')));
		}
		if(!req.query.q){
			logError.noQrFly('fly(req,res) 1');
			return res.status(200).send(qrLogin.page(qrLogin.fail('No view token found. Pass a view token!')));
		}
		qrId = req.query.qR1D;
		flyId = req.query.q;
	}else if('/' !== req.path && -1 !== req.originalUrl.indexOf('/flyer/')){
		let tmp = req.originalUrl;
		tmp = tmp.substring(tmp.indexOf('/flyer/')+4,tmp.length);
		if(9 !== tmp.length){
			logError.invalidQrId('fly(req,res) 1',tmp);
			return res.status(200).send(qrLogin.page(qrLogin.fail('No login token found. Pass a login token!')));
		}
		qrId = tmp;
		tmp = tmp.substring(tmp.indexOf('/flyer/'+qrId+'/')+14,tmp.length);
		if(9 !== tmp.length){
			logError.invalidQrFly('fly(req,res) 1',tmp);
			return res.status(200).send(qrLogin.page(qrLogin.fail('No view token found. Pass a view token!')));
		}
		flyId = tmp;
	}else{
		logError.noQrId('fly(req,res) 2');
		return res.status(200).send(qrLogin.page(qrLogin.fail('No query parameter found. Pass query parameter!')));
	}
	if(null === credentials || null === leeds){
		/* TODO nested promise :: still not solved, changed eslint rules instead */
		database.ref('credData').on("value",(snapshot) => {
			credentials = snapshot.val();
			coldStartCredentials = false;
			logInfo.loadGdb('credData',Object.keys(credentials).length,'credentials');
			database.ref('leedData').on("value",(snapshot) => {
				leeds = snapshot.val();
				coldStartLeeds = false;
				logInfo.loadGdb('leedData',Object.keys(leeds).length,'leeds');
				database.ref('viewStore').on("value",(snapshot) => {
					views = snapshot.val();
					coldStartViews = false
					logInfo.loadGdb('viewStore',Object.keys(views).length,'views');
					return webJobs.flyer(qrId,flyId,credentials,leeds,views,res);
				}, (errorObject) => {
					logError.noStorage('views',errorObject);
					return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
				});
			}, (errorObject) => {
				logError.noStorage('leeds',errorObject);
				return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
			});
		}, (errorObject) => {
			logError.noStorage('credentials',errorObject)
			return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
		});
		/* TODO nested promise :: still not solved, changed eslint rules instead */
	}else{
		return webJobs.flyer(qrId,flyId,credentials,leeds,views,res);
	}
});
/*	/mvp/?q=view	*//* dev
	qR client -> https://vog3lm-0x1.firebaseapp.com -> https://us-central1-vog3lm-0x1.cloudfunctions.net/pdf/?q=pdf
	qR client    									<- content
*/
exports.pdf = functions.https.onRequest((req,res) => {
	cors(req, res, () => { // cross-origin policy
		/* check authentication */
		if((!req.headers.authorization || !req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) /*&& !req.cookies.__session*/) {
			logError.noToken('pdf(req,res)');
			return res.status(401).send('Invalid user authorization.');
		} 
		let idToken;
		if(req.headers.authorization && req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) {
			idToken = req.headers.authorization.split('CONTENT_ID_TOKEN::')[1];
		} else if(null !== req.cookies.__session) {
			idToken = req.cookies.__session;
		} else {
			logError.noAuth('pdf(req,res)');
			return res.status(401).send('Invalid user authorization method.');
		}
		/* TODO nested promise :: still not solved, changed eslint rules instead */
		admin.auth().verifyIdToken(idToken).then((user) => {
			if(!user){
				return res.status(401).send('Unauthorized Access! Pass a valid user token.');
			}
			/* check query */
			if(!req.query.q){
				logError.noQ('pdf(req,res)');
				return res.status(404).send('No query parameter found.');
			}
			let qId = req.query.q;
			if(null === pdfs){
				database.ref('pdfStore').on("value",(snapshot) => {
					pdfs = snapshot.val();
					coldStartPdfs = false;
					logInfo.loadGdb('pdfStore',Object.keys(pdfs).length,'pdfs');
					return webJobs.pdf(qId,pdfs,res);
				},(errorObject) => {
					logError.noStorage('pdfs',errorObject)
					return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
				});
			}else{
				return webJobs.pdf(qId,pdfs,res);
			}
		}).catch((e) => {
			logError.errorAuth('load(file.pdf)',e);
			return res.status(500).send(e);
		});
		/* TODO nested promise :: still not solved, changed eslint rules instead */
	});
});
/*	/mvp/?q=view	*//* !
	qR client -> https://vog3lm-0x1.firebaseapp.com -> https://us-central1-vog3lm-0x1.cloudfunctions.net/mvp/?q=view
	qR client    									<- content
*/
exports.mvp = functions.https.onRequest((req,res) => {
	cors(req, res, () => { // cross-origin policy
		if((!req.headers.authorization || !req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) /*&& !req.cookies.__session*/) {
			logError.noToken('mvp(req,res)');
			return res.status(401).send('Invalid user authorization.');
		} 
		let idToken;
		if(req.headers.authorization && req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) {
			idToken = req.headers.authorization.split('CONTENT_ID_TOKEN::')[1];
		} else if(null !== req.cookies.__session) {
			idToken = req.cookies.__session;
		} else {
			logError.noAuth('mvp(req,res)');
			return res.status(401).send('Invalid user authorization method.');
		}
		/* TODO nested promise :: still not solved, changed eslint rules instead */
		admin.auth().verifyIdToken(idToken).then((user) => {
			if(!user){
				return res.status(401).send('fail');
			}
			/* check query */
			if(!req.query.q){
				logError.noQ('mvp(req,res)');
				return res.status(404).send('No content query parameter found!');
			}
			let qId = req.query.q;
			if(null === views || null === contents){
				database.ref('viewStore').on("value",(snapshot) => {
					views = snapshot.val();
					coldStartViews = false
					logInfo.loadGdb('viewStore',Object.keys(views).length,'views');
					database.ref('viewData').on("value",(snapshot) => {
						contents = snapshot.val();
						coldStartContents = false;
						logInfo.loadGdb('viewData',Object.keys(contents).length,'contents');
						return webJobs.mvp(qId,views,contents,res);
					},(errorObject) => {
						logError.noStorage('contents',errorObject)
						return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
					});			
				},(errorObject) => {
					logError.noStorage('views',errorObject)
					return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
				});
			}else{
				return webJobs.mvp(qId,views,contents,res);
			}
		}).catch((error) => {
			console.error(error);
			return res.status(401).send(error);
		});
		/* TODO nested promise :: still not solved, changed eslint rules instead */
	});
});
/**/
exports.msg = functions.https.onRequest((req,res)=>{
	cors(req, res, () => { // cross-origin policy
		database.ref('mailData').on("value",(snapshot) => {
			webJobs.msg(snapshot.val(),req.body.frm,req.body.nme,req.body.msg);
			return res.status(200).send('Message sent!');
		},(errorObject) => {
			logError.noStorage('views',errorObject)
			return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
		});

	});
});