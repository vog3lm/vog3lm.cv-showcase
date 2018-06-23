
/* move to backend... */
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
    this.labelLocation = (idx) => {
    	var border = 150;
    	var tmp = {'x':0,'y':0};
    	var left = idx*window.innerWidth+border;
    	var right = (idx+1)*window.innerWidth-125-200;
    	var top = 100;
    	var bottom = window.innerHeight-300-border;
		do{
		    tmp.x = Math.random()*window.innerWidth;
		    tmp.y = Math.random()*window.innerHeight;
		} while((left >= tmp.x || (right) <= tmp.x) && (top >= tmp.y || bottom >= tmp.y));
        return tmp;
    }
}

/* main stuff */
function CvMilestoneLabelMe(animation,clr){
	var holder = animation;
    this.loc = {
        'x': window.innerWidth*0.01,
        'y': window.innerHeight*0.5
    };
	this.push = function(){
		context = holder.objects.ctxm;
		return this;
	}
	var context = null;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.update = function(){
		var x = this.loc.x;
		var y = this.loc.y;
		var w = 3*16*2.5;
		context.beginPath();
		context.fillStyle=color;
		context.font = "5ex mp-light";
		context.fillText("19041985",x,y,w); // unix timestamp 482716800
		context.font = "7ex mp-bold";
		context.fillText("HELLO",x,y+2*17,w); // .fillText(string,x,y,width)
		context.fillText("WORLD",x,y+4*17,w);
		context.font = "5ex mp-light";
		context.fillText('47° 49‘ 35.050"',x,y+6*17,w);
		context.fillText('09° 57‘ 27.359"',x,y+8*17,w);
		//context.strokeText("Hello World",10,50); // .strokeText(string,x,y,width)
		context.closePath();
		return this;
	}
}
function CvMilestoneLabelOne(animation,clr,text,idx){
	var holder = animation;
	var lines = text;
    this.loc = holder.util.labelLocation(idx);
	this.push = function(){
		context = holder.objects.ctxm;
		return this;
	}
	var context = null;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.update = function(){
		var x = this.loc.x;
		var y = this.loc.y;
		var s = 3;
		var d = 16*s // 1rem = 16px height
		var w = d*2.25;
		context.beginPath();
		context.fillStyle=color;
		context.font = s+"rem mp-light";
		context.fillText(lines[0],x,y+0*d,w);
		context.fillText(lines[1],x,y+1*d*2/3,w);
		context.font = s*3/2+"rem mp-bold";
		context.fillText(lines[2],x,y+2*d*3/4,w); // .fillText(string,x,y,width)
		//context.strokeText("Hello World",10,50); // .strokeText(string,x,y,width)
		context.closePath();
		return this;
	}
}
function CvMilestoneLabelTwo(animation,clr,text,idx){
	var holder = animation;
	var lines = text;
    this.loc = holder.util.labelLocation(idx);
	this.push = function(){
		context = holder.objects.ctxm;
		return this;
	}
	var context = null;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.update = function(){
		var x = this.loc.x;
		var y = this.loc.y;
		var s = 3;
		var d = 16*s // 1rem = 16px height
		var w = d*2.25
		context.beginPath();
		context.fillStyle=color;
		context.font = s+"rem mp-light";
		context.fillText(lines[0],x,y+0*d,w);
		s=s*3/2;
		context.font = s+"rem mp-bold";
		context.fillText(lines[1],x,y+1*d*0.85,w);
		context.font = s+"rem mp-bold";
		context.fillText(lines[2],x,y+2*d*0.8,w); // .fillText(string,x,y,width)
		//context.strokeText("Hello World",10,50); // .strokeText(string,x,y,width)
		context.closePath();
		return this;
	}
}
function CvMilestoneLabelTre(animation,clr,text,idx){
	var holder = animation;
	var lines = text;
	this.loc = holder.util.labelLocation(idx);
	this.push = function(){
		context = holder.objects.ctxm;
		return this;
	}
	var context = null;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.update = function(){
		var x = this.loc.x;
		var y = this.loc.y;
		var s = 40;
		context.beginPath();
		context.fillStyle=color;
		context.font = s+"px mp-light";
		context.fillText(lines[0],x,y+0*s,125);
		context.font = s*3/2+"px mp-bold";
		context.fillText(lines[1],x,y+1*s+5,125);
		context.font = s+"px mp-light";
		context.fillText(lines[2],x,y+2*s-3,125);
		context.font = s*3/2+"px mp-bold";
		context.fillText(lines[3],x,y+3*s,125); // .fillText(string,x,y,width)
		context.closePath();
		return this;
	}
}
function CvMilestoneLabelIhk(animation,clr,text,idx){
	var holder = animation;
	var lines = text;
	this.loc = holder.util.labelLocation(idx);
	this.push = function(){
		context = holder.objects.ctxm;
		return this;
	}
	var context = null;
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
	this.update = function(){
		var x = this.loc.x;
		var y = this.loc.y;
		var s = 40;
		context.beginPath();
		context.fillStyle=color;
		context.font = s+"px mp-light";
		context.fillText(lines[0],x,y+0*s,150);
		context.fillText(lines[1],x,y+1*s-7,150);
		s = s*3/2;
		context.font = s+"px mp-bold";
		context.fillText(lines[2],x,y+2*s*2/3,150);
		context.font = s*5/4+"px mp-bold";
		context.fillText(lines[3],x,y+2*s+14,150); // .fillText(string,x,y,width)
		context.closePath();
		return this;
	}
}



function CvStoryLineStart(animation,idx,clr){
	var holder = animation;
	var index = idx;
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
	var color = "rgba("+clr[0]+","+clr[1]+","+clr[2]+",255)";
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
function CvStoryLineArrowBendUp(animation,idx,clr,lyr,dir){
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
function CvStoryLine(animation,idx,clr){
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
function CvStoryLineClose(animation,idx,clr){
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
// language mal + labels
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
	//        console.log(width) // TODO delete
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
    	holder.objects.main = holder.util.canvasScroll();
        canvas = holder.objects.main;
        canvas.id = holder.setting.args.paneId+'-main';
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.ctxm = canvas.getContext("2d");

        var args = holder.setting.args;
        /* cv milestone labels */
    //	new CvMilestoneLabelMe(holder,args.lineColors.gray).push().update();
    //	new CvMilestoneLabelOne(holder,args.lineColors.green,['GRUND','SCHULE','1995'],0).push().update();
    //	new CvMilestoneLabelTwo(holder,args.lineColors.blue,['MITTLERE','REIFE','2001'],0).push().update();

    //	new CvMilestoneLabelOne(holder,args.lineColors.yellow,['BERUFS','SCHULE','2004'],0).push().update();
    //	new CvMilestoneLabelTre(holder,args.lineColors.purple,['SPARKASSE','BANK','KAUFMANN','2004'],0).push().update();
    //	new CvMilestoneLabelIhk(holder,args.lineColors.pink,['IHK BODENSEE','OBERSCHWABEN','KAUFMANN','2004'],0).push().update();

    //	new CvMilestoneLabelTwo(holder,args.lineColors.green,['RHK BW','ZIVILDIENST','2005'],1).push().update();
    //	new CvMilestoneLabelTwo(holder,args.lineColors.yellow,['RHK BW','AMBULANZ','2006'],1).push().update();
    //	new CvMilestoneLabelTwo(holder,args.lineColors.pink,['RHK BW','SERVICE','2013'],1).push().update();

    //	new CvMilestoneLabelTwo(holder,args.lineColors.blue,['WG WANGEN','ABITUR','2009'],1).push().update(); // TODO 4 lines

    //	new CvMilestoneLabelIhk(holder,args.lineColors.blue,['UNIVERSITAT','KONSTANZ','MATHE','2010'],2).push().update();
    //	new CvMilestoneLabelIhk(holder,args.lineColors.green,['HOCHSCHULE','WEINGARTEN','HIWI','2011'],2).push().update();
    //	new CvMilestoneLabelIhk(holder,args.lineColors.yellow,['HOCHSCHULE','WEINGARTEN','TUTOR','2013'],2).push().update();
    //	new CvMilestoneLabelTre(holder,args.lineColors.pink,['HOCHSCHULE','BACHELOR','INFORMATIK','2014'],2).push().update(); // TODO
    //	new CvMilestoneLabelOne(holder,args.lineColors.purple,['ZF FN AG','TRAINEE','2014'],2).push().update(); // TODO
    	
    //	new CvMilestoneLabelIhk(holder,args.lineColors.pink,['HOCHSCHULE','WEINGARTEN','INFORMATIK','2018'],3).push().update();
    //	new CvMilestoneLabelIhk(holder,args.lineColors.green,['HOCHSCHULE','WEINGARTEN','WIRTSCHAFT','2018'],3).push().update();
    //	new CvMilestoneLabelIhk(holder,args.lineColors.blue,['HOCHSCHULE','WEINGARTEN','PAEDAGOGIK','2018'],3).push().update();

    //	new CvMilestoneLabelTwo(holder,args.lineColors.purple,['SCHULERHILFE','LEHRER','2018'],3).push().update(); // TODO

    	console.info('cv animation created');
    	
        /* cv story line arrows */
    //	var about = new CvStoryLineStart(holder,0,args.lineColors[0]).push().update();
    //	var test = new CvStoryLineArrowBendUp(holder,1,   args.lineColors[1],0).push().update();
    //	var test = new CvStoryLineArrowBendUp(holder,1.04,args.lineColors[3],1).push().update();
    //	var exp_a = new CvStoryLine(holder,1,args.lineColors[1]).push().update();
    //	var edu_b = new CvStoryLine(holder,2,args.lineColors[2]).push().update();
    //	var edu_c = new CvStoryLine(holder,3,args.lineColors[3]).push().update();
    //	var touch = new CvStoryLineClose(holder,4,args.lineColors[4]).push().update();

        /* hidden pane */
    	holder.objects.hide = holder.util.canvasCreate();
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



