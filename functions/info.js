'use strict';

module.exports = {
	'bootSleep': (value) => {
		console.info('Interrupt cold start process to avoid issues. Bloddy workaround sleeps.',value,'Feels bad but works! Errors occured:'
					,'Could not load the default credentials.');
	}
	,'bootGo': (value) => {
		console.info('Continue cold start process after',value);
	}
	,'loadGcs': (fn,path) => {
		console.info('gcs.bucket(w3b.cv.c3rt/'+fn+')',': GCS data received and stored to',path);
	}
	,'loadLocal': (fn,details='') => {
		console.info('gcs.bucket(w3b.cv.c3rt/'+fn+')',': Local data dependencies received',details);
	}
};