function CvImage(){

}




function qr_code_image(ctx,x,y,iw,ih,w,h,img,clr){
	ctx.drawImage(img,0,0,iw,ih,x,y,w,h); // (img,sx,sy,swidth,sheight,x,y,width,height)
	data = ctx.getImageData(x,y,w,h);
	for (var i=0;i<data.data.length;i+=4){
		if(data.data[i+0]==27&&data.data[i+1]==182&&data.data[i+2]==81){ // if detection color	
			data.data[i+0]=clr[0];
			data.data[i+1]=clr[1];
			data.data[i+2]=clr[2];
		}
	}
	ctx.putImageData(data,x,y);
}

function inverted_image(ctx,x,y,iw,ih,w,h,img,clr){
	ctx.drawImage(img,0,0,iw,ih,x,y,w,h); // (img,sx,sy,swidth,sheight,x,y,width,height)
	data = ctx.getImageData(x,y,w,h);
	for (var i=0;i<data.data.length;i+=4){
		if(data.data[i+0]==27&&data.data[i+1]==182&&data.data[i+2]==81){ // if detection color
	//	if(0 < data.data[i+3]){ // if visible
			// data.data[i+0]=255-data.data[i]; // red
			// data.data[i+1]=255-data.data[i+1]; // green
			// data.data[i+2]=255-data.data[i+2]; // blue
			// data.data[i+3]=255; // alpha
		}
	}
	ctx.putImageData(data,x,y);
}





function CvSetting(){
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
function CvOperator(animation){
    var holder = animation;
    holder.operator = this;
    this.decorate = function(opts){
        holder.setting.decorate(opts);
        return this;
    }
    this.create = function(){
    	holder.objects.images = canvasCreate();
        var canvas = holder.objects.images;
        canvas.id = holder.setting.args.paneId+'images';
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.images_ctxt = canvas.getContext("2d");

    	holder.objects.pane = canvasCreate();
        canvas = holder.objects.pane;
        canvas.id = holder.setting.args.paneId;
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        holder.objects.ctxt = canvas.getContext("2d");

        console.log('Curriculum Vitae Created\n');

        return this;
    }
    this.show = function(index){
    	this.clear();

        var images_ctx = holder.objects.images_ctxt;
        var root_ctx = holder.objects.ctxt;

	    var iw = 2175;
	    var ih = 2175;
	    var w = 200;
	    var h = 200;
	    var x = 21-w/2;
	    var y = Math.floor(window.innerHeight*0.8) - h/2;
	    if(0 == index){qr_code_image(images_ctx,x+210*0,y,iw,ih,w,h,document.getElementById("img-circle-"+0),[250,0,150]);} // pink
		else if(1 == index){qr_code_image(images_ctx,x+210*1,y,iw,ih,w,h,document.getElementById("img-circle-"+1),[170,255,0]);} // green
		else if(2 == index){qr_code_image(images_ctx,x+210*2,y,iw,ih,w,h,document.getElementById("img-circle-"+2),[62,215,247]);} // light blue
		else if(3 == index){qr_code_image(images_ctx,x+210*3,y,iw,ih,w,h,document.getElementById("img-circle-"+3),[255,255,0]);} // yellow
		else if(4 == index){qr_code_image(images_ctx,x+210*4,y,iw,ih,w,h,document.getElementById("img-circle-"+4),[112,48,160]);} // purple
    }
    this.next = function(){
    	this.clear();

        var images_ctx = holder.objects.images_ctxt;
        var root_ctx = holder.objects.ctxt;

        var r = 125;
        var x = 21;
        var y = Math.floor(window.innerHeight*0.8);
        var sc = holder.setting.args.lineColor;
        var spot = 800;
        // ring
        root_ctx.beginPath();
	    root_ctx.arc(x,y,r,0,2*Math.PI);
	    root_ctx.strokeStyle=sc;
	    root_ctx.lineWidth=31;
	    root_ctx.stroke();
	    root_ctx.beginPath();
	    root_ctx.moveTo(x,y-r);
	    root_ctx.lineTo(x+spot,y-r);
	    root_ctx.stroke();

	    var h = 90;
	    var w = 90;
	    var x = x+spot;
	    var y = y-r-w/2;
	    var t = 25
	    /* dreieck */
		root_ctx.fillStyle = sc;
	    /* spitze rechts */
	    root_ctx.beginPath();
	    root_ctx.moveTo(x+t,y);
	    root_ctx.lineTo(x+t,y+w);
	    root_ctx.lineTo(x+t+h,y+w/2);
	    root_ctx.fill();
	    root_ctx.beginPath();
	    root_ctx.moveTo(x,y+w/2);
	    root_ctx.lineTo(x+t,y+w/2);
	    root_ctx.stroke();
	    /* spitze oben */
	    //ctx.beginPath();
	    //ctx.moveTo(x,y+h);
	    //ctx.lineTo(x+w,y+h);
	    //ctx.lineTo(x+w/2,y);
	    //ctx.fill();
	    //ctx.beginPath();
	    //ctx.moveTo(x+w/2,y+h);
	    //ctx.lineTo(x+w/2,y+h+t);
	    //ctx.stroke();

	    
	    
	    var iw = 2175;
	    var ih = 2175;
	    var w = 200;
	    var h = 200;
	    var x = 21-w/2;
	    var y = Math.floor(window.innerHeight*0.8) - h/2;

		qr_code_image(images_ctx,x+210*0,y,iw,ih,w,h,document.getElementById("img-circle-"+0),[250,0,150]); // pink
		qr_code_image(images_ctx,x+210*1,y,iw,ih,w,h,document.getElementById("img-circle-"+1),[170,255,0]); // green
		qr_code_image(images_ctx,x+210*2,y,iw,ih,w,h,document.getElementById("img-circle-"+2),[62,215,247]); // light blue
		qr_code_image(images_ctx,x+210*3,y,iw,ih,w,h,document.getElementById("img-circle-"+3),[255,255,0]); // yellow
		qr_code_image(images_ctx,x+210*4,y,iw,ih,w,h,document.getElementById("img-circle-"+4),[112,48,160]); // purple

    }
    this.clear = function(){
    	var objects = holder.objects;
    	objects.images_ctxt.clearRect(0,0,objects.images.width,objects.images.height);
    	objects.ctxt.clearRect(0,0,objects.pane.width,objects.pane.height);
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
function CvListener(animation){
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
function CvObjects(){
	this.images = null; 
	this.images_ctxt = null;
    this.pane = null; // root layer
    this.ctxt = null; // root layer context
}
function CvHolder(){
    var listener = new CvListener(this);
    this.objects = new CvObjects();
    this.operator = new CvOperator(this);
    this.setting = new CvSetting();
} 