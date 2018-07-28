'use strict';

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

/* pre load data *//* async */
let credentials = {}
database.ref('credData').on("value",(snapshot) => {
	credentials = snapshot.val();
	console.log('credentials',credentials);
},(errorObject) => {logError.noStorage('credentials',errorObject)});

let leeds = {}
database.ref('leedData').on("value",(snapshot) => {
	leeds = snapshot.val();
	console.log('leeds',leeds);
},(errorObject) => {logError.noStorage('leeds',errorObject)});

let views = {}
database.ref('viewStore').on("value",(snapshot) => {
	views = snapshot.val();
	console.log('views',views);
},(errorObject) => {logError.noStorage('views',errorObject)});

let contents = {}
database.ref('viewData').on("value",(snapshot) => {
	contents = snapshot.val();
	console.log('contents',contents);
},(errorObject) => {logError.noStorage('contents',errorObject)});

let pdfs = {}
database.ref('pdfStore').on("value",(snapshot) => {
	pdfs = snapshot.val();
	console.log('pdfs',pdfs);
},(errorObject) => {logError.noStorage('pdfs',errorObject)});

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
	/* check data dependencies */
	if(0 === Object.keys(credentials)){
		logError.noQrIdBase('qr(req,res)');
		return res.status(200).send(qrLogin.page(qrLogin.error('Authentication error. Missing dependencies.')));
	}
	if(0 === Object.keys(leeds)){
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
	if(!credentials.hasOwnProperty(qrId)){
		logError.invalidQrId('qr(req,res) 2',qrId);
		return res.status(200).send(qrLogin.page(qrLogin.fail('Invalid id token. Pass a valid login token!')));
	}
	let qrCreds = credentials[qrId];
	/* check qr leed */
	let qrLeed = qrCreds.leed;
	if(!leeds.hasOwnProperty(qrLeed)){
		logError.invalidLeedToken('qr(req,res)',qrId,qrLeed);
		qrLeed = 'O2FNkkqqE';
	}
	console.log('qr login done',qrCreds.mail,qrCreds.pass,'qr leed done',qrLeed);
	let passUserByWindow = 'window.user = u;';
	let passUserByStorage = 'window.localStorage.setItem("u",u);';
	let passLeedByStorage = 'window.localStorage.setItem("l","'+leeds[qrLeed]+'");'
	const scr = qrLogin.script(qrCreds.mail,qrCreds.pass,leeds[qrLeed]); 
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
	if(0 === Object.keys(credentials)){
		logError.noQrIdBase('qr(req,res)');
		return res.status(200).send(qrLogin.page(qrLogin.error('Authentication error. Missing dependencies.')));
	}
	/*
	if(0 === Object.keys(leeds)){
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

	if(!credentials.hasOwnProperty(qrId)){
		logError.invalidQrId('fly(req,res) 2',qrId);
		return res.status(200).send(qrLogin.page(qrLogin.fail('Invalid id token. Pass a valid login token!')));
	}
	if(!views.hasOwnProperty(flyId)){
		logError.invalidQrFly('fly(req,res) 2',flyId);
		return res.status(200).send(qrLogin.page(qrLogin.fail('Invalid view token. Pass a valid view token!')));
	}
	let qrCreds = credentials[qrId];

	// mybe leed ?
	let qrLeed = 'O2FNkkqqE';

	return res.status(200).send(qrLogin.page(qrLogin.script(qrCreds.mail,qrCreds.pass,leeds[qrLeed])));
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
			if(0 === Object.keys(pdfs)){
				logError.noPdfBase('pdf(req,res)');
				return res.redirect(500);
			}
			if(!req.query.q){
				logError.noQ('pdf(req,res)');
				return res.redirect(404);
			}
			if(!pdfs.hasOwnProperty(req.query.q)){
				logError.invalidQ('pdf(req,res)',req.query.q);
				return res.redirect(404);
			}
			let pdfName = pdfs[req.query.q]
	 		let pdfUrl = path.join(os.tmpdir(),'file.pdf')
	 		// warn nested promisse
	 		let pdf = bucket.file('w3b.cv.p6fs/'+pdfName).download({'destination':pdfUrl}).then(()=>{
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
			if(0 === Object.keys(views)){
				logError.noViewBase('mvp(req,res)');
				return res.status(503).send('No data dependencies available!');
			}
			if(!req.query.q){
				logError.noQ('mvp(req,res)');
				return res.status(404).send('No content query parameter found!');
			}
			let qId = req.query.q;
			if(!views.hasOwnProperty(qId)){
				logError.invalidQ('mvp(req,res)',qId);
				return res.status(403).send('Invalid content token!');
			}

			let dataRecord = JSON.parse(JSON.stringify(dto)); // clone data transfer object
			let viewRecord = contents[views[qId]];
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
				console.error('Invalid content data!',qId,'viewStore',views,'contentBase',contents)
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
