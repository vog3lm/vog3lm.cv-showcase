'use strict';

function F1rebas3Storage4p1Operator(firebase){
	var base = firebase.storage();
	//	var storage = firebase.storage();
	//	var reference = storage.ref('me.berlin_reichstag.a.jpg');

	//	reference.getDownloadURL().then(function(url) {
	//		var scr = url
	//	}).catch(function(error) {
		  // https://firebase.google.com/docs/storage/web/handle-errors
	//	  console.error(error)
	//	});
}

function F1rebas3Auth4p1Operator(firebase){
	var base = firebase.auth();
	var token = 'unset';
	this.getToken = () => {return token;}	// mandatory
	this.setToken = (t) => {token = t;}

	this.logIn = function(user) {
		base.signInWithEmailAndPassword(user.mail,user.pass).catch((error) => {
		  	console.error('login error',error)
		});
	}
	this.logOut = function() {
		base.signOut().catch((error) => {
		  	console.error('login error',error)
		});
	}
	this.reqHeader = function(url,type="GET"){
		if(token !== 'unset'){
			console.log('Sending request to', url, 'with ID token in Authorization header.');
			var req = new XMLHttpRequest();
			req.onload = function() {
				console.log(req)
				//this.responseContainer.innerText = req.responseText;
			};
			req.onerror = function() {
				console.error(req.responseText,'there was an error')
				//this.responseContainer.innerText = 'There was an error';
			};
			req.open(type,url,true);
			req.setRequestHeader('Authorization', 'CONTENT_ID_TOKEN::'+token);
			req.send();
		} else {
			console.error('No Content ID Token Found!')
		}
		// firebase.auth().currentUser.getIdToken().then(function(token){/* call token each request */});
	}
	this.reqCookie = function(url,type="GET"){
		if(token !== 'unset'){
			// set the __session cookie
			document.cookie = '__content_id_token=' + token + ';max-age=3600';
			console.log('Sending request to', url, 'with ID token in __content_id_token cookie.');
			var req = new XMLHttpRequest();
			req.onload = function(){
				console.log(req.responseText)
			};
			req.onerror = function(){
				console.error(req.responseText,'there was an error')
			};
			req.open(type, url, true);
			req.send();
		} else {
			console.error('No Content ID Token Found!')
		}
		// firebase.auth().currentUser.getIdToken().then(function(token){/* call token each request */});
	}

	function getUserToken(user,refresh){
		// var user = firebase.auth().currentUser
		user.getIdToken(/* forceRefresh */refresh).then((userToken) => {
			token = userToken
			$('body').trigger('got-token',{'call':'got-token','id':'','token':token})
			return token
		}).catch((error) => {
			console.error(error);
		});
	}

	base.onAuthStateChanged((user) => {
		if(user){
			getUserToken(user,true);		// force token refresh!
			$('body').trigger('logged-in',{
				 'call':'logged-in'
				,'id':'auth-state-listener'
			    ,'name':user.displayName
			    ,'mail':user.email
			    ,'verified':user.emailVerified
			    ,'anonym':user.isAnonymous
			});
		} else {
			token = 'unset';
			$('body').trigger('logged-out',{'call':'logged-out','id':'auth-state-listener'})
		}
	});
}


function St1l34p1Operator(){
	this.remove = function(filename){
		var linkNode = document.querySelector('link[href*="'+filename+'"]');
		linkNode.parentNode.removeChild(linkNode)
	}
	this.add = function(filename){
	    var fileref=document.createElement("link")
	    fileref.setAttribute("rel", "stylesheet")
	    fileref.setAttribute("type", "text/css")
	    fileref.setAttribute("href",filename)
	    if(typeof fileref !== "undefined"){
	        document.getElementsByTagName("head")[0].appendChild(fileref)
	    }
	}
}


function V13wEv3ntD1spatch3r(holder){
    var events = holder.events
    var issues = holder.issues
    this.onRegister = function(){
        for (var i=0; i<events.length; i++) {
            $('body').on(events[i],selfDispatch);
        }
    }
    this.onUnleash = function(){
        $("a").each(function(){
            var element = $(this)
            if(element.attr('call')){
                element.on('click',function(){
                    var tmp = $(this)
                    $('body').trigger(tmp.attr('call'),[{call:tmp.attr('call'),id:tmp.attr('id')}]);
                });
            }
        });
        $('form').keypress(function(e) {
            if (e.which === 13) {
                e.preventDefault();
                var element = $(this)               
                if(element.attr('call')){
                    $('body').trigger(element.attr('call'),[{call:element.attr('call'),id:element.attr('id')}]);
                }
            }
        });
    }
    function selfDispatch(evt,data){
        try {
            index = events.indexOf(evt.type)
            if(index < 0){
                throw new function(){
                	this.error = 'view event Intel not Found!'
                };
            }
            issues[index](data)
        } catch(error) {
            console.error(error)
        }
    }
}
