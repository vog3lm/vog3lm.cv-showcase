


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
/*	engine 	*/
function CvAnimationSetting(){
    this.rad = 2 * Math.PI;
    this.args = {
       'paneParent':'body'
       ,'paneId':'cv-'+(Math.random()*(99999-10000)+10000)
       ,'paneColor':'rgba(0,0,0,0)'
       ,'paneWidth':window.innerWidth // *6
       ,'paneHeight':window.innerHeight
       ,'paneBorder':0
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
    	/* main pane */
    	holder.objects.main = holder.util.canvasCreate();
        canvas = holder.objects.main;
        canvas.id = holder.setting.args.paneId+'-main';
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.ctxm = canvas.getContext("2d");

        /* hidden pane */
    	holder.objects.hide = holder.util.canvasCreate();
        canvas = holder.objects.hide;
        canvas.id = holder.setting.args.paneId+'-hide';
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.ctxh = canvas.getContext("2d");
        console.info('cv animation created');

        var args = holder.setting.args;

        return this;
    }
    this.show = function(data){
		var ctx = holder.objects.ctxh;
		ctx.clearRect(0,0,holder.objects.hide.width,holder.objects.hide.height);

		/* load skill rings
		var grp = 1;
		var off = 1;
		var delta = 100;
		for (var i=0; i<data.cv.length; i++) {
			console.log(data.cv[i])  // TODO delete
			var tmp = data.cv[i];
			if(tmp[3] != grp){off = 1;}
			grp = tmp[3];
			var ring = new CvSkillRing(holder,tmp[0],[tmp[1][0],tmp[1][1],tmp[1][2],0.7],0+delta*off,0+delta*grp)
			ring.push()
			ring.update();
			off = off+1;
		};
		*/

    	console.info('cv animation visible');
        return this;
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
	var main = null;
	var ctxm = null;
	var hide = null;
	var ctxh = null;
}
function CvAnimationHolder(){
    var listener = new CvAnimationListener(this);
    this.objects = new CvAnimationObjects();
    this.operator = new CvAnimationOperator(this);
	// this.engine = new CvAnimationEngine(this);
    this.setting = new CvAnimationSetting();
    this.validate = new CvAnimationValidation(this);
    this.util = new HtmlCancasTool(this);
} 



