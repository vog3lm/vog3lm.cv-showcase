function F1rebas3Storage4p1Operator(firebase){
	// var base = firebase.storage();
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
	var dispatcher = null;
	var events = {
		'log-in':(user) => {	
			base.setPersistence(args.scope).then(() => {
				/* Note: Firebase Auth web sessions are single host origin 
						 and will be persisted for a single domain only.  */
				base.signInWithEmailAndPassword(user.mail,user.pass).catch((error) => {
				  	consoles.error('login error',error);
					args.user = 'unset';
					args.token = 'unset';
					$('body').trigger('logged-out',{'call':'logged-out','id':'auth-log-in'})
				});
			}).catch((error) => {console.error(error);});}
	    ,'log-out':(data) => {base.signOut().catch((error) => {console.error('login error',error)});}
	  /*,'log-in-custom':(token) => {base.signInWithCustomToken(token).catch(function(error){console.log(error)});}*/
	};
	var args = {'events':events,'user':'unset','token':'unset','firebase':'unset','scope':firebase.auth.Auth.Persistence.LOCAL};
	this.getToken = function(){return args.token;}	// mandatory
	this.decorate = function(opts){
		for(var key in opts) {
		    if(args.hasOwnProperty(key)) {
		    	if('events' !== key){
		    		args[key] = opts[key];
		    	}
		    }
		}
		return this;
	}
	this.create = function(){
		if('unset' !== args.firebase){base = firebase.auth();}
		if('unset' !== args.user){
			conslole.log(window.user);
		}

		switch(args.scope) {
			case 'none':args.scope = firebase.auth.Auth.Persistence.NONE; break;
			case 'session':args.scope = firebase.auth.Auth.Persistence.SESSION; break;
			default:args.scope = firebase.auth.Auth.Persistence.LOCAL; break;
		}
		dispatcher = new V13wEv3ntD1spatch3r({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();

		return this;
	}


	/* move to content request js... */
	this.reqHeader = function(url,type="GET"){
		if('unset' !== args.token){
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
			req.setRequestHeader('Authorization', 'CONTENT_ID_TOKEN::'+args.token);
			req.send();
		} else {
			console.error('No Content ID Token Found!')
		}
		// firebase.auth().currentUser.getIdToken().then(function(token){/* call token each request */});
	}
	this.reqCookie = function(url,type="GET"){
		if('unset' !== args.token){
			// set the __session cookie
			document.cookie = '__session=' + args.token + ';max-age=3600';
			console.log('Sending request to', url, 'with ID token in __session cookie.');
			var req = new XMLHttpRequest();
			req.onload = function() {
				console.log(req.responseText)
			};
			req.onerror = function() {
				console.error(req.responseText,'there was an error')
			};
			req.open(type, url, true);
			req.send();
		} else {
			console.error('No Content ID Token Found!')
		}
		// firebase.auth().currentUser.getIdToken().then(function(token){/* call token each request */});
	}
	/* move to content request js... */


	base.onAuthStateChanged((u) => {
	//	console.info(u,'User authentication state change!')
		if(u){
			args.user = u;
			u.getIdToken(/* forceRefresh */true).then((userToken) => {
				args.token = userToken;
				$('body').trigger('got-token',{'call':'got-token','id':'','token':args.token})
			}).catch((error) => {console.error(error);});
			$('body').trigger('logged-in',{
				 'call':'logged-in'
				,'id':'auth-state-listener'
				,'name':u.displayName
				,'mail':u.email
				,'verified':u.emailVerified
				,'anonym':u.isAnonymous
			});
		} else {
			args.user = 'unset';
			args.token = 'unset';
			$('body').trigger('logged-out',{'call':'logged-out','id':'auth-state-listener'})
		}
	});
}


function St1l34p1Operator(){
	this.remove = function(filename){wrapRemove(filename);}
	this.add = function(filename){wrapAdd(filename);}

	var args = {'design':'white','designs':['white','dark']
			   ,'path':'css','url':'design','format':'css'}

    function wrapAdd(filename){
		var fileref=document.createElement("link")
	    fileref.setAttribute("rel", "stylesheet")
	    fileref.setAttribute("type", "text/css")
	    fileref.setAttribute("href",filename)
	    if("undefined" !== typeof fileref){
	        document.getElementsByTagName("head")[0].appendChild(fileref)
	    } else {
	    	console.error('design not found',filename)
	    }
    }
    function wrapRemove(filename){
		var linkNode = document.querySelector('link[href*="'+filename+'"]');
		if(linkNode){
			linkNode.parentNode.removeChild(linkNode);
		} else {
			console.error('design not found',filename)
		}
    }

	var events = {
		'design-call':(data) => {
			wrapRemove(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
			args.design = data.design
			wrapAdd(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
		}
		,'design-toggle':(data) => {
			wrapRemove(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
			if('white' == args.design){args.design = 'dark'}
			else if('dark' == args.design){args.design = 'white'}
			wrapAdd(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
		}
	    ,'design-iterate':(data) => {
			wrapRemove(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
			var index = args.designs.indexOf(args.design);
			index++;
			if(index < args.designs.length){args.design = args.designs[index];}
			else{args.design = args.designs[0];}
			wrapAdd(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
	    }
	};
	new V13wEv3ntD1spatch3r({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();

}


function V13wEv3ntD1spatch3r(holder){
    var events = holder.events;
    var issues = holder.issues;
    this.onRegister = function(){
        for (var i=0; i<events.length; i++) {
            $('body').on(events[i],selfDispatch);
        };
        return this;
    }
    this.onUnleash = function(){
        $("a").each(function(){
            var element = $(this)
            if(element.attr('call')){
                element.on('click',function(){
                    var tmp = $(this)
                    $('body').trigger(tmp.attr('call'),[{call:element.attr('call'),id:element.attr('id'),url:tmp.attr('url')}]);
                });
            }
        });
        $('form').keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                var element = $(this)               
                if(element.attr('call')){
                    $('body').trigger(element.attr('call'),[{call:element.attr('call'),id:element.attr('id'),url:element.attr('url')}]);
                }
            }
        });
        return this;
    }
    function selfDispatch(evt,data){
        try {
            index = events.indexOf(evt.type)
            if(index < 0){
                throw 'view event Intel not Found!'
            }
            issues[index](data)
        } catch(error) {
        	$('body').trigger('loading-stop')
            console.error(error)
        }
    }
}
