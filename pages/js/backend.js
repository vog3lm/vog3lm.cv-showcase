/* @job :: someTextHere */
function decorate(args,opts,evts){
	for(var key in opts) {
	    if(args.hasOwnProperty(key)){
	    	args[key] = opts[key];
	    }
	}
}

/* @job :: login/logout user */
function F1rebas3Auth4p1Operator(firebase){
	var auth = firebase.auth();
	var dispatcher = null;
	var events = {
		'log-in':(user) => {this.login(user);}
	    ,'log-out':(data) => {this.logout();}
	  /*,'log-in-custom':(token) => {base.signInWithCustomToken(token).catch(function(error){console.log(error)});}*/
	};
	var args = {'user':'unset','token':'unset','firebase':'unset','scope':firebase.auth.Auth.Persistence.LOCAL}; // scopes LOCAL|SESSION|None
	/* non event methods */
	this.decorate = function(opts){
		decorate(args,opts);
		return this;
	}
	this.create = function(d){
		if('unset' !== args.firebase){base = firebase.auth();}
		switch(args.scope) {
			case 'none':args.scope = firebase.auth.Auth.Persistence.NONE; break;
			case 'session':args.scope = firebase.auth.Auth.Persistence.SESSION; break;
			default:args.scope = firebase.auth.Auth.Persistence.LOCAL; break;
		}
		if('unset' !== args.user){
			var tmp = window.localStorage.getItem('u');
			if(tmp && 'null' !== tmp){u = tmp;}
			else if(window.user){u = window.user;}
			
		} /* same-origin policy (host=host,port=port)*/
		if(d){
			dispatcher = d;
			dispatcher.onAppend({'events':Object.keys(events),'issues':Object.values(events)});
		} else {
			console.warn('firebase authentication operator','internal dispatcher used');
			dispatcher = new V13wEv3ntD1spatch3r().onDecorate({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
		}
		return this;
	}
	/* hybird access methods */
	this.login = function(user){
		auth.setPersistence(args.scope).then(() => {
			/* Note: Firebase Auth web sessions are single host origin 
					 and will be persisted for a single domain only. *//*
					 Calls base.onAuthStateChange() on success */
			auth.signInWithEmailAndPassword(user.mail,user.pass).catch((e) => {
				args.user = 'unset';
				args.token = 'unset';
				error(e);
			});
		}).catch((e) => {error(e);});
	}
	this.logout = function(){
		/* Calls base.onAuthStateChange() on success */
		auth.signOut().catch((e) => {error(e);});
	}
	/* private helpers */
	function success(){
		var dto = {'call':'got-mvp','url':'login'};
		if('unset' !== args.user && 'unset' !== args.token){
			var user = {
				 'email':args.user.email
				,'name':args.user.displayName
				,'uid':args.user.uid
				,'domain':args.user.w
				,'phone':args.user.phoneNumber
				,'photo':args.user.photoUrl
				,'last':args.user.metadata.lastSignInTime
				,'token':args.token
				,'created':args.user.metadata.creationTime}
			dto['user']=user;
			dto['id']='auth-state-login';
		}else{dto['id'] = 'auth-state-logout';}
		$('body').trigger('got-mvp',dto);
		$('body').trigger('got-token',{'call':'got-error','id':dto.id,'url':'login','token':args.token});
	}
	function error(e){
		$('body').trigger('got-error',{'call':'got-error','id':'log-in','url':'login'
									  ,'errors':[e.code,e.message]}); // ,'code':error.code,'message':error.message
	}
	/* log-in/log-out listener */
	auth.onAuthStateChanged((u) => {
		if(u){
			u.getIdToken(/* forceRefresh */true).then((userToken) => {
				args.user = u;
				args.token = userToken;
				success();
			}).catch((e) => {error(e)});
		} else {
			args.user = 'unset';
			args.token = 'unset';
			success();
		}
	});
}
/* @job :: someTextHere */
function Mvp4p1Operator(){
	var dispatcher = null;
	var product = 'https://us-central1-vog3lm-0x1.cloudfunctions.net';
	var args = {'url':product,'token':'unset'};
	var events = {
		 'got-token':(data) => {args.token = data.token;}
		,'call-mvp':(data) => {this.mvp(data);}
		,'call-src':(data) => {this.src(data);}
		,'call-msg':(data) => {this.msg(data);}
	};
	/* non event methods */
	this.decorate = function(opts){
		decorate(args,opts);
		return this;
	}
	this.create = function(d){
		if(d){
			dispatcher = d;
			dispatcher.onAppend({'events':Object.keys(events),'issues':Object.values(events)});
		} else {
			console.warn('mvp api operator','internal dispatcher used');
			dispatcher = new V13wEv3ntD1spatch3r().onDecorate({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
		}
		return this;
	}
	/* hybird access methods */
	this.mvp = function(data){
		var errors = [];
		if('unset' === args.token){errors.push('no token found.');}
		if('unset' === args.url){errors.push('no url found.');}
		if(!data.q){errors.push('no query token found');}
		if('unset' === data.q){errors.push('invalid query token');}
		data['type'] = 'GET';
		data['api'] = 'mvp';
		if(0 < errors.length){
			data['errors'] = errors;
			data['code'] = 1;
			error(data);
		}else{request(data);}
	}
	this.src = function(data){
		var errors = [];
		if('unset' === args.token){errors.push('no token found.');}
		if('unset' === args.url){errors.push('no url found.');}
		if(!data.q){errors.push('no query token found');}
		if('unset' === data.q){errors.push('invalid query token');}
		data['type'] = 'GET';
		data['api'] = 'pdf';
		if(0 < errors.length){
			data['errors'] = errors;
			data['code'] = 1;
			error(data);
		}else{request(data);}
	}
	this.msg = function(data){
		$.ajax({
			type:'POST',
		  	url:args.url+'/'+'msg',
		  	crossDomain:true,
		  	context:document.body,
		  	data:{'frm':data.mail,'msg':data.message,'nme':data.from}
		}).done(function(response){
			if(data.hasOwnProperty('promise')){data.promise(response);} 
			else {
				response['call'] = 'got-'+data.api;
				response['id'] = data.id;
				response['type'] = 'text';
				response['url'] = data.url;
				$('body').trigger('got-'+data.api,response);	
			}
		}).fail(function(xhr,status){
			data.errors = [xhr.responseText];
			data.code = 2;
			error(data);
		});
	}
	/* private helpers *//* error codes:
	 * 1 :: no token found 
	 * 2 :: token expired */
	function error(data){
		console.error('call-'+data.api+' error',data.errors,'url:',data.url);
		$('body').trigger('got-error',{'call':'got-error','id':'get-'+data.api,'tag':data.tag,'url':data.url,'errors':data.errors,'code':data.code});
	}
	function request(data){
		$.ajax({
		  	url:args.url+'/'+data.api+'/?q='+data.q,
		  	crossDomain:true,
		  	headers:{'Authorization':'CONTENT_ID_TOKEN::'+args.token},
		  	context:document.body,
		}).done(function(response){
			if(data.hasOwnProperty('promise')){data.promise(response);} 
			else {
				response['call'] = 'got-'+data.api;
				response['id'] = data.id;
				response['type'] = 'text';
				response['url'] = data.url;
				$('body').trigger('got-'+data.api,response);	
			}
		}).fail(function(xhr,status){
			data.errors = [xhr.responseText];
			data.code = 2;
			error(data);
		});
	}
	function header(view,type="GET"){ /* unused */
		console.log('Sending request to', args.url, 'with ID token in Authorization header.');
		var req = new XMLHttpRequest();
		req.onload = function() {
			console.log('receive content',req)
			// send update content event ?!
			//this.responseContainer.innerText = req.responseText;
		};
		req.onerror = function() {
			console.error('receive error',req)
			// send update content event ?!
			//this.responseContainer.innerText = 'There was an error';
		};
		req.open(type,args.url+view,true);
		req.setRequestHeader('Authorization', 'CONTENT_ID_TOKEN::'+args.token);
		req.send();
	}
	function cookie(view,type="GET"){ /* unused */
		// set the __session cookie
		document.cookie = '__session=' + args.token + ';max-age=3600';
		console.log('Sending request to', args.url, 'with ID token in __session cookie.');
		var req = new XMLHttpRequest();
		req.onload = function() {
			console.log('receive content',req)
		};
		req.onerror = function() {
			console.error('receive error',req)
		};
		req.open(type,args.url+view,true);
		req.send();
	}
}
/* @job :: someTextHere */
function D3s1gn4p1Operator(){
	var dispatcher = null;
	var src = 'unset';
	var args = {'design':'dark','designs':['white','dark'],'path':'css','url':'design','format':'css','after':'default'}
	var events = {
		'design-call':(data) => {this.call(data);}
		,'design-toggle':(data) => {this.toggle(data);}
	    ,'design-iterate':(data) => {
			wrapRemove(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
			var index = args.designs.indexOf(args.design);
			index++;
			if(index < args.designs.length){args.design = args.designs[index];}
			else{args.design = args.designs[0];}
			cssAdd(args.path+'/'+args.url+'.'+args.design+'.'+args.format);
	    }
	};
	/* non event methods */
	this.decorate = function(opts){
		decorate(args,opts);
		return this;
	}
	this.create = function(d){
		try{
			src = args.path+'/'+args.url+'.'+args.design+'.'+args.format;
			cssAdd(src);
			if(d){
				dispatcher = d;
				dispatcher.onAppend({'events':Object.keys(events),'issues':Object.values(events)});
			} else {
				console.warn('design api operator','internal dispatcher used');
				dispatcher = new V13wEv3ntD1spatch3r().onDecorate({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
			}
		}catch(error){
			console.error(error);
		}

		var orientation = 'land'
		if(0 == window.orientation){orientation = 'port';}
		$('img.after-effect').each(function(index){
			var element = $(this);
			element.attr('src','images/after/'+orientation+'.'+element.attr('alt')+'.'+args.design+'.png');
		});
		return this;
	}
	this.design = function(){return args.design;}
	/* hybrid access methods */
	this.call = function(data){
		cssRemove(src);
		src = src.replace(args.design,data.design);
		args.design = data.design;
		cssAdd(src);
	}
	this.toggle = function(data){
		cssRemove(src);
		if('white' == args.design){
			src = src.replace(args.design,'dark');
			args.design = 'dark';
			document.querySelector('meta[name="theme-color"]').setAttribute("content",'#222222');
			$('img.after-effect').each(function(index){
				var element = $(this);
				element.attr('src',element.attr('src').replace('white','dark'));
			});
		}
		else{
			src = src.replace(args.design,'white');
			args.design = 'white';
			document.querySelector('meta[name="theme-color"]').setAttribute("content",'#ffffff');
			$('img.after-effect').each(function(index){
				var element = $(this);
				element.attr('src',element.attr('src').replace('dark','white'));
			});
		}
		cssAdd(src);
	}
	/* private helpers */
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
/* @job :: someTextHere */
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
	var navView = ''
	+ '<nav id="doc-navigation">'
		+ '<a href="#" class="fa fa-chevron-circle-up hide" call="scroll-up"></a>'
		+ '<a href="#" class="fa fa-chevron-circle-down" call="scroll-down"></a>'
	+ '</nav>';
	var distance = 0;
	/* non event methods */
	this.decorate = function(opts){
		decorate(args,opts);
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
	/* private helpers */
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
/* @job :: someTextHere */
function Swipe4p1Operator(){
	/*	http://jquerymobile.com/download-builder/	*//*
		jQuery Mobile event cheat sheet 			*//*
		orientationchange 
		pinch 
		pinchopen // two fingers away from each other
		pinchclose // two fingers against each other
		rotate 
		rotatecw // clockwise
		rotateccw // counterclockwise
		swipemove
		swipeone // one touch point
		swipetwo // two touch points
		swipethree 
		swipefour 
		swipeup 
		swiperightup
		swiperight
		swiperightdown
		swipedown
		swipeleftdown
		swipeleft 
		swipeleftup 
		tapone 
		taptwo 
		tapthree 		*/
	var mapping = {};
	var args = {'mapping':{},'parent':null,'id':null,'tag':'playground','start':0,'mode':'children','distance':1,'before':()=>{return true},'after':()=>{}}
	var events = {
		'next':() => {return this.next();}
		,'prev':() => {return this.prev();}
		,'show':() => {}
	};
	var dispatcher = null;
	/**/
	var swipeParent = null;
	var swipeLeft = null;
	var swipeLight = null;
	var swipeMax = 0;
	var swipePages = 0;
	/* non event methods */
	this.decorate = function(opts){
		decorate(args,opts);
		return this;
	}
	this.create = function(d){
		/* create content user interface */
		errors = [];
		if(null == args.parent){errors.push('swipe presenter parent not set')}
		if(null == args.id){errors.push('swipe presenter parent not set')}
		if(0 < errors.length){console.error(errors);}
		else{
			swipeParent = args.parent;
			swipeLeft = $('a#get-'+args.id+'-prev');
			swipeRight = $('a#get-'+args.id+'-next');
			swipeParent.attr('index',args.start);
			swipePages = swipeParent.find(args.tag).length;
			swipeMax = swipePages;
			if('relative' === args.mode){swipeMax=swipePages-args.distance;} // swipe 3 childs 3 swipes 
			else{swipePages=swipePages-1;} // swipe child width (3 childs 2 swipes)
			this.show(args.start);
		}
		/* create user interface listener */
		if(args.mapping.hasOwnProperty('swipeleft')){
			events[args.mapping["swipeleft"].call] = events['next'];
			delete events.next;
			$(document).on("swipeleft",function(){
				events[args.mapping['swipeleft'].call]();
			});
		}
		if(args.mapping.hasOwnProperty('swiperight')){
			events[args.mapping["swiperight"].call] = events['prev'];
			delete events.prev;
			$(document).on("swiperight",function(){
				events[args.mapping['swiperight'].call]();
			});
		}
		if(args.mapping.hasOwnProperty('orientationchange')){
			$(window).on("orientationchange",function(event){
				var tmp = args.mapping["swiperight"];
				$('body').trigger(tmp.call,{'call':tmp.call,'id':'swiperight','url':tmp.url});
				$('body').trigger('design-create',{'call':'design-create','id':'orientationchange'});
			});
		}
		if(d){
			dispatcher = d;
			dispatcher.onAppend({'events':Object.keys(events),'issues':Object.values(events)});
		} else {
			console.warn('popup api operator','internal dispatcher used');
			dispatcher = new V13wEv3ntD1spatch3r().onDecorate({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
		}
		return this;
	}
	this.index = function(){return parseInt(swipeParent.attr('index'));}
	/* hybird access methods */
	this.next = function(){
		if(!args.before()){return index;}
		var index = parseInt(swipeParent.attr('index'));
		if(index == swipePages){return index;}
		index = index+1;
		if(index == swipePages){swipeRight.addClass('hide');} 
		else if(index == 1){swipeLeft.removeClass('hide');}
		swipeParent.attr('index',index);
		swipeParent.scrollLeft(distance(index));
		args.after();
		$('body').trigger('history-push',{'call':'got-mvp','url':'page','id':'get-next','index':index});
		return index;
	}
	this.prev = function(){
		if(!args.before()){return index;}
		var index = parseInt(swipeParent.attr('index'));
		if(index == 0){return index;} 
		index = index-1;
		if(index == 0){swipeLeft.addClass('hide');} 
		else if(index == swipePages-1){swipeRight.removeClass('hide');}					
		swipeParent.attr('index',index);
		swipeParent.scrollLeft(distance(index));
		args.after();
		$('body').trigger('history-push',{'call':'got-mvp','url':'page','id':'get-prev','index':index});
		return index;
	}
	this.show = function(index){
		if(!args.before()){return index;}
		if(0 > index){index = 0;}
		else if(swipeMax < index){index = swipeMax;} 
		if(index == 0){swipeLeft.addClass('hide');} 
		else{swipeLeft.removeClass('hide');}
		if(index == swipeMax){swipeRight.addClass('hide');}
		else{swipeRight.removeClass('hide');}
		swipeParent.attr('index',index);
		swipeParent.scrollLeft(distance(index));
		args.after();
		return index;
	}
	/* private helper methods */
	function distance(index){
		if('relative' == args.mode){return index*swipeParent.width()*swipeMax/swipePages;}
		else{
			var scrollValue = 0;
			for(var i=0;i<index;i++){
				scrollValue=scrollValue+swipeParent.find(args.tag+':nth-child('+(i+1)+')').width();
			};
			return scrollValue;
		}
	}

}
/* @job :: someTextHere */
function P0pup4p1Operator(){
	var body = $('body');
	/* popup view args */
	var popupHolder = null;
	var popupOperator = null;
	var popupContent = null;
	var popupTimer = null;
	var popupTimeout = null;
	var popupEvent = null;
	var popupElement = '<popup class="hide"><a href="#" id="popup-close" class="fa fa-times" call="popup-hide" url="popup"></a><section></section></popup>';
	var popupEvents = {
		'popup-hide':() => {this.hide();}
	}
	this.create = function(d){
		$('body').append(popupElement);
		popupHolder = $('popup');
		popupOperator = $('header').not('popup, popup *');
		popupContent = $('popup section');
		if(d){
			dispatcher = d;
			dispatcher.onAppend({'events':Object.keys(popupEvents),'issues':Object.values(popupEvents)});
		} else {
			console.warn('popup api operator','internal dispatcher used');
			dispatcher = new V13wEv3ntD1spatch3r().onDecorate({'events':Object.keys(popupEvents),'issues':Object.values(popupEvents)}).onRegister();
		}
		return this;
	}
	this.load = function(data){
		// 	var style = {};
		//	if(data.hasOwnProperty('opacity')){style['opacity'] = data.opacity;}
		//	if(data.hasOwnProperty('padding')){style['padding'] = data.padding;}
		//	if(data.hasOwnProperty('size')){
		//		var size = data.size;
		//		if('full' === size){
		//			style['width'] = '100%';
		//			style['height'] = '100%';
		//		}else if('half' === size){
		//			style['width'] = '50%';
		//			style['height'] = '50%';
		//		}else if('match' === size){
		//			if(pageWidth > pageHeight){style['width'] = '50%';}
		//			else{style['width'] = '80%';}
		//		}
		//	}
		//	popupHolder.css(style);

		popupContent.html(data.content);
		popupTimer = data.timeout;
		if(data.hasOwnProperty('event')){popupEvent = data.event;}
		return this;
	}
	this.show = function(){
		if(popupHolder.hasClass('hide')){
			popupHolder.removeClass('hide');
			/* 	bind hide listener on everything but popup and 
				children do only mouseup will close after clicked 
			*//* TODO:not working properly. */
			popupOperator.on("mouseup",function(e){
				popupHolder.addClass('hide');
				popupOperator.off("mouseup");
				if(null !== popupEvent){body.trigger(popupEvent.call,[popupEvent]);}
				popupEvent = null;
			});
			/* bind hide timer */
			if(Number.isInteger(popupTimer)){
				clearTimeout(popupTimeout);
				popupTimeout = setTimeout(function(){
					if(!popupHolder.hasClass('hide')){
						popupHolder.addClass('hide');
						popupOperator.off("mouseup");
						if(null !== popupEvent){body.trigger(popupEvent.call,[popupEvent]);}
						popupEvent = null;
					}
				},popupTimer);
			}else if(null === popupTimer || false === popupTimer){
				/**/
			}else{/* default hide after 5000 */
				clearTimeout(popupTimeout);
				popupTimeout = setTimeout(function(){
					if(!popupHolder.hasClass('hide')){
						popupHolder.addClass('hide');
						popupOperator.off("mouseup");
						if(null !== popupEvent){body.trigger(popupEvent.call,[popupEvent]);}
						popupEvent = null;
					}
				},5000);
			}
		}
		return this;
	}
	this.hide = function(){
		if(!popupHolder.hasClass('hide')){
			popupHolder.addClass('hide');
			popupOperator.off("mouseup");
			$(':not(popup)').off("mousedown");
			if(null !== popupEvent){body.trigger(popupEvent.call,[popupEvent]);}
			popupEvent = null;
		}
		return this;
	}
	this.toggle = function(){
		if(popupHolder.hasClass('hide')){return this.popup.show();}
		else{return this.popup.hide();}
	}
}
/* @job :: someTextHere */
function HtmlCancasTool(animation){ /* used in animation.X.js move */
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
            element.insertBefore(canvas, element.childNodes[4]);
        }
        return canvas;
    }
}
/* @job :: someTextHere */
function BrowserHistorD1spatcher(){
	var dispatcher = null;
	var events = {
		'history-replace':(data) => {this.replace(data);}
		,'history-push':(data) => {this.push(data);}
	}
	var last = null;
	/* non event methods */
	this.create = (d) => {
		if(d){
			dispatcher = d;
			dispatcher.onAppend({'events':Object.keys(events),'issues':Object.values(events)});
		} else {
			console.warn('history api operator','internal dispatcher used');
			dispatcher = new V13wEv3ntD1spatch3r().onDecorate({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
		}
		return this;
	}
	/* hybrid access methods *//*
	 * state = {'call':'got-mvp','url':'page','id':'get-prev','index':0} *//*
	 * window.history.method(state, title, url) */
	this.replace = (state) => {window.history.replaceState(state,0,location.href);}
	this.push = (state) => {window.history.pushState(state,0,location.href);}
	/* history forward/back has been hit 
	 * call events manually:
	 * window.history.forward()
	 * window.history.back()
	 * window.history.got(+-steps) */
	$(window).bind('popstate',(e) => {
	    if(null != e.originalEvent.state){
	    	var state = e.originalEvent.state;
	    	if(last === state.index || null === last){state.direction = 0;}
	    	else if(last < state.index){state.direction = 1;}
	    	else if(last > state.index){state.direction = -1;}
	    	last = state.index;
	    	state.history = true;
			$('body').trigger(state.call,state);
	    }
	});
}
/* @job :: someTextHere */
function Keyboard4p1Operator(){
	/*	key code cheat sheet *//*
		Enter			13	Home			36
		Up arrow		38	Backspace		8
		Down arrow		40	End				35
		Left arrow		37	Insert			45
		Right arrow		39	Delete			46
		Escape			27	Page Up			33
		Spacebar		32	Page Down		34
		Ctrl			17	Numlock			144
		Alt				18	Scroll-lock		145
		Tab				 9	Pause-break		19
		Shift			16	F1-F12			112-123
		Caps-lock		20	Print-screen	??
		Windows key		91	
		Windows option key	93				*/
	var mapping = {};
	var events = {};
	/* non event methods */
	this.map = (map) => {
		mapping = map;
		return this;
	}
	this.create = () => {
	    $(document).keydown(function(e){ /* need keydown, keypress no working on special keys */
	    	var key = e.which;
	    	if(mapping.hasOwnProperty(key)){
	    		// e.preventDefault();
	    		var tmp = mapping[key];
	    		$('body').trigger(tmp.call,{'call':tmp.call,'id':'onKeydown','url':tmp.url,'event':e});
	    		return;
			}
	    });
	    return this;
	}
}
/* @job :: someTextHere */
function V13wEv3ntD1spatch3r(){
    var events = [];
    var issues = [];
    this.onDecorate = function(holder){
	    events = holder.events;
	    issues = holder.issues;
	    return this;
    }
    this.onAppend = function(holder){
    	for(var i=0; i<holder.events.length; i++){
    		var key = holder.events[i];
			events.push(key);
			issues.push(holder.issues[i]);
    	}
    	return this;
    }
    this.onRegister = function(){
    	if(null == events || null == issues || 0 == events.length || 0 == issues.length){
    		throw 'view event dispachter not decorated. call onDecorate/onAppend first!'
    		return this;
    	}
        var registered = [];
		for (var i=0; i<events.length; i++){
            /* register events only one time! */
            if(!registered.includes(events[i])){
                var evt = events[i];
                $('body').on(evt,selfDispatch);
                registered.push(evt);
            }
            
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
            if(e.which == 13){
                e.preventDefault();
                var element = $(this)               
                if(element.attr('call')){
                    $('body').trigger(element.attr('call'),{call:element.attr('call'),id:element.attr('id'),url:element.attr('url')});
                }
            }
        });
        window.addEventListener('afterprint',function(e){
			$('body').trigger('view-toggle',[{'call':'view-toggle','id':e.type,'url':'print'}]);
        });
        return this;
    }
    function selfDispatch(evt,data){
        try {
	    	if(events == null || issues == null){
	    		throw 'view event dispachter not decorated. call onDecorate first!'
	    	}
            if(events.indexOf(evt.type) < 0){
                throw 'view event Intel not Found!'
            }
            for(var i=0;i<events.length;i++){
                if(events[i] === evt.type){
                    issues[i](data);
                }
            }
        } catch(error) {
        	$('body').trigger('loading-stop');
            console.error(error)
        }
    }
}
