

/* main stuff */
function CvStoryLine(animation,idx,cnt,clr){
	var holder = animation;
	var index = idx;
	var count = cnt;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.loc = {
		'x': 0,
		'y': 0
	};
	this.push = function(){
		context = holder.objects.ctxm;
		lineWidth = holder.setting.lineWidth;
		lineLvl = holder.setting.lineLvl;
	}
	var context = null;
	var lineBlur = 0;
	var lineLength = 150;
	var lineWidth = 19;
	this.update = function(){
		context.lineWidth=lineWidth;
		context.strokeStyle=color;
		context.shadowBlur=lineBlur;
		context.shadowColor=color;
		context.beginPath();
		context.moveTo(this.loc.x+lineLength*index,this.loc.y);
		context.lineTo(this.loc.x+lineLength*index+lineLength,this.loc.y);
		context.stroke();
	}
}

function CvStoryTest(animation,idx,clr,lyr,dir){
	var holder = animation;
	var index = idx;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.loc = {
		'x': idx*window.innerWidth+window.innerWidth*1/10,
		'y': window.innerHeight*2/3
	};
	this.push = function(){
		context = holder.objects.ctxm;
		lineWidth = holder.setting.args.lineWidth;
		lineBlur = holder.setting.args.lineBlur;
		lineArrow = holder.setting.args.lineArrow;
		return this;
	}
	var context = null;
	var lineBlur = 0;
	var lineLength = window.innerWidth/3;
	var lineWidth = 0;
	var lineArrow = 0;
	var lineLayer = lyr;
	this.update = function(){
		context.lineWidth=lineWidth;
		context.strokeStyle=color;
		context.shadowBlur=lineBlur;
		context.shadowColor=color;
		context.fillStyle=color;
		context.beginPath(); // line
		context.moveTo(this.loc.x,this.loc.y);
		context.lineTo(this.loc.x+lineLength,this.loc.y);
		context.stroke();
		var radius = 50
		var angle = Math.PI/6
		context.beginPath(); // curve
		context.arc(this.loc.x+lineLength,this.loc.y-radius,radius,angle,Math.PI/2,false);
		context.stroke();

		var h = lineArrow;
		var g = lineArrow;
		var x = this.loc.x+lineLength+radius+lineWidth
		var y = this.loc.y+g/2-lineWidth/2-radius/2;

		var A = [x,y];
		var B = [x-g/2,y-h];
		var C = [x-g,y];
		var ABv = [A[0]-B[0],A[1]-B[1]];
		var ABn = [-ABv[1],ABv[0]];
		var ABm = [A[0]-0.5*ABv[0],A[1]-0.5*ABv[1]];
		var t = -(B[0]-ABm[0])/ABn[0];
		var M = [B[0],ABm[1]-t*ABn[1]];
		var rotation = -Math.PI/6;
		A = rotate(A,M,rotation);
		B = rotate(B,M,rotation);
		C = rotate(C,M,rotation);

		context.beginPath(); // triangle
		context.moveTo(A[0],A[1]);
		context.lineTo(B[0],B[1]);
		context.lineTo(C[0],C[1]);
		context.lineTo(A[0],A[1]);
		context.fill();

		context.closePath();
		return this;
	}
    function rotate(p,c,rad) {
        return [Math.cos(-rad)*(p[0]-c[0])-Math.sin(-rad)*(p[1]-c[1])+c[0],Math.sin(-rad)*(p[0]-c[0])+Math.cos(-rad)*(p[1]-c[1])+c[1]];
    }
}


function CvStoryStart(animation,idx,clr){
	var holder = animation;
	var index = idx;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.loc = {
		'x': window.innerWidth*1/3,
		'y': window.innerHeight*2/3
	};
	this.push = function(){
		context = holder.objects.ctxm;
		lineWidth = holder.setting.args.lineWidth;
		lineBlur = holder.setting.args.lineBlur;
		return this;
	}
	var context = null;
	var lineBlur = 0;
	var lineLength = window.innerWidth*(2/3+1/10);
	var lineWidth = 1;
	this.update = function(){
		context.lineWidth=lineWidth;
		context.strokeStyle=color;
		context.shadowBlur=lineBlur;
		context.shadowColor=color;
		context.beginPath();
		context.moveTo(this.loc.x,this.loc.y);
		context.lineTo(this.loc.x+lineLength,this.loc.y);
		context.stroke();
		return this;
	}
}
function CvStoryLines(animation,idx,clr){
	var holder = animation;
	var index = idx;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.loc = {
		'x': idx*window.innerWidth+window.innerWidth*1/10,
		'y': window.innerHeight*2/3
	};
	this.push = function(){
		context = holder.objects.ctxm;
		lineWidth = holder.setting.args.lineWidth;
		lineBlur = holder.setting.args.lineBlur;
		return this;
	}
	var context = null;
	var lineBlur = 0;
	var lineLength = window.innerWidth;
	var lineWidth = 0;
	this.update = function(){
		context.lineWidth=lineWidth;
		context.strokeStyle=color;
		context.shadowBlur=lineBlur;
		context.shadowColor=color;
		context.beginPath();
		context.moveTo(this.loc.x,this.loc.y);
		context.lineTo(this.loc.x+lineLength,this.loc.y);
		context.stroke();
		return this;
	}
}
function CvStoryClose(animation,idx,clr){
	var holder = animation;
	var index = idx;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.loc = {
		'x': idx*window.innerWidth+window.innerWidth*1/10,
		'y': window.innerHeight*2/3
	};
	this.push = function(){
		context = holder.objects.ctxm;
		lineWidth = holder.setting.args.lineWidth;
		lineBlur = holder.setting.args.lineBlur;
		return this;
	}
	var context = null;
	var lineBlur = 0;
	var lineLength = window.innerWidth*(1/3-1/10);
	var lineWidth = 1;
	this.update = function(){
		context.lineWidth=lineWidth;
		context.strokeStyle=color;
		context.shadowBlur=lineBlur;
		context.shadowColor=color;
		context.beginPath();
		context.moveTo(this.loc.x,this.loc.y);
		context.lineTo(this.loc.x+lineLength,this.loc.y);
		context.stroke();
		return this;
	}
}

/* hidden stuff */
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
    	context = holder.objects.ctxh;
    	image = document.getElementById(sk);
        if(null == image){
        	return this;}
        width = image.width;
        height = image.height;
        radius = width/2;
        console.log(width)
    }
    var image = null;
    var context = null;
    var width = null;
    var height = null;
    var radius = 30;
    var blur = 25;
    var lineWidth = 5;
    this.update = function(){
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
    }
}



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
       ,'paneWidth':window.innerWidth*6
       ,'paneHeight':window.innerHeight
       ,'paneBorder':0
       ,'lines':true
       ,'lineColors':[[170,255,0],[250,0,150],[62,215,247],[112,48,160],[250,250,10]]
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
    	holder.objects.main = canvasScroll();
        canvas = holder.objects.main;
        canvas.id = holder.setting.args.paneId+'-main';
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.ctxm = canvas.getContext("2d");
        console.info('cv animation created');

        var args = holder.setting.args;

        var about = new CvStoryStart(holder,0,args.lineColors[0]).push().update();
    	var test = new CvStoryTest(holder,1,   args.lineColors[1],0).push().update();
    	var test = new CvStoryTest(holder,1.04,args.lineColors[3],1).push().update();
    	
    //   var exp_a = new CvStoryLines(holder,1,args.lineColors[1]).push().update();
        var edu_b = new CvStoryLines(holder,2,args.lineColors[2]).push().update();
        var edu_c = new CvStoryLines(holder,3,args.lineColors[3]).push().update();
        var touch = new CvStoryClose(holder,4,args.lineColors[4]).push().update();

        /* draw story
        var arrow = new CvStoryLine(holder,0,6,args.lineColors[0]);
        arrow.push();
        arrow.update();
        arrow = new CvStoryLine(holder,1,6,colors[1]);
        arrow.push();
        arrow.update();
        arrow = new CvStoryLine(holder,2,6,colors[2]);
        arrow.push();
        arrow.update();
        arrow = new CvStoryLine(holder,3,6,colors[0]);
        arrow.push();
        arrow.update();
        arrow = new CvStoryLine(holder,4,6,colors[1]);
        arrow.push();
        arrow.update();
        arrow = new CvStoryLine(holder,5,6,colors[2]);
        arrow.push();
        arrow.update();
         */

        /* hidden pane */
    	holder.objects.hide = canvasCreate();
        canvas = holder.objects.hide;
        canvas.id = holder.setting.args.paneId+'-hide';
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.ctxh = canvas.getContext("2d");
        console.info('cv animation created');

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
			console.log(data.cv[i])
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
    function canvasParse(id){
        return document.getElementById(id);
    }
    function canvasScroll(){
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
} 



