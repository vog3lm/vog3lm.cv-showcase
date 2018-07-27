'use strict';

module.exports = {
	'bootSleep': (value) => {
		console.info('Interrupt cold start process to avoid issues. Bloddy workaround sleeps.',value,'Feels bad but works! Errors occured:'
					,'Could not load the default credentials.');
	}
	,'bootGo': (value) => {
		console.info('Continue cold start process after',value);
	}

	,'headerAuth': (mehtod,aId) => {
		console.info(method,': CONTENT_ID_TOKEN::'+aId);
	}
	,'sessionAuth': (method,aId) => {
		console.info(method,': __session='+aId);
	}
	,'qrAuth': (method,aId) => {
		console.info(method,': ?qR1D='+aId);
	}

	,'loadGcs': (fn,path) => {
		console.info('gcs.bucket(w3b.cv.c3rt/'+fn+')',': GCS data received and stored to',path);
	}
	,'loadLocal': (fn,details='') => {
		console.info('gcs.bucket(w3b.cv.c3rt/'+fn+')',': Local data dependencies received',details);
	}

	,'dataBuild': (method,build) => {
		console.info(method,': ',build);
	}
	,'dataResponse': (method,data) => {
		console.info(method,': ',data);
	}
};