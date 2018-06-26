
function HtmlCancasTool(animation){
	var holder = animation;
    this.canvasParse = (id) => {
        return document.getElementById(id);
    }
    this.canvasScroll = () => {
    	// wrap canvas to scroll container
        var canvas = document.createElement("canvas");
        var scroll = document.createElement("scroll");
        scroll.appendChild(canvas);
        if('body' === holder.setting.args.paneParent){
        	document.body.appendChild(scroll)
        //    document.body.appendChild(canvas);
        } else {
            var element = document.getElementById(holder.setting.args.paneParent);
            element.insertBefore(scroll, element.childNodes[0])
        //    element.insertBefore(canvas, element.childNodes[0]);
        }
        return canvas;
    }
    this.canvasCreate = () => {
        var canvas = document.createElement("canvas");
        if('body' === holder.setting.args.paneParent){
            document.body.appendChild(canvas);
        } else {
            var element = document.getElementById(holder.setting.args.paneParent);
            element.insertBefore(canvas, element.childNodes[0]);
        }
        return canvas;
    }
}



function F1rebas3Storage4p1Operator(firebase){
	var base = firebase.storage();
	var events = {
	    'storage-create':(data) => {this.create();}
	    ,'storage-load':(data) => {
			var reference = base.ref(data.url);
			reference.getDownloadURL().then(function(url) {
				console.log(url)
			}).catch(function(error) {	/* https://firebase.google.com/docs/storage/web/handle-errors */
				console.error(error)
			});
		}
	};
	this.create = function(){
		try{
			dispatcher = new V13wEv3ntD1spatch3r({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
		}catch(error){
			console.error(error);
		}
		return this;
	}
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
				  	console.error('login error',error);
					args.user = 'unset';
					args.token = 'unset';
					$('body').trigger('logged-err',{'call':'logged-err','id':'auth-log-in','code':error.code,'message':error.message})
				//	$('body').trigger('logged-out',{'call':'logged-out','id':'auth-log-in'})
				});
			}).catch((error) => {console.error(error);});}
	    ,'log-out':(data) => {base.signOut().catch((error) => {console.error('login error',error)});}
	  /*,'log-in-custom':(token) => {base.signInWithCustomToken(token).catch(function(error){console.log(error)});}*/
	    ,'log-decorate':(data) => {this.decorate(data.opts);}
	    ,'log-create':(data) => {this.create();}
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
	base.onAuthStateChanged((u) => {
	//	console.info(u,'User authentication state change!')
		if(u){
			args.user = u;
			u.getIdToken(/* forceRefresh */true).then((userToken) => {
				args.token = userToken;
				$('body').trigger('got-token',{'call':'got-token','id':'auth-change','token':args.token})
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



function Mvp4p1Operator(){
	var dispatcher = null;
	/*  'https://us-central1-vog3lm-0x1.cloudfunctions.net/mvp/?q=query');  */
	/*  'https://us-central1-vog3lm-0x1.cloudfunctions.net/mvp/?q=query');  */
	var args = {'url':'https://us-central1-vog3lm-0x1.cloudfunctions.net/mvp/?q=','token':'unset'};
	var events = {
		'call-mvp':(data) => {
			try{
				console.info('call mvp.',data);
				var errors = [];
				if('unset' !== args.token){
					$.ajax({
					  	url:args.url+data.q,
					  	crossDomain: true,
					  	headers:{'Authorization':'CONTENT_ID_TOKEN::'+args.token},
					  	context: document.body,
			  	  		statusCode: {
						    404:() => {alert( "page not found" );}
						}
					}).done(function(data){
						if(data.hasOwnProperty('promise')){
							data.promise(data);
						} else {
							data['call'] = 'got-mvp';
							data['id'] = data.q;
							$('body').trigger('got-mvp',data);	
						}
					});
				}else{
					errors.push('no token found.');
				}
				if(0 < errors.length){throw errors}
			}catch(error){
				console.error(error);
				$('body').trigger('got-mvp',{'recs':error,'cols':['error'],'meta':{'state':'error'}});
			}
		}
		,'got-token':(data) => {args.token = data.token;}
	    ,'decorate-mvp':(data) => {this.decorate(data.opts);}
	    ,'create-mvp':(data) => {this.create();}
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
		dispatcher = new V13wEv3ntD1spatch3r({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
		return this;
	}

	/* move to content request js... */
	this.header = function(url,type="GET"){
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
	this.cookie = function(url,type="GET"){
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
}
function Scr1pt4p1Operator(){
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
    function jsAdd(filename){

    }
    function jsRemove(filename){

    }
}
function D3s1gn4p1Operator(){
	var dispatcher = null;
	var src = 'unset';
	var args = {'design':'dark','designs':['white','dark']
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
	    ,'design-create':(data) => {this.create(data.opts);}
	    ,'design-decorate':(data) => {this.create();}
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
			var errors = [];
			if(!args.node || 'unset' === args.node){
				errors.push('parent unknown');
			}
			content = $(args.node);
			var bars = content.find('nav#doc-navigation');
			content.scrollTop(0);
			scrolled = 0;
			distance = 0;
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
				content.on('wheel', function(e){scrollDelta(e.originalEvent.deltaX);});
			} else {
				errors.push('orientation unknown');
			}
			if(!args.bars){$(args.node+' nav#doc-navigation').addClass('hide');}


			if(0 > errors.length){throw errors;}
		} catch(error) {
			console.error(error);
			content = null;
			distance = 0;
		}
		return this;
	}
	this.refresh = function(){
		content.scrollTop(0);
		scrolled = 0;
		distance = 0;
		var bars = content.find('nav#doc-navigation');
		if('vertical' === args.orientation){
			anker = bars.outerHeight();
			content.find('div').each(function(){distance += $(this).outerHeight();});
			content.find('footer').each(function(){distance += $(this).outerHeight();});
			distance = distance - anker;
		} else if('horizontal' === args.orientation){
			anker = bars.outerWidth();
			content.find('div').each(function(){distance += $(this).outerWidth();});
			content.find('footer').each(function(){distance += $(this).outerWidth();});
			distance = distance - anker;
		}
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
function BrowserHistorD1spatcher(){
	this.replace = (state) => {
		window.history.replaceState(state,0,location.href);
	}
	this.push = (state) => {
		window.history.pushState(state,0,location.href);
	}
	$(window).bind('popstate',(e) => {
	    if(null != e.originalEvent.state){ // forward/back has been hit
	    	var state = e.originalEvent.state;
	    	state.history = true;
			$('body').trigger(state.call,state)
	    }
	});
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
        $("img").each(function(){ // make images clickable
            var element = $(this)
            if(element.attr('call')){
                element.on('click',function(){
                    var tmp = $(this)
                    $('body').trigger(tmp.attr('call'),{call:element.attr('call'),id:element.attr('id'),url:tmp.attr('url')});
                });
            }
        });
        $("a").each(function(){ // make ankors clickable
            var element = $(this)
            if(element.attr('call')){
                element.on('click',function(){
                    var tmp = $(this)
                    $('body').trigger(tmp.attr('call'),{call:element.attr('call'),id:element.attr('id'),url:tmp.attr('url')});
                });
            }
        });
        $('form').keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                var element = $(this)               
                if(element.attr('call')){
                    $('body').trigger(element.attr('call'),{call:element.attr('call'),id:element.attr('id'),url:element.attr('url')});
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
        	$('body').trigger('loading-stop');
            console.error(error)
        }
    }
}
