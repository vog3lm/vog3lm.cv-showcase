'use strict';

const qrLogin = require('./login');
const logError = require('./error');
const logInfo = require('./info');

/* data transfer */
let dto = {"cols":[],"recs":[],"meta":{"state":"error","type":"dto","id":null,"tag":""}};
let vto = {"view":null,"meta":{"state":"error","type":null,"q":null,"tag":""}};

module.exports = {
	'qr': (qrId,credentials,leeds,res) => {
		/* load data */
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
		/* create leed dto */
		let dataRecord = JSON.parse(JSON.stringify(dto)); // clone data transfer object
		let data = JSON.parse(JSON.stringify(vto)); // clone view transfer object
		let meta = data.meta;
		let view = leeds[qrLeed];
		meta.type = view.type;
		data.view = view.view;
		if(view.hasOwnProperty('meta')){
			for(var key in view.meta){
				meta[key] = view.meta[key];
			}
		}
		meta.q = qrLeed;
		meta.state = 'success';
		data.meta = meta;
		dataRecord['cols'].push(qrLeed);
		dataRecord['recs'].push(data);
		dataRecord.meta.id = qrLeed;
		dataRecord.meta.state = 'success';
		dataRecord = JSON.stringify(dataRecord).replace(new RegExp('"','g'),'\\"');
		logInfo.smartAuth('qr(req,res)','user: '+qrCreds.mail+' leed: '+qrLeed);
		return res.status(200).send(qrLogin.page(qrLogin.script(qrCreds.mail,qrCreds.pass,dataRecord)));		
	}
	,'flyer': (rqId,flyId,credential,leeds,views,res) => {
		/* load data */
		if(!credentials.hasOwnProperty(qrId)){
			logError.invalidQrId('fly(req,res) 2',qrId);
			return res.status(200).send(qrLogin.page(qrLogin.fail('Invalid id token. Pass a valid login token!')));
		}
		if(!views.hasOwnProperty(flyId)){
			logError.invalidQrFly('fly(req,res) 2',flyId);
			return res.status(200).send(qrLogin.page(qrLogin.fail('Invalid view token. Pass a valid view token!')));
		}
		let qrCreds = credentials[qrId];
		/* check qr leed */
		let qrLeed = qrCreds.leed;
		if(!leeds.hasOwnProperty(qrLeed)){
			logError.invalidLeedToken('qr(req,res)',qrId,qrLeed);
			qrLeed = 'O2FNkkqqE';
		}
		/* create leed dto */
		let dataRecord = JSON.parse(JSON.stringify(dto)); // clone data transfer object
		let data = JSON.parse(JSON.stringify(vto)); // clone view transfer object
		let meta = data.meta;
		let view = leeds[qrLeed];
		meta.type = view.type;
		data.view = view.view;
		if(view.hasOwnProperty('meta')){
			for(var key in view.meta){
				meta[key] = view.meta[key];
			}
		}
		meta.q = qrLeed;
		meta.state = 'success';
		data.meta = meta;
		dataRecord['cols'].push(qrLeed);
		dataRecord['recs'].push(data);
		dataRecord.meta.id = qrLeed;
		dataRecord.meta.state = 'success';
		dataRecord = JSON.stringify(dataRecord).replace(new RegExp('"','g'),'\\"');
		logInfo.smartAuth('fly(req,res)','user: '+qrCreds.mail+' view: '+flyId+' leed: '+qrLeed);
		return res.status(200).send(qrLogin.page(qrLogin.script(qrCreds.mail,qrCreds.pass,dataRecord)));
	}
	,'mvp': (qId,views,contents,res) => {
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
			return res.status(500).send('Firebase Cold Start Timeout. Try again in a minute!');
		}
		dataRecord.meta.id = qId;
		dataRecord.meta.state = 'success';
		console.log('mvp dto build',dataRecord)
		return res.status(200).send(dataRecord);
	}
	,'pdf': (qId,pdfs,res) => {
			if(!pdfs.hasOwnProperty(qId)){
				logError.invalidQ('pdf(req,res)',qId);
				return res.status(404).send('Invalid query parameter. Pass a valid query token');
			}
			const gcs = require('@google-cloud/storage')();
			const spawn = require('child-process-promise').spawn;
			const path = require('path');
			const os = require('os');
			let pdfName = pdfs[qId];
	 		let pdfUrl = path.join(os.tmpdir(),'file.pdf');
			let pdfRes = gcs.bucket('vog3lm-0x1.appspot.com').file('w3b.cv.p6fs/'+pdfName).download({'destination':pdfUrl}).then(() => {
				console.log('download origin',pdfName);
				const fs = require('fs');
	 			return res.status(200).send({'pdf':fs.readFileSync(pdfUrl).toString('base64'),'name':pdfName});
			}).catch((e) => {
				logError.errorAuth('load(file.pdf)',e.code,e.message);
				return res.status(e.code).send(e.message);
			});
	}

}