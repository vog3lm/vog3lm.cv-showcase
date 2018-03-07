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


/* 	vog3lm smart cv mobile qr code login backend api */
var db = {'PXHTajCVg':{'mail':'adm1n@smart.cv.de','pass':'44920420$Dollar'  ,'tag':''}
		 ,'1w9cBiU7Q':{'mail':'card@smart.cv.de' ,'pass':'c4rd@$m4r1.cv.d3' ,'tag':'2018,märz'}
		 /* flyer qr ID token 12-tupel-k15 *//*	ordered, p:previous, n:next	*/
		 ,'PT5VTsF8c':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8b':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8a':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8Z':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8Y':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8X':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8W':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8V':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8U':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8T':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8S':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 ,'PT5VTsF8R':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2015,nov'}
		 /* flyer qr ID token 9-tupel-k18 *//*	ordered, p:previous, n:next	*/
		 ,'aEC2Mj4fN':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2018,märz'}
		 ,'gJfrKris9':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2018,märz'}
		 ,'lNY4hRkMv':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2018,märz'}
		 ,'ZZvqAmOsx':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2018,märz'}
		 ,'DEPl3yjiS':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2018,märz'}
		 ,'lvhPjXCTi':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2018,märz'}
		 ,'hN3EptFwt':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2018,märz'}
		 ,'VA0850MmS':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2018,märz'}
		 ,'uiLT6kFBG':{'mail':'flyer@smart.cv.de','pass':'fly3r@$m4r1.cv.d3','tag':'2018,märz'}
		 /* custom cv users */
		 ,'6PW2gsYzD':{'mail':'unset','pass':'unset','tag':''}
		 ,'O2FNkkqqE':{'mail':'unset','pass':'unset','tag':''}}
/*	/qr/?qR1D=id	*//*	TODO TODO MOVE TO STORAGE FILE
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
/*	/mvp/?q=view	*//*	TODO TODO MOVE TO STORAGE FILE
	qR client -> https://vog3lm-0x1.firebaseapp.com -> https://us-central1-vog3lm-0x1.cloudfunctions.net/mvc/?q=view
	qR client    									<- content
*/
var vb = {'PXHTajCVg':{'mail':'adm1n@smart.cv.de','pass':'44920420$Dollar'  ,'tag':''}
		 ,'1w9cBiU7Q':{'mail':'card@smart.cv.de' ,'pass':'c4rd@$m4r1.cv.d3' ,'tag':'2018,landing'}
		 /* flyer qr ID token 12-tupel-k15 *//*	ordered, p:previous, n:next	*/
		 ,'PT5VTsF8c':{'p':'PT5VTsF8b','n':'PT5VTsF8R','tag':'1995,gs,grundschule'}	
		 ,'PT5VTsF8b':{'p':'PT5VTsF8a','n':'PT5VTsF8c','tag':'2001,rs,realschule,abschluss,mittlere reife'}	
		 ,'PT5VTsF8a':{'p':'PT5VTsF8Z','n':'PT5VTsF8b','tag':'2004,bank,ksw,berufschule,ausbildung,abschluss,bwl'}
		 ,'PT5VTsF8Z':{'p':'PT5VTsF8Y','n':'PT5VTsF8a','tag':'2005,2006,zivi,zivildienst,bad wurzach,rheumaklinik'}
		 ,'PT5VTsF8Y':{'p':'PT5VTsF8X','n':'PT5VTsF8Z','tag':'2009,abi,abitur,matura,abschluss,bwl,vwl,wirtschaft'}
		 ,'PT5VTsF8X':{'p':'PT5VTsF8W','n':'PT5VTsF8Y','tag':'2010,konstanz,universität,mathematik'}
		 ,'PT5VTsF8W':{'p':'PT5VTsF8V','n':'PT5VTsF8X','tag':'2013,bad wurzach,rheumaklinik,bwl'}
		 ,'PT5VTsF8V':{'p':'PT5VTsF8U','n':'PT5VTsF8W','tag':'2013,weingarten,hochschule,fh,tutor,mathematik'}
		 ,'PT5VTsF8U':{'p':'PT5VTsF8T','n':'PT5VTsF8V','tag':'2014,weingarten,hochschule,fh,bachelor,abschluss,informatik'}
		 ,'PT5VTsF8T':{'p':'PT5VTsF8S','n':'PT5VTsF8U','tag':'2014,fn,friedrichshafen,zf,trainee,praktikum,abschluss,bachelor,informatik'}
		 ,'PT5VTsF8S':{'p':'PT5VTsF8R','n':'PT5VTsF8T','tag':'2015,weingarten,schülerhilfe,lehrer,tutor,pädagogik'}
		 ,'PT5VTsF8R':{'p':'PT5VTsF8c','n':'PT5VTsF8S','tag':'2015,about,landing'}
		 /* flyer qr ID token 9-tupel-k18 *//*	ordered, p:previous, n:next	*/
		 ,'aEC2Mj4fN':{'p':'gJfrKris9','n':'O2FNkkqqE','tag':'2001,gs,grundschule,rs,realschule,abschluss'}
		 ,'gJfrKris9':{'p':'lNY4hRkMv','n':'aEC2Mj4fN','tag':'2004,sparkasse,bankkaufmann,ausbildung,ihk,berufsschule,ausbildung,abschluss,bwl,vwl,wirtschaft'}
		 ,'lNY4hRkMv':{'p':'ZZvqAmOsx','n':'gJfrKris9','tag':'2006,zivildinest,rheumaklinik,soziales'}
		 ,'ZZvqAmOsx':{'p':'DEPl3yjiS','n':'lNY4hRkMv','tag':'2009,abitur,gymnasium,bwl,vwl,wirtschaft,pädagogik,informatik,rheumaklinik'}
		 ,'DEPl3yjiS':{'p':'lvhPjXCTi','n':'ZZvqAmOsx','tag':'2013,studium,mathematik,informatik,konstanz,weingarten,universität,hochschule,pädagogik,rheumaklinik'}
		 ,'lvhPjXCTi':{'p':'hN3EptFwt','n':'DEPl3yjiS','tag':'2014,studium,hochschule,it,abschluss,bachelor,zf,weingarten'}
		 ,'hN3EptFwt':{'p':'VA0850MmS','n':'lvhPjXCTi','tag':'2018,studium,hochschule,pädagogik,bwl,vwl,wirtschaft,informatik,schülerhilfe'}
		 ,'VA0850MmS':{'p':'uiLT6kFBG','n':'hN3EptFwt','tag':'2018,skills,informatik,programmieren'}
		 ,'uiLT6kFBG':{'p':'aEC2Mj4fN','n':'VA0850MmS','tag':'2018,about,landing'}}

var dto = {"cols":[],"recs":[],"meta":{"state":"success","type":"dto","id":"","tag":""}};
var vto = {"view":"unset","meta":{"state":"success","type":"vto","id":"test","tag":"test"}};

exports.mvp = functions.https.onRequest((req,res)=>{
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

