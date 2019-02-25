function DotConnector(animation,x,y){
    var holder = animation;
    this.loc = {
        'x': x || Math.random() * holder.objects.pane.width,
        'y': y || Math.random() * holder.objects.pane.height
    };
    this.push = function(){
        context = holder.objects.ctxt;
        lineColor = holder.setting.args.lineColor;
        dotOffset = holder.setting.args.dotOffset;
        dotRadius = holder.setting.args.dotRadius;
    }
    var context = null;
    var lineColor = null;
    this.update = function() {
        context.beginPath();
        context.globalAlpha = .4;
        context.fillStyle = lineColor;
        // arc(x, y, r, sAngle, eAngle, counterclockwise)
        context.arc((dotOffset+this.loc.x) | 0, (dotOffset+this.loc.y) | 0, dotRadius, 0, 2*Math.PI, false);
        context.fill();
    }
}
function DotMovement(animation,dot,x,y){
    var holder = animation;
    this.connector = dot
    this.vel = {
        'x': x || (Math.round(Math.random())*2-1)*(Math.random()*(holder.setting.args.dotVelMax-holder.setting.args.dotVelMin)+holder.setting.args.dotVelMin)/holder.setting.args.dotVelScale,
        'y': y || (Math.round(Math.random())*2-1)*(Math.random()*(holder.setting.args.dotVelMax-holder.setting.args.dotVelMin)+holder.setting.args.dotVelMin)/holder.setting.args.dotVelScale
    };
    this.push = function(){
        drunken = holder.setting.args.drunken;
        drinker = holder.setting.args.drinker;
        canvas = holder.objects.pane;
        paneBorder = holder.setting.args.paneBorder;
    };
    var drunken = true;
    var drinker = 1;
    var canvas = null;
    var paneBorder = 0;
    this.update = function() {
        if(this.connector.loc.x >= canvas.width + paneBorder || this.connector.loc.x <= -paneBorder) {
            this.vel.x = -this.vel.x;
        }
        if(this.connector.loc.y >= canvas.height + paneBorder || this.connector.loc.y <= -paneBorder) {
            this.vel.y = -this.vel.y;
        }
        // change position
        this.connector.loc.x += this.vel.x*drunken;
        this.connector.loc.y += this.vel.y*drunken;
    };
}
function DotScout(animation,dot){
    var holder = animation;
    this.connector = dot
    this.push = function(){
        context = holder.objects.pane;
        dots = holder.objects.dots;
        paneBorder = holder.setting.args.paneBorder;
        lineColor = holder.setting.args.lineColor;
        dotDistance = holder.setting.args.dotDistance;
        dotOffset = holder.setting.args.dotOffset;
    };

    var context = null;
    var dots = [];
    var lineColor = null;
    var dotDistance = 0;
    var dotOffset = 0;

    this.update = function() {
        context.beginPath();
        for(var j = dots.length-1; j>i; j--) {
            var b = dots[j];
            var d = Math.hypot(connector.loc.x-b.loc.x, connector.loc.y-b.loc.y);
            if(d<dotDistance){
                context.strokeStyle = lineColor;
                context.globalAlpha = 1 - (d > dotDistance ? .8 : d / 150);
                context.lineWidth = lineWidth;
                context.moveTo((dotOffset+connector.loc.x) | 0, (dotOffset+connector.loc.y) | 0);
                context.lineTo((dotOffset+b.loc.x) | 0, (dotOffset+b.loc.y) | 0);
            }
        }
        context.stroke();
    }
}



function DotNetValidation(animation){
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
function DotNetEngine(animation){
    var holder = animation;
    var canvas = null;
    var context = null;
    var dots = null;
    var move = null;
    var size = 0;

    var paneFrames = 25;
    var paneColor = null;
    var lineColor = null;
    var lineWidth = '2px';
    var dotDistance = 200;
    var dotOffset = 0;
    var showDots = false;
    var showLines = false;
    var showMove = false;
    this.start = function(){
        context = holder.objects.ctxt;
        canvas = holder.objects.pane;
        move = holder.objects.move;
        size = move.length;
        dots = holder.objects.dots;

        var tmpArg = holder.setting.args;
        if(tmpArg.effects.indexOf('dots') > -1){showDots = true;}
        if(tmpArg.effects.indexOf('lines') > -1){showLines = true;}
        if(tmpArg.effects.indexOf('moves') > -1){showMove = true;}
        this.push();
        update();
    }
    this.pause = function(){
        this.stopped = true;
        stopFlag = true;
    }
    this.resume = function(){
        stopFlag = false;
        this.stopped = false;
        update();
    }
    this.push = function(){
        var tmpArg = holder.setting.args;
        paneFrames = tmpArg.paneFrames;
        paneColor = tmpArg.paneColor;
        lineColor = tmpArg.lineColor;
        lineWidth = tmpArg.lineWidth;        
        dotDistance = tmpArg.dotDistance;
        dotOffset = tmpArg.dotOffset;

        for(var i=0; i<dots.length; i++){dots[i].push();}
        for(var i=0; i<move.length; i++){move[i].push();}
    }

    this.stopped = false;
    var stopFlag = false;

    var lastTime = Date.now();
    function update() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if(showMove){
            var d = Date.now() - lastTime;
            for (var frame=0; frame*100/paneFrames<d; frame++) {
                for (var i=0; i<size; i++) {
                    move[i].update();
                }
            }
        }
        lastTime = Date.now();
        context.globalAlpha=1;
        context.fillStyle = paneColor;
        context.fillRect(0,0,canvas.width, canvas.height);
        for(var i=0; i<dots.length; i++){
            var ball = dots[i];
            if(showDots){ball.update();}
            if(showLines){
                /**/
                context.beginPath();
                for(var j = dots.length-1; j>i; j--) {
                    var b = dots[j];
                    var d = Math.hypot(ball.loc.x-b.loc.x, ball.loc.y-b.loc.y);
                    if(d<dotDistance){
                        context.strokeStyle = lineColor;
                        context.globalAlpha = 1 - (d > dotDistance ? .8 : d / 150);
                        context.lineWidth = lineWidth;
                        context.moveTo((dotOffset+ball.loc.x) | 0, (dotOffset+ball.loc.y) | 0);
                        context.lineTo((dotOffset+b.loc.x) | 0, (dotOffset+b.loc.y) | 0);
                    }
                }
                context.stroke();
                /**/
            }
        }
        if(!stopFlag){
            requestAnimationFrame(update);
        }
    }
}
function DotNetSetting(){
    this.rad = 2 * Math.PI;
    this.args = {
        'lines':true
       ,'lineColor':'rgba(0,0,0,1)'
       ,'lineColors':['#fb1','#67f','#b0f','#2F2','#6be','#e5f','#ff1','#444']
       ,'lineWidth':'2px'
       ,'paneParent':'body'
       ,'paneInject':'unset'
       ,'paneId':'animation-'+(Math.random()*(99999-10000)+10000)
       ,'paneColor':'rgba(0,0,0,0)'
       ,'paneFrames':5
       ,'paneUi':[]      // click, move
       ,'paneWidth':window.innerWidth
       ,'paneHeight':window.innerHeight
       ,'paneBorder':150
       ,'dots':true
       ,'dotOffset':0        // def 0
       ,'dotRadius':3        // def 3
       ,'dotDensity':150
       ,'dotFactor':2
       ,'dotDistance':200
       ,'dotVelScale':1
       ,'dotVelMin':-0.5
       ,'dotVelMax':0.5
       ,'moves':true
       ,'dotMoves':0.1
       ,'drunken':true
       ,'drinker':0.1
       ,'effects':['dots','lines','moves']    // glow,dots,lines,move
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
function DotNetAnimation(animation){
    var holder = animation;
    holder.operator = this;
    /* non event methods */
    this.decorate = function(opts){
        holder.setting.decorate(opts);
        return this;
    }
    this.create = function(dispatcher){
        if(dispatcher){
            dispatcher.onAppend({'events':Object.keys(holder.listener.events),'issues':Object.values(holder.listener.events)});
        }

        var canvas = holder.util.canvasCreate();
        canvas.id = holder.setting.args.paneId
        canvas.width = holder.setting.args.paneWidth;
        canvas.height = holder.setting.args.paneHeight;
        var ui = holder.setting.args.paneUi;
        if(ui.indexOf('click') > -1){canvas.addEventListener('click',function(e){clickMouse(e);});}
        if(ui.indexOf('move') > -1){canvas.addEventListener('mousemove',function(e){moveMouse(e);});}
        holder.objects.pane = canvas;
        holder.objects.ctxt = canvas.getContext("2d");

        var x = (canvas.width+2*holder.setting.args.paneBorder);
        var y = (canvas.height+2*holder.setting.args.paneBorder);
        var area = x*y;
        // squares = A_screen / A_square = A_screen / (a_square,exponent)
        var dots = holder.objects.dots;
        if(0 != holder.setting.args.dotDensity && 0 != holder.setting.args.dotFactor){
            for (var i = 0; i < area / (Math.pow(holder.setting.args.dotDensity,holder.setting.args.dotFactor)); i++) {
                dots.push(new DotConnector(holder,Math.random()*x-holder.setting.args.paneBorder, Math.random()*y-holder.setting.args.paneBorder));
            }
        }
        if(holder.setting.args.effects.indexOf('moves') > -1){
            var move = holder.objects.move;
            var mover = Math.floor(dots.length * holder.setting.args.dotMoves);
            for(var i=0; i<mover; i++){
                var j = Math.floor(Math.random()*(dots.length-1));
                move.push(new DotMovement(holder,dots[j]));
            }
        }


        console.log('Animate Dots Created\n',holder.objects.dots.length,'connectors created.\n'
            ,holder.objects.move.length,'movements created.\n'
            ,holder.setting.args.drinker,'percent drunken.\n'
            ,holder.setting.args.effects.length,'effects involved.\n'
            ,holder.setting.args.paneUi.length,'active ui interfaces.\n');
        return this;
    }
    this.validate = function(){
        return this;
    }
    /* hybird access methods */
    this.start = function(mode='any'){
        holder.engine.start();
        return holder;
    }
    this.pause = function(){
        holder.engine.pause();
        return holder;
    }
    this.resume = function(){
        holder.engine.resume();
        return holder;
    }
    this.refresh = function(){
        holder.engine.push();
        return holder;
    }
    this.color = function(data){
        if(data.hasOwnProperty('color')){this.decorate({'lineColor':data.color}).refresh();}
        else{
            var colors = holder.setting.args.lineColors;
            this.decorate({'lineColor':colors[Math.floor(Math.random()*(colors.length-1))]}).refresh();
        }
        return holder;
    }
}
function DotNetListener(animation){
    var holder = animation;
    this.events = {
       'dot-net-refresh':(data) => {holder.operator.refresh();}
       ,'dot-net-resume':(data) => {holder.operator.resume();}
       ,'dot-net-pause':(data) => {holder.operator.pause();}
       ,'dot-net-color':(data) => {holder.operator.color(data);}
    }
}
function DotNetObjects(){
    this.pane = null;
    this.ctxt = null;
    this.dots = [];
    this.move = [];
}
function DotNetHolder(){
    this.listener = new DotNetListener(this);
    this.operator = new DotNetAnimation(this);
    this.objects = new DotNetObjects();
    this.engine = new DotNetEngine(this);
    this.setting = new DotNetSetting();
    this.validate = new DotNetValidation(this);
    this.util = new HtmlCancasTool(this);
}  