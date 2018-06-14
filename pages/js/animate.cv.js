

/* about.me */
function CvLanguageMap(){
}
function CvLanguageLabel(){
}
/* edu */
function CvSkillRing(animation,sk,clr,x,y){
	var holder = animation;
	var skill = sk
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+","+clr[3]+")";
    this.loc = {
        'x': x || Math.random() * holder.objects.pane.width,
        'y': y || Math.random() * holder.objects.pane.height
    };
    this.push = function(){
    	context = holder.objects.ctxt;
    	image = document.getElementById(sk);
        if(null == image){
        	return this;}
        width = image.width;
        height = image.height;
        radius = width/2;
        console.log(width)
        return this;
    }
    var image = null;
    var context = null;
    var width = null;
    var height = null;
    var radius = 30;
    var blur = 25;
    var lineWidth = 5;
    this.update = function() {
        if(null == image){return this;}
       	var ctx = holder.objects.ctxt;
		ctx.shadowBlur = blur;
		ctx.shadowColor = color;
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.arc(this.loc.x,this.loc.y,radius,Math.PI/radius,Math.PI/2-Math.PI/radius);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.loc.x,this.loc.y,radius,Math.PI/2+Math.PI/radius,Math.PI-Math.PI/radius);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.loc.x,this.loc.y,radius,Math.PI+Math.PI/radius,3/2*Math.PI-Math.PI/radius);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.loc.x,this.loc.y,radius,3/2*Math.PI+Math.PI/radius,2*Math.PI-Math.PI/radius,);
		ctx.stroke();
		radius = radius+10;
		ctx.beginPath();
		ctx.arc(this.loc.x,this.loc.y,radius,Math.PI/radius,Math.PI/2-Math.PI/radius);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.loc.x,this.loc.y,radius,Math.PI/2+Math.PI/radius,Math.PI-Math.PI/radius);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.loc.x,this.loc.y,radius,Math.PI+Math.PI/radius,3/2*Math.PI-Math.PI/radius);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.loc.x,this.loc.y,radius,3/2*Math.PI+Math.PI/radius,2*Math.PI-Math.PI/radius,);
		ctx.stroke();
		ctx.beginPath();
		ctx.drawImage(image,this.loc.x-width/2,this.loc.y-height/2,width,height)
        return this;
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
       ,'lines':true
       ,'lineColor':'rgba(0,0,0,1)'
       ,'lineWidth':'4px'
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
    	holder.objects.pane = canvasCreate();
        canvas = holder.objects.pane;
        canvas.id = holder.setting.args.paneId;
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.ctxt = canvas.getContext("2d");
        console.info('cv animation created');
        return this;
    }
    this.show = function(data){
		var ctx = holder.objects.ctxt;
		ctx.clearRect(0,0,holder.objects.pane.width,holder.objects.pane.height);
		var grp = 1;
		var off = 1;
		var delta = 100;
		for (var i=0; i<data.cv.length; i++) {
			console.log(data.cv[i])
			var tmp = data.cv[i];
			if(tmp[3] != grp){off = 1;}
			grp = tmp[3];
			new CvSkillRing(holder,tmp[0],[tmp[1][0],tmp[1][1],tmp[1][2],0.7],0+delta*off,0+delta*grp).push().update();
			off = off+1;
		};

		//CvSkillRing(ctx,200,175,50,[250,0,150,0.7],'skill-t') // pink
		//CvSkillRing(ctx,330,175,50,[170,255,0,0.7],'skill-t') // green
		//CvSkillRing(ctx,400,275,50,[62,215,247,0.7],'skill-t') // lblue
		//CvSkillRing(ctx,550,75,50,[250,250,0,0.7]) // yellow
		//CvSkillRing(ctx,700,75,50,[112,48,160,0.7]) // purple


    	console.info('cv animation visible');
        return this;
    }



    function canvasParse(id){
        return document.getElementById(id);
    }
    function canvasCreate(){
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
	var lang_pane = null;
	var lang_ctxt = null;

	/* developer purpose */
	var pane = null;
	var ctxt = null;
}
function CvAnimationHolder(){
    var listener = new CvAnimationListener(this);
    this.objects = new CvAnimationObjects();
    this.operator = new CvAnimationOperator(this);
    this.setting = new CvAnimationSetting();
} 



