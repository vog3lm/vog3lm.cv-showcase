'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase); // used in all dependent firebase stuff
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const auth = admin.auth();
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin:true});
const path = require('path');
const os = require('os');
const fs = require('fs');
const pdfkit = require('pdfkit')
/* local script imports */
const logError = require('./error');
const logInfo = require('./info');
const qrLogin = require('./login');

const bootSleepTime = 2000;
logInfo.bootSleep(bootSleepTime);
const start = new Date().getTime();
for (var i = 0; i < 1e7; i++){if((new Date().getTime()-start) > bootSleepTime){break;}}
logInfo.bootGo(bootSleepTime);

/* validate received token */
const validateFirebaseIdToken = (req, res, next) => {
	if ((!req.headers.authorization || !req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) && !req.cookies.__session) {
		logError.noToken('global/validateFirebaseIdToken(req,res,next)')
		res.status(403).send('Unauthorized - No token found!');
	} else {
		let idToken;
		if(req.headers.authorization && req.headers.authorization.startsWith('CONTENT_ID_TOKEN::')) {
			console.log('Found "Authorization" header');
			idToken = req.headers.authorization.split('CONTENT_ID_TOKEN::')[1];
		}else if(null !== req.cookies.__session) {
			console.log('Found "__session" cookie');
			idToken = req.cookies.__session;
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


/* custom in memory db */
let db = {};
let vb = {};
let pb = {};
let cb = {};
let lb = {};

const bucketUrl = 'vog3lm-0x1.appspot.com';
/*  pre load credentials from bucketUrl */
const secretFile = 'store.secret.js';
const secretUrl = path.join(os.tmpdir(),secretFile)
gcs.bucket(bucketUrl).file('w3b.cv.c3rt/'+secretFile).download({'destination':secretUrl}).then(()=>{
	logInfo.loadGcs(secretFile,secretUrl);
	fs.readFile(secretUrl,'utf8',(err,data) => {
		try{
			if(!err){
				let json = JSON.parse(data);
				db = json.credStore;
				vb = json.viewStore;
				pb = json.pdfStore;
			} else {throw err}
			logInfo.loadLocal(secretFile,'creds: '+Object.keys(db).length+' views: '+Object.keys(vb).length+' pdfs:'+Object.keys(pb).length);
		}catch(e){
			logError.failStorage(secretFile,e);
			db = {};
			vb = {};
			pb = {};
		}
	});
	return;
}).catch((e) => {	/* https://firebase.google.com/docs/storage/web/handle-errors */
	logError.noStorage(secretFile,e)
	db = {};
	vb = {};
	pb = {};
});
/*  pre load content from bucketUrl */
const contentFile = 'store.content.js';
const contentUrl = path.join(os.tmpdir(),contentFile);
gcs.bucket(bucketUrl).file('w3b.cv.c3rt/'+contentFile).download({'destination':contentUrl}).then(()=>{
	logInfo.loadGcs(contentFile,contentUrl);
	fs.readFile(contentUrl,'utf8',(err,data) => {
		try{if(!err){cb = JSON.parse(data);} 
			else{throw err;}
			logInfo.loadLocal(secretFile,'content: '+Object.keys(cb).length);
		}catch(e){
			logError.failStorage(contentFile,e);
			cb = {};
		}
	});
	return;
}).catch((e) => {
	logError.noStorage(contentFile,e)
	cb = {}
});
/*  pre load leeds from bucketUrl */
const leedFile = 'store.leeds.js';
const leedUrl = path.join(os.tmpdir(),leedFile)
gcs.bucket(bucketUrl).file('w3b.cv.c3rt/'+leedFile).download({'destination':leedUrl}).then(()=>{
	logInfo.loadGcs(leedFile,leedUrl);
	fs.readFile(leedUrl,'utf8',(err,data) => {
		try{if(!err){lb = JSON.parse(data);} 
			else{throw err;}
			logInfo.loadLocal(leedFile,'leeds: '+Object.keys(lb).length);
		}catch(e){
			logError.failStorage(leedFile,e);
			lb = {};
		}
	});
	return;
}).catch((e) => {
	logError.noStorage(leedFile,e)
	lb = {}
});


/* data transfer */
let dto = {"cols":[],"recs":[],"meta":{"state":"error","type":"dto","id":null,"tag":""}};
let vto = {"view":null,"meta":{"state":"error","type":null,"q":null,"tag":""}};
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
exports.qr = functions.https.onRequest((req,res)=>{
	let qrDomain = 'https://vog3lm-0x1.firebaseapp.com';
	let qrPage = ''
		+ '<!DOCTYPE html><html lang="de"><head><title>vog3lm.cv.redirect</title>'
		+ '<link rel="shortcut icon" href="'+qrDomain+'/images/fox.white.png" type="image/x-icon">'
		+ '<link rel="icon" ref="'+qrDomain+'/images/fox.white.png" type="image/x-icon">[INJ:SCRIPT]'
		+ '</head><body></body></html>';
	/* check data dependencies */
	if(0 === Object.keys(db)){
		logError.noQrIdBase('qr(req,res)');
		return res.status(200).send(qrLogin.page(qrLogin.error('Authentication error. Missing dependencies.')));
	}
	if(0 === Object.keys(lb)){
		logError.noLeedBase('qr(req,res)');
		return res.status(200).send(qrLogin.page(qrLogin.error('Leed error. Missing dependencies.')));
	}

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
	if(!db.hasOwnProperty(qrId)){
		logError.invalidQrId('qr(req,res) 2',qrId);
		return res.status(200).send(qrLogin.page(qrLogin.fail('Invalid id token. Pass a valid login token!')));
	}
	let qrCreds = db[qrId];
	/* check qr leed */
	let qrLeed = qrCreds.leed;
	if(!lb.hasOwnProperty(qrLeed)){
		logError.invalidLeedToken('qr(req,res)',qrId,qrLeed);
		qrLeed = 'O2FNkkqqE';
	}
	console.log('qr login done',qrCreds.mail,qrCreds.pass,'qr leed done',qrLeed);
	let passUserByWindow = 'window.user = u;';
	let passUserByStorage = 'window.localStorage.setItem("u",u);';
	let passLeedByStorage = 'window.localStorage.setItem("l","'+lb[qrLeed]+'");'
	const scr = qrLogin.script(qrCreds.mail,qrCreds.pass,lb[qrLeed]); 
	return res.status(200).send(qrLogin.page(scr));
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
	/* check data dependencies */
	if(0 === Object.keys(db)){
		logError.noQrIdBase('qr(req,res)');
		return res.status(200).send(qrLogin.page(qrLogin.error('Authentication error. Missing dependencies.')));
	}
	/*
	if(0 === Object.keys(lb)){
		logError.noLeedBase('qr(req,res)');
		return res.status(200).send(qrLogin.page(qrLogin.error('Leed error. Missing dependencies.')));
	}
	/*

	/* check qr id */
	let qrId = null;
	let flyId = null;
	console.log(req.originalUrl)
	console.log(req.path)
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

	if(!db.hasOwnProperty(qrId)){
		logError.invalidQrId('fly(req,res) 2',qrId);
		return res.status(200).send(qrLogin.page(qrLogin.fail('Invalid id token. Pass a valid login token!')));
	}
	if(!vb.hasOwnProperty(flyId)){
		logError.invalidQrFly('fly(req,res) 2',flyId);
		return res.status(200).send(qrLogin.page(qrLogin.fail('Invalid view token. Pass a valid view token!')));
	}
	let qrCreds = db[qrId];

	// mybe leed ?
	let qrLeed = 'O2FNkkqqE';

	return res.status(200).send(qrLogin.page(qrLogin.script(qrCreds.mail,qrCreds.pass,lb[qrLeed])));
});


exports.pdf = functions.https.onRequest((req,res) => {
    cors(req, res, () => {
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
		admin.auth().verifyIdToken(idToken).then((user) => {
			if(0 === Object.keys(pb)){
				logError.noPdfBase('pdf(req,res)');
				return res.redirect(500);
			}
			if(!req.query.q){
				logError.noQ('pdf(req,res)');
				return res.redirect(404);
			}
			if(!pb.hasOwnProperty(req.query.q)){
				logError.invalidQ('pdf(req,res)',req.query.q);
				return res.redirect(404);
			}
			let pdfName = pb[req.query.q]
	 		let pdfUrl = path.join(os.tmpdir(),'file.pdf')
	 		// warn nested promisse
	 		let pdf = gcs.bucket(bucketUrl).file('w3b.cv.p6fs/'+pdfName).download({'destination':pdfUrl}).then(()=>{
	 			let pdf = fs.readFileSync(pdfUrl)
	 			let tmp = {'pdf':pdf.toString('base64'),'name':pdfName}
	 			return res.status(200).send(tmp);
			}).catch((e) => {
				logError.noStorage('load(file.pdf)',e);
				return res.status(500).send(e);
			});
			return res.status(500).send('default return. never reached.');
		}).catch((e) => {
			logError.errorAuth('load(file.pdf)',e);
			return res.status(500).send(e);
		});
		//return res.status(500).send('default return. never reached.');
    });
	//return res.status(500).send('default return. never reached.');
});





/*	/mvp/?q=view	*//* dev
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
		admin.auth().verifyIdToken(idToken).then((user) => {
			if(0 === Object.keys(vb)){
				logError.noViewBase('mvp(req,res)');
				return res.status(503).send('No data dependencies available!');
			}
			if(!req.query.q){
				logError.noQ('mvp(req,res)');
				return res.status(404).send('No content query parameter found!');
			}
			let qId = req.query.q;
			if(!vb.hasOwnProperty(qId)){
				logError.invalidQ('mvp(req,res)',qId);
				return res.status(403).send('Invalid content token!');
			}

			let dataRecord = JSON.parse(JSON.stringify(dto)); // clone data transfer object
			let viewRecord = cb[vb[qId]];
			if(viewRecord){
				console.log("for all view records build");
				for(var i=0; i < viewRecord.length; i++){
					
					let data = JSON.parse(JSON.stringify(vto)); // clone view transfer object
					let meta = data.meta;

					meta.type = viewRecord[i].type; // text|table|html
					data.view = viewRecord[i].view;

					if(viewRecord[i].hasOwnProperty('meta')){
						for(var key in viewRecord[i].meta){
							meta[key] = viewRecord[i].meta[key];
						}
					}

					meta.q = qId;
					meta.state = 'success';

					data.meta = meta;
					dataRecord['cols'].push(qId);
					dataRecord['recs'].push(data);
				}
			}else{
				console.error('Invalid content data!',qId,'viewStore',vb,'contentBase',cb)
			}
			dataRecord.meta.id = qId;
			dataRecord.meta.state = 'success';
			console.log('mvp dto build',dataRecord)
			return res.status(200).send(dataRecord);
		}).catch((error) => {
			console.error(error);
			return res.status(401).send(error);
		});
		//return res.status(500).send('default return. never reached. keep warning. fail instead due to headers set problem')
	});
	//return res.status(500).send('default return. never reached.')
});
