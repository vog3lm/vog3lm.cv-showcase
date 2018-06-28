function CvLabelHolder(animation,id){
	var holder = animation;
	var element = $('img#'+id);
	var parent = element.parent();
	var position = parent.get(0).getBoundingClientRect();
    this.loc = {
        'x': Math.random()*position.width,
        'y': Math.random()*position.height
    };
    this.vel = {
        'x': (Math.round(Math.random())*2-1)*(Math.random()*(holder.setting.args.velMax-holder.setting.args.velMin)+holder.setting.args.velMin)/holder.setting.args.velScale,
        'y': (Math.round(Math.random())*2-1)*(Math.random()*(holder.setting.args.velMax-holder.setting.args.velMin)+holder.setting.args.velMin)/holder.setting.args.velScale
    };
    this.push = function(){
        border = holder.setting.args.paneBorder;
        width = element.width();
        height = element.height();
        if(this.loc.x >= position.width+border-width){ // check right
            this.loc.x = this.loc.x-width;
        }
        if(this.loc.y >= position.height+border-height){ // check bottom
            this.loc.y = this.loc.y-height;
        }
    };
    var border = null;
    var width = null;
    var height = null;
    var drunken = true;
    this.update = function() {
        if(this.loc.x >= position.width+border-width || this.loc.x <= -border){ //right||left
            this.vel.x = -this.vel.x;
        }
        if(this.loc.y >= position.height+border-height || this.loc.y <= -border){ //bottom||top
            this.vel.y = -this.vel.y;
        }
        this.loc.x += this.vel.x;
        this.loc.y += this.vel.y;
    	element.css({'top':this.loc.y,'left':this.loc.x});
    }
}




/* main animation code */
function CvAnimationValidation(animation){
    var holder = animation;
    this.holder = () => {
        try{
            var errors = []
            if(!holder.objects){errors.push('Objects Holder not found!');}
            if(!holder.operator){errors.push('Operator not found!');}
        //    if(!holder.engine){errors.push('Engine not found!');}
            if(!holder.setting){errors.push('Setting not found!');}
            if(0 < errors.length){throw errors}
        }catch(error){
            console.error(error);
        }
    }
    this.objects = () => {
        try{
            var errors = []
            if(!holder.objects.main){errors.push('Pane not found!');}
            if(!holder.objects.ctxm){errors.push('context not found!');}
            if(!holder.objects.hide){errors.push('Dots not found!');}
            if(!holder.objects.ctxh){errors.push('Dots not found!');}
            if(0 < errors.length){throw errors}
        }catch(error){
            console.error(error);
        }
    }
    this.any = () => {
        this.holder();
        this.objects();
    }
}
function CvAnimationEngine(animation){
    var holder = animation;
    var canvas = null;
    var context = null;
    this.start = function(){
        context = holder.objects.ctxm;
        canvas = holder.objects.main;
        this.push();
        stopFlag = false;
        this.stopped = false;
        update();
    }
    this.pause = function(){
    	stopFlag = true;
    	this.stopped = true;
    }
    this.resume = function(){
    	stopFlag = false;
    	this.stopped = false;
    	update();
    }
    this.push = function(){
    	for(key in holder.objects.labels){
    		holder.objects.labels[key].push();
    	}
    }
    var stopFlag = true;
    this.stopped = true;
    function update() {
    	context.clearRect(0,0,canvas.width,canvas.height);
    	for(key in holder.objects.labels){
    		holder.objects.labels[key].update();
    	}
        if(!stopFlag){
            window.requestAnimationFrame(update);
        }
    }
}
function CvAnimationSetting(){
    this.rad = 2 * Math.PI;
    this.args = {
       'paneParent':'body'
       ,'paneId':'cv-'+(Math.random()*(99999-10000)+10000)
       ,'paneColor':'rgba(0,0,0,0)'
       ,'paneWidth':window.innerWidth
       ,'paneHeight':window.innerHeight
       ,'paneBorder':0
       ,'velScale':0.5  // def 0.75
       ,'velMin':-0.5
       ,'velMax':0.5
       ,'lines':true
       ,'lineColors':{'green':[170,255,0]
       				 ,'pink':[250,0,150]
       				 ,'blue':[62,215,247]
       				 ,'purple':[112,48,160]
       				 ,'yellow':[250,250,10]
       				 ,'gray':[74,74,74]}
       ,'lineWidth':5
       ,'lineBlur':0
       ,'lineArrow':30
    }
    this.decorate = function(opts){
        for(var key in opts){
            if(this.args.hasOwnProperty(key)){
                this.args[key] = opts[key];
            }
        }
        return this;
    }
}
function CvAnimationOperator(animation){
    var holder = animation;
    holder.operator = this;
    this.decorate = function(opts){
        holder.setting.decorate(opts);
        return this;
    }
    this.create = function(){
    	/* main pane*/
    	holder.objects.main = holder.util.canvasCreate();
        canvas = holder.objects.main;
        canvas.id = holder.setting.args.paneId+'-main';
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.ctxm = canvas.getContext("2d");
	 	 
        /* hidden pane
    	holder.objects.hide = holder.util.canvasCreate();
        canvas = holder.objects.hide;
        canvas.id = holder.setting.args.paneId+'-hide';
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.ctxh = canvas.getContext("2d"); */

        var args = holder.setting.args;

        $("img.label").each(function(index){	// load label images
        	var id = $(this).attr('id');
			holder.objects.labels[id] = new CvLabelHolder(holder,id)
		});

        return this;
    }
    this.validate = function(){
        return this;
    }
    this.start = function(){
    	holder.engine.pause();
        holder.engine.start();
        return this;
    }
    this.pause = function(){
        holder.engine.pause();
        return this;
    }
    this.resume = function(){
        holder.engine.resume();
        return this;
    }
    this.toggle = function(){
    	var stopped = holder.engine.stopped;
    	if(stopped){holder.engine.resume();}
    	else{holder.engine.pause();}
        return stopped;
    }
}
function CvAnimationListener(animation){
    var holder = animation;
    var events = {
        'cv-decorate':(data) => {holder.operator.decorate(opts);}
       ,'cv-create':(data) => {holder.operator.create();}
    }
    for (var i=0; i<events.length; i++) {
        $('body').on(events[i],function(evt,data){
            events[i](data);
        });
    }
}
function CvAnimationObjects(){
	this.main = null;
	this.ctxm = null;
	//this.hide = null;
	//this.ctxh = null;
	this.labels = {};
}
function CvAnimationHolder(){
    var listener = new CvAnimationListener(this);
    this.objects = new CvAnimationObjects();
    this.operator = new CvAnimationOperator(this);
	this.engine = new CvAnimationEngine(this);
    this.setting = new CvAnimationSetting();
    this.validate = new CvAnimationValidation(this);
    this.util = new HtmlCancasTool(this);
} 



