'use strict';

module.exports = {
	'noToken': (method) => {
		console.error(method,': No Firebase ID token was passed as a content id token in the Authorization header.'
				,'Make sure you authorize your request by providing the following HTTP header:'
				,'Authorization: CONTENT_ID_TOKEN::<firebase-id-token> or by passing a "__session" cookie.');
	}
	,'noAuth':(method) => {
		console.error(method,': Invalid authentication method! Make sure to pass a valid authentication token in header or "__session" cookie.');
	}
	,'invalidAuth':(method,user,pass) => {
		console.error(method,': Unauthorized access credentials.',user,pass);
	}
	,'errorAuth':(method,error) => {
		console.error(method,': Authentication Error.',error);
	}


	,'noContentBase': (method) => {
		console.error(method,': No view ID database was found. Make sure you preload view content database!');
	}


	,'noViewBase': (method) => {
		console.error(method,': No view ID database was found. Make sure you preload view content database!');
	}


	,'noQ':(method) => {
		console.error(method,': No query parameter q was passed as a content ID token in the request parameters.',
				'Make sure you authorize your request by providing the following parameter pair: q=view');
	}
	,'invalidQ':(method,view) => {
		console.error(method,': Invalid query parameter.', 'Make sure you pass existing view tokens as parameter pair: q='+view);
	}


	,'noStorage':(method,error) => {
		console.error(method,': Failed to load GCS dependencies!','Error:',error.error,'Code:',error.code,'Errors:',error.errors);
	}
	,'failStorage':(method,error) => {
		console.error(method,': Failed to parse local dependencies!','Error:',error);
	}


	,'noQrIdBase':(method) => {
		console.error(method,': No qR ID database was found. Make sure you preload qR ID authentication database!');
	}
	,'noQrId':(method) => {
		console.error(method,': No qR ID token was passed as a content ID token in the request parameters.'
			,'Make sure you authorize your request by providing the following parameter pair: qR1D=token');
	}
	,'invalidQrId':(method,qrid) => {
		console.error(method,': No user was found for this qR ID token.'
			, 'Make sure you pass existing qR ID tokens as parameter pair: qR1D='+qrid);
	}

};



