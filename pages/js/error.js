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
function D3s1gn4p1Operator(){
	var dispatcher = null;
	var src = 'unset';
	var args = {'design':'dark','designs':['white','dark']
			   ,'path':'css','url':'design','format':'css'}
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
		return this;
	}
	this.design = function(){return args.design;}
	this.call = function(){
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
		}
		else{
			src = src.replace(args.design,'white');
			args.design = 'white';
			document.querySelector('meta[name="theme-color"]').setAttribute("content",'#ffffff');
		}
		cssAdd(src);
	}

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
function Med1aPlay3r4p1Operator(){
	var dispatcher = null;
	var element = null;
	var events = {
		 'media-prev':(data) => {
		 	args.now--;
		 	if(args.now <= 0){args.now = args.tracks.length-1;}
		 	element[0].pause();
		 	var track = args.tracks[args.now];
		 	element.find('source').attr('src',track);
		 	element[0].load();
		 	element[0].play();
		 	console.log(args.now,track);
		 }
		,'media-play':(data) => {
			if(!element.find('source').attr('src')){
				element.find('source').attr('src',args.tracks[args.now])
				element[0].load();
			}
			element[0].play();
		}
		,'media-pause':(data) => {element[0].pause();}
		,'media-toggle':(data) => {
			if(element[0].paused){element[0].play();}
			else{element[0].pause();}
		}
		,'media-stop':(data) => {
			element[0].pause();
			element.find('source').attr('src','')
		}
		,'media-next':(data) => {
			args.now++;
			if(args.now >= args.tracks.length){args.now = 0;}
		 	element[0].pause();
		 	var track = args.tracks[args.now];
		 	element.find('source').attr('src',track);
		 	element[0].load();
		 	element[0].play();
		 	console.log('next',args.now,track);
		}
	}
	var args = {'tracks':[]
			   ,'now':0
			   ,'tag':'unset'
			   ,'id':'unset'
			   ,'autoplay':true
	};
	this.decorate = function(opts){
		for(var key in opts){
			if(args.hasOwnProperty(key)){
				args[key] = opts[key];
			}
		}
		return this;
	}
	this.create = function(d){
		try{
			if('unset' === args.url){throw 'url unset';}
			if('unset' === args.tag){throw 'tag unset';}
			if('unset' === args.id){throw 'id unset';}
			element = $(args.tag);
			element.find('source').attr('src',args.tracks[args.now]);
			var keys = Object.keys(events);
			for(var i=0; i<keys.length; i++){
				keys[i] = keys[i].replace('media',args.id);
			}

			if(d){
				d.onAppend({'events':Object.keys(events),'issues':Object.values(events)});
			} else {
				console.log('page listener','internal dispatcher used');
				new Err0rEv3ntD1spatch3r().onDecorate({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
			}
		}catch(error){
			console.error(error);
		}
		return this;
	}
	this.tag = function(){return args.tag;}
	this.id = function(){return args.id;}
}
function Fl4chM3ss4g34piOperator(){
	var events = {
		'error-flash':(data) => {this.error(data);}
		,'info-flash':(data) => {}
		,'warn-flash':(data) => {}
		,'log-flash':(data) => {}
	}
	var args = {};
	this.decorate = function(opts){
		for(var key in opts){
			if(args.hasOwnProperty(key)){
				args[key] = opts[key];
			}
		}
		return this;
	}
	this.create = function(d){
		try{
			var element = $('body').find('flash');
			element.css({
				'z-index':'1',
				'position':'absolute',
				'padding':'3px 7px 3px 7px',
				'width':'100%',
				'height':'36px',
				'line-height':'calc(36px - 6px)',
				'vertical-align':'middle',
				'text-align':'center',
				'color':'rgb(255,0,130)',
				'font-size':'1.75rem',
				'font-family':'monospace'
			});
			if(d){
				d.onAppend({'events':Object.keys(events),'issues':Object.values(events)});
			} else {
				console.log('page listener','internal dispatcher used');
				new Err0rEv3ntD1spatch3r().onDecorate({'events':Object.keys(events),'issues':Object.values(events)}).onRegister();
			}
		}catch(error){
			console.error(error);
		}
		return this;
	}
	this.error = function(data){
		if(!data.hasOwnProperty('message')){return;}
		var element = $('body').find('flash');
		if(!element){return;}
		element.html(data.message);
		element.css({
			'background-color':'transparent'
			,'text-align':'center'
			,'color':'rgb(255,0,130)'
			,'font-size':'1.75rem'
			,'font-family':'monospace'
		});
		element.removeClass('hide');
		setInterval(() => {
			element.addClass('hide');
			element.html('');
		},3000);
	}
}
function Err0rEv3ntD1spatch3r(){
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
	    	if(events == null || issues == null){
	    		throw 'view event dispachter not decorated. call onDecorate first!'
	    	}
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