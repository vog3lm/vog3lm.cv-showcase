'use strict';

module.exports = {
	'bootSleep': (value) => { /* obsolete */
		console.info('Interrupt cold start process to avoid issues. Bloddy workaround sleeps.',value,'Feels bad but works! Errors occured:'
					,'Could not load the default credentials.');
	}
	,'bootGo': (value) => { /* obsolete */
		console.info('Continue cold start process after',value);
	}

	,'headerAuth': (mehtod,aId) => {
		console.info(method,': Header authentication done. CONTENT_ID_TOKEN::'+aId);
	}
	,'sessionAuth': (method,aId) => {
		console.info(method,': Session cookie authentication done. __session='+aId);
	}
	,'smartAuth': (method,message) => {
		console.info(method,': Smart cv authentication done.',message);
	}

	,'loadGdb': (f,l,t) => {
		console.info(l,'records received from',f,'and stored to',t);
	}
	,'loadGcs': (fn,path) => {
		console.info('gcs.bucket(w3b.cv.c3rt/'+fn+')',': GCS data received and stored to',path);
	}

	,'dataBuild': (method,build) => {
		console.info(method,': ',build);
	}
	,'dataResponse': (method,data) => {
		console.info(method,': ',data);
	}
};