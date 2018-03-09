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
	var dispatcher = null;
	var src = 'unset';
	var args = {'design':'white','designs':['white','dark']
			   ,'path':'css','url':'design','format':'css'}
	var events = {
		'design-call':(data) => {
			try{}
			catch(error){console.error(error);}
			cssRemove(src);
			src = src.replace(args.design,data.design);
			args.design = data.design;
			cssAdd(src);
		}
		,'design-toggle':(data) => {
			cssRemove(src);
			if('white' == args.design){
				src = src.replace(args.design,'dark');
				args.design = 'dark';
			}
			else{
				src = src.replace(args.design,'white');
				args.design = 'white';
			}
			cssAdd(src);
		}
	    ,'design-iterate':(data) => {
			wrapRemove(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
			var index = args.designs.indexOf(args.design);
			index++;
			if(index < args.designs.length){args.design = args.designs[index];}
			else{args.design = args.designs[0];}
			cssAdd(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
	    }
	};
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
		try{
			src = args.path+'/'+args.url+'.'+args.design+'.'+args.format;
			cssAdd(src);
			dispatcher = new V13wEv3ntD1spatch3r({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
		}catch(error){
			console.error(error);
		}
		return this;
	}
	this.design = function(){return args.design;}


    function cssAdd(filename){
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
    function cssRemove(filename){
		var linkNode = document.querySelector('link[href*="'+filename+'"]');
		if(linkNode){
			linkNode.parentNode.removeChild(linkNode);
		} else {
			console.error('design not found',filename)
		}
    }


}

function Scro114p1Operator(){
	var content = null;
	var scrolled = 0;
	var anker = 0;
	var args = {'scale':1.5
			   ,'node':'section#content'
			   ,'wheel':true
			   ,'keys':true
			   ,'bars':true
			   ,'orientation':'vertical'
	};
	var distance = 0;
	this.decorate = function(opts){
		for (var key in opts){
			if(args.hasOwnProperty(key)){
				args[key] = opts[key];
			}
		}
		return this;
	}
	this.create = function(){
		try{
			if(!args.node || 'unset' === args.node){
				throw 'parent unknown';
			}
			content = $(args.node);
			var bars = content.find('nav#doc-navigation');
			if('vertical' === args.orientation){
				anker = bars.outerHeight();
				content.find('div').each(function(){distance += $(this).outerHeight();});
				content.find('footer').each(function(){distance += $(this).outerHeight();});
				distance = distance - anker;
				content.on('wheel', function(e){scrollDelta(e.originalEvent.deltaY);});	
			} else if('horizontal' === args.orientation){
				anker = bars.outerWidth();
				content.find('div').each(function(){distance += $(this).outerWidth();});
				content.find('footer').each(function(){distance += $(this).outerWidth();});
				distance = distance - anker;
				content.on('wheel', function(e){scrollDelta(e.originalEvent.deltaX);});
			} else {
				throw 'orientation unknown';
			}
			if(!args.bars){$(args.node+' nav#doc-navigation').addClass('hide');}
		} catch(error) {
			console.error(error);
			content = null;
			distance = 0;
		}
		return this;
	}

	this.max = function(){scrollDelta(distance);}
	this.min = function(){scrollDelta(-(distance-scrolled));}
	this.delta = function(delta){scrollDelta(delta);}
	function scrollDelta(delta){
		if(scrolled <= distance && scrolled >= 0){
			scrolled+=Math.floor((delta*args.scale))
			if(scrolled < 0){scrolled = 0;}
			else if(scrolled > distance){scrolled = distance;}
		}
		if('vertical' === args.orientation){content.scrollTop(scrolled);}
		else if('horizontal' === args.orientation){content.scrollLeft(scrolled);}
		changeScrollBarUi(content);
	}
	function scrollSection(sec){
		changeScrollBarUi(content);
	}

	var navView = ''
	+ '<nav id="doc-navigation">'
		+ '<a href="#" class="fa fa-chevron-circle-up hide" call="scroll-up"></a>'
		+ '<a href="#" class="fa fa-chevron-circle-down" call="scroll-down"></a>'
	+ '</nav>';


	function changeScrollBarUi(content){
		var element = content.find('nav#doc-navigation');
		element.css({'top':(scrolled)});
		if(scrolled > 0){
			element.find('a.fa-chevron-circle-up').removeClass('hide')
		} else {
			element.find('a.fa-chevron-circle-up').addClass('hide')
		}
		if(scrolled >= distance){
			element.find('a.fa-chevron-circle-down').addClass('hide')
		} else {
			element.find('a.fa-chevron-circle-down').removeClass('hide')
		}
	}
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
