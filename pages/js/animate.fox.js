function FoxConnector(animation,x,y){
    var holder = animation;
    this.loc = {
        'x': x || Math.random() * holder.objects.pane.width,
        'y': y || Math.random() * holder.objects.pane.height
    };
    this.push = function(){
        context = holder.objects.ctxt;
        dotColor = holder.setting.args.dotColor;
        dotOffset = holder.setting.args.dotOffset;
        dotRadius = holder.setting.args.dotRadius;
    }
    var dotOffset = 0;
    var context = null;
    var dotColor = null;
    var dotRadius = 0;
    this.update = function() {
        context.beginPath();
        context.globalAlpha = Math.random()*0.5;
        context.arc((dotOffset+this.loc.x) | 0, (dotOffset+this.loc.y) | 0, dotRadius, 0, 2*Math.PI, false);
        context.fillStyle = dotColor;
        context.fill();
    }
}
function BallMovement(animation,dot,x,y){
    var holder = animation;
    this.connector = dot;
    var root = JSON.parse(JSON.stringify(dot.loc));
    this.root = this.connector.loc;
    this.vel = {
        'x': x || (Math.round(Math.random())*2-1)*(Math.random()*(holder.setting.args.dotVelMax-holder.setting.args.dotVelMin)+holder.setting.args.dotVelMin)/holder.setting.args.dotVelScale,
        'y': y || (Math.round(Math.random())*2-1)*(Math.random()*(holder.setting.args.dotVelMax-holder.setting.args.dotVelMin)+holder.setting.args.dotVelMin)/holder.setting.args.dotVelScale
    };
    this.push = function(){
        drunken = holder.setting.args.drunken;
        drinker = holder.setting.args.drinker;
        canvas = holder.objects.pane;
        paneBorder = holder.setting.args.paneBorder;
        dotVelScale = holder.setting.args.dotVelScale;
    };
    var drunken = true;
    var drinker = 1;
    var canvas = null;
    var paneBorder = 0;
    var dotVelScale = 2;
    this.update = function() {
        var d = Math.hypot(root.x - this.connector.loc.x,root.y - this.connector.loc.y)
        if(d > 10) {
            this.vel.x = -this.vel.x;
            this.vel.y = -this.vel.y;
        }
        this.connector.loc.x += (this.vel.x/dotVelScale);
        this.connector.loc.y += (this.vel.y/dotVelScale);
    };
}
function FoxCon(animation,dot,cons){
    var holder = animation;
    this.connector = dot;
    this.connections = cons;
    this.push = function(){
        context = holder.objects.ctxt;
        dots = [];
        var args = holder.setting.args;
        for(var j=0; j<this.connections.length; j++) {
            dots.push(holder.objects.dots[parseInt(this.connections[j])]);
        }
        lineColor = args.lineColor;
        lineWidth = args.lineWidth;
        dotOffset = args.dotOffset;
        dMax = Math.hypot(args.paneWidth,args.paneHeight);
    };
    var context = null;
    var dots = [];
    var lineColor = null;
    var lineWidth = 0
    var dotOffset = 0;
    var dMax = 1;
    this.update = function() {
        context.beginPath();
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidth;
        for(var j=0; j<dots.length; j++) {
            var dot = dots[j];
            var d = Math.hypot(this.connector.loc.x-dot.loc.x, this.connector.loc.y-dot.loc.y);
        //    context.globalAlpha = Math.random()*0.5;  // blink
            context.globalAlpha = 1 - d / dMax * 3.25;
            context.moveTo((this.connector.loc.x) | 0, (this.connector.loc.y) | 0);
            context.lineTo((dot.loc.x) | 0, (dot.loc.y) | 0);
        }
        context.stroke();
    }
}
function FoxScout(animation,dot){
    var holder = animation;
    this.connector = dot
    this.push = function(){
        context = holder.objects.ctxt;
        dots = holder.objects.link;
        dotOffset = holder.setting.args.dotOffset;
        lineColor = holder.setting.args.lineColor;
        lineWidth = holder.setting.args.lineWidth;
    };
    var context = null;
    var dots = [];
    var dotOffset = 0;
    var lineColor = 0;
    var lineWidth = 0;
    this.update = function() {
        context.beginPath();
        for(var j=0; j<dots.length; j++){
            var b = dots[j];
            var d = Math.hypot(this.connector.loc.x-b.loc.x, this.connector.loc.y-b.loc.y);
            if(d<75){
            //    context.strokeStyle = 'red';
                context.globalAlpha = 1 - (d > 75 ? .8 : d / 150);
                context.lineWidth = lineWidth;
                context.moveTo((dotOffset+this.connector.loc.x) | 0, (dotOffset+this.connector.loc.y) | 0);
                context.lineTo((dotOffset+b.loc.x) | 0, (dotOffset+b.loc.y) | 0);
            }
        }
        context.stroke();
    }
}



function FoxNetValidation(animation){
    var holder = animation;
    this.holder = () => {
        try{
            var errors = []
            if(!holder.operator){errors.push('Operator not found!');}
            if(!holder.objects){errors.push('Objects Holder not found!');}
            if(!holder.engine){errors.push('Engine not found!');}
            if(!holder.setting){errors.push('Setting not found!');}
            if(0 < errors.length){throw errors}
        }catch(error){
            console.error(error);
        }
    }
    this.objects = () => {
        try{
            var errors = []
            if(!holder.objects.pane){errors.push('Pane not found!');}
            if(!holder.objects.ctxt){errors.push('context not found!');}
            if(!holder.objects.dots){errors.push('Dots not found!');}
            if(!holder.objects.cons){errors.push('Dots not found!');}
            if(!holder.objects.move){errors.push('Move not found!');}
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
function FoxNetEngine(animation){
    var holder = animation;
    var canvas = null;
    var context = null;
    var context = null;
    var dots = [];
    var scts = [];
    var cons = [];
    var move = null;
    var size = 0;

    var paneFrames = 25;
    var paneColor = null;
    var lineColor = null;
    var lineWidth = 0;
    var dotOffset = 0;
    var showDots = false;
    var showLines = false;
    var showMove = false;
    var showLinks = false;
    var playDrunken = false;
    var playCounter = 0;
    var playModul = 250;
    this.start = function(){
        context = holder.objects.ctxt;
        canvas = holder.objects.pane;
        move = holder.objects.move;
        size = move.length;
        dots = holder.objects.dots;
        cons = holder.objects.cons;
        scts = holder.objects.scouts;
        var tmpArg = holder.setting.args;
        paneFrames = tmpArg.paneFrames;
        paneColor = tmpArg.paneColor;
        lineColor = tmpArg.lineColor;
        lineWidth = tmpArg.lineWidth;        
        dotOffset = tmpArg.dotOffset;

        if(tmpArg.effects.indexOf('dots') > -1){showDots = true;}
        if(tmpArg.effects.indexOf('lines') > -1){showLines = true;}
        if(tmpArg.effects.indexOf('moves') > -1){showMove = true;}
        if(tmpArg.effects.indexOf('drunken') > -1){playDrunken = true;}
        if(tmpArg.effects.indexOf('links') > -1){showLinks = true;}

        for(var i=0; i<dots.length; i++){
            dots[i].push();
            cons[i].push();
            scts[i].push();
        }
        for(var i=0; i<move.length; i++){move[i].push();}
        update();
    }

    var paused = false;
    var stopped = false;

    var lastTime = Date.now();
    function update() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if(showMove){
            var d = Date.now() - lastTime;
            for (var frame=0; frame*100/paneFrames<d; frame++) {
                for (var i=0; i<size; i++) {
                    if(playDrunken){
                        if(playCounter === playModul){
                            move[i].connector = dots[Math.floor(Math.random()*(dots.length-1))];
                            playCounter = 0;
                        }
                        playCounter++;
                    }
                    move[i].update();
                }
            }
        }
        lastTime = Date.now();
        context.globalAlpha=1;
        context.fillStyle = paneColor;
        context.fillRect(0,0,canvas.width, canvas.height);
        for(var i=0; i<dots.length; i++){
            if(showDots){dots[i].update();}
            if(showLines){cons[i].update();}
            if(showLinks){scts[i].update();}
        }
        if(!stopped){
            requestAnimationFrame(update);
        }
    }
}
function FoxNetSetting(){
    this.rad = 2 * Math.PI;
    this.args = {
       'lineColor':'rgba(0,0,0,1)'
       ,'lineWidth':'2px'
       ,'paneParent':'body'
       ,'paneId':'animation-'+(Math.random()*(99999-10000)+10000)
       ,'paneColor':'rgba(0,0,0,0)'
       ,'paneFrames':5
       ,'paneUi':[]      // click, move 665 1140
       ,'scaleWidth':665
       ,'scaleHeight':1140
       ,'scaleFactor':1
       ,'paneWidth':window.innerWidth
       ,'paneHeight':window.innerHeight
       ,'paneBorder':150
       ,'dots':true
       ,'dotOffset':0            // def 0
       ,'dotRadius':'2px'        // def 3
       ,'dotColor':'rgba(255,0,0,1)'
       ,'dotVelScale':1
       ,'dotVelMin':-0.2
       ,'dotVelMax':0.2
       ,'dotLeft':10
       ,'dotTop':10 // canvas.height-canvas.height/scaleFactor
       ,'dotLogs':{
            '0':{'pos':[85,15],'con':['1','5','6']}     // L - 85,15 left ear top
            ,'1':{'pos':[295,160],'con':['0','2','7']}   // J - 295,160
            ,'2':{'pos':[365,160],'con':['1','3']}   // P - 365,160
            ,'3':{'pos':[435,160],'con':['2','4','8']}   // J - 435,160
            ,'4':{'pos':[645,10],'con':['3','9','10']}    // L - 645,10 right ear top
            ,'5':{'pos':[115,245],'con':['0','15']}   // N - 115,245
            ,'6':{'pos':[180,200],'con':['0','15']}   // M - 180,200
            ,'7':{'pos':[250,210],'con':['1','12','11']}   //   
            ,'8':{'pos':[475,205],'con':['3','13','14']}   //   
            ,'9':{'pos':[545,195],'con':['4','24']}  //   
            ,'10':{'pos':[605,240],'con':['4','24']}  //   
            ,'11':{'pos':[155,305],'con':['7','12','15']}  //   
            ,'12':{'pos':[310,360],'con':['7','11']}  //   
            ,'13':{'pos':[415,355],'con':['8','14']}  //   
            ,'14':{'pos':[570,305],'con':['8','13','24']}  //   
            ,'15':{'pos':[70,390],'con':['16','5','6','11']}   // F - 70,39
            ,'16':{'pos':[170,425],'con':['15','17','25']}  // E - 170,425
            ,'17':{'pos':[210,440],'con':['16','18']}  //   
            ,'18':{'pos':[315,550],'con':['17','19','20']}  //   
            ,'19':{'pos':[365,505],'con':['18','20','2','20']}  //   
            ,'20':{'pos':[365,605],'con':['19','21']}  //   
            ,'21':{'pos':[420,550],'con':['20','19','22']}  //   
            ,'22':{'pos':[505,445],'con':['21','23']}  //   
            ,'23':{'pos':[530,435],'con':['22','24','26']}  //   
            ,'24':{'pos':[655,390],'con':['23','10','9','14']}  //   
            ,'25':{'pos':[10,605],'con':['16','26','30']}   // Q - 10,605
            ,'26':{'pos':[370,850],'con':['25','17','27','23']}  // Z - 370,850
            ,'27':{'pos':[435,890],'con':['26','32','30']}  // Y - 435,890 
            ,'28':{'pos':[10,865],'con':['25','29']}   // T - 10,865
            ,'29':{'pos':[110,1070],'con':['28','30']} // U - 110,1070
            ,'30':{'pos':[210,1095],'con':['29','25','27','31']} // V - 210,1095
            ,'31':{'pos':[340,1130],'con':['30','32']} // W - 340,1130
            ,'32':{'pos':[500,1045],'con':['27','31']} // X - 500,1045
        }
       ,'dotMoves':0.1
       ,'drunken':true
       ,'drinker':0.1
       ,'effects':['dots','lines','drunken','links']    // glow,dots,lines,moves
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
function FoxNetAnimation(animation){
    var holder = animation;
    holder.operator = this;
    this.decorate = function(opts){
        holder.setting.decorate(opts);
        return this;
    }
    this.create = () => {
        var canvas = canvasCreate();
        var args = holder.setting.args;
        canvas.id = args.paneId
        if(window.innerWidth <= window.innerHeight){
            canvas.width = args.paneWidth;
            canvas.height = args.paneWidth*args.scaleHeight/args.scaleWidth;
        } else { /* landscape */
            canvas.width = args.paneHeight/args.scaleHeight*args.scaleWidth;
            canvas.height = args.paneHeight;
        }
        var ui = args.paneUi;
        if(ui.indexOf('click') > -1){canvas.addEventListener('click',function(e){clickMouse(e);});}
        if(ui.indexOf('move') > -1){canvas.addEventListener('mousemove',function(e){moveMouse(e);});}
        holder.objects.pane = canvas;
        holder.objects.ctxt = canvas.getContext("2d");

        // squares = A_screen / A_square = A_screen / (a_square,exponent)
        var dots = holder.objects.dots;
        var cons = holder.objects.cons;
        var scouts = holder.objects.scouts;
        var logs = args.dotLogs;
        for(var key in logs){
            logs[key].pos[0] = logs[key].pos[0] * canvas.width / args.scaleWidth / args.scaleFactor + args.dotLeft;
            logs[key].pos[1] = logs[key].pos[1] * canvas.height / args.scaleHeight / args.scaleFactor + args.dotTop;
            var tmp = new FoxConnector(holder,logs[key].pos[0],logs[key].pos[1]);
            dots.push(tmp);
            cons.push(new FoxCon(holder,tmp,logs[key].con));
            scouts.push(new FoxScout(holder,tmp));
        }
        if(args.effects.indexOf('moves') > -1){
            var move = holder.objects.move;
            var mover = Math.floor(dots.length * args.dotMoves);
            for(var i=0; i<mover; i++){
                var j = Math.floor(Math.random()*(dots.length-1));
                move.push(new BallMovement(holder,dots[j]));
            }
        }

        canvas.width = args.paneWidth;
        canvas.height = args.paneHeight;

        console.log('Animate Dots Created\n',holder.objects.dots.length,'connectors created.\n'
            ,holder.objects.cons.length,'connections created.\n'
            ,holder.objects.link.length,'linkable externals injected.\n'
            ,holder.objects.scouts.length,'link scouts created.\n'
            ,holder.objects.move.length,'movements created.\n'
            ,args.drinker,'percent drunken.\n'
            ,args.effects.length,'effects involved.\n'
            ,args.paneUi.length,'active ui interfaces.\n');

        
        return this;
    }
    this.validate = () => {
        return this;
    }
    this.interlink = (connectors) => {
        holder.objects.link = connectors;
        return this;
    }
    this.start = (mode='any') => {
        holder.engine.start();
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
function FoxNetListener(animation){
    var holder = animation;
    var events = {
        'dot-net-decorate':(data) => {holder.operator.decorate(opts);}
       ,'dot-net-create':(data) => {holder.operator.create();}
       ,'dot-net-refresh':(data) => {holder.operator.refresh();}
       ,'dot-net-start':(data) => {holder.operator.start();}
       ,'dot-net-lock':(data) => {holder.operator.lock();}
       ,'dot-net-stop':(data) => {holder.operator.stop();}
    }
    for (var i=0; i<events.length; i++) {
        $('body').on(events[i],function(evt,data){
            events[i](data);
        });
    }
}
function FoxNetObjects(){
    this.pane = null;
    this.ctxt = null;
    this.dots = [];
    this.cons = [];
    this.move = [];
    this.link = [];
    this.scouts = [];
}
function FoxNetHolder(){
    var listener = new FoxNetListener(this);
    this.operator = new FoxNetAnimation(this);
    this.objects = new FoxNetObjects();
    this.engine = new FoxNetEngine(this);
    this.setting = new FoxNetSetting();
    this.validate = new FoxNetValidation(this); 
}  