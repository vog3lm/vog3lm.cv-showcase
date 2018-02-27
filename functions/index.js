const functions = require('firebase-functions');

exports.qr = functions.https.onRequest((req, res) => {
	var token = req.query.token;
	console.log(token);
	if(!token){
		return res.status(404).redirect('https://vog3lm-0x1.firebaseapp.com/404');
	}
	return res.status(200).send(req.query.token);
});

