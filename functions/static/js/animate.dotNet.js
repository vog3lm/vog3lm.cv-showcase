'use strict';

function dotNetAnimation(){

  var canvas = null

  var ctx = null
  var TAU = 2 * Math.PI;
  var dots = [];
  var fixed = [];

  var args = {
      'lines':true
     ,'lineColor':'rgba(0,0,0,1)'
     ,'lineWidth':'2px'
     ,'paneParent':'body'
     ,'paneId':'animation-'+(Math.random()*(99999-10000)+10000)
     ,'paneColor':'rgba(0,0,0,0)'
     ,'paneFrames':5
     ,'paneUi':true
     ,'paneWidth':window.innerWidth
     ,'paneHeight':window.innerHeight
     ,'paneBorder':150
     ,'dots':true
     ,'dotOffset':0         // def 0
     ,'dotRadius':3        // def 3
     ,'dotDensity':500
     ,'dotFactor':2
     ,'dotDistance':200
     ,'dotVelScale':1
     ,'dotVelMin':-0.5
     ,'dotVelMax':0.5
     ,'fixedDots':125
     ,'drunkenDots':true
  }

  // lifecycle
  this.decorate = function(decor){
      for (var key in decor){
          if(args.hasOwnProperty(key)){
              args[key] = decor[key]
          }
      }
  }
  this.create = function(){
      canvas = document.createElement("canvas");
      canvas.id = args.paneId
      canvas.width = args.paneWidth;
      canvas.height = args.paneHeight;
      if(args.paneUi){
        canvas.addEventListener('click',(e) => {clickMouse(e);});      // make me interactive
        //    canvas.addEventListener('mousemove', function(e){moveMouse(e)});
      }

      ctx = canvas.getContext("2d");
      if(args.paneParent === 'body'){
        document.body.appendChild(canvas)
      } else {
        var element = document.getElementById(args.paneParent)
        element.insertBefore(canvas, element.childNodes[0]);
      }
      var x = (canvas.width+2*args.paneBorder);
      var y = (canvas.height+2*args.paneBorder);
      var area = x*y;
      // squares = A_screen / A_square = A_screen / (a_square,exponent)
      if(0 !== args.dotDensity && 0 !== args.dotFactor){
        for(let i=0; i<area / (Math.pow(args.dotDensity,args.dotFactor)); i++) {
            dots.push(new Ball(Math.random()*x-args.paneBorder, Math.random()*y-args.paneBorder));
        }
      }
      if(0 !== args.fixedDots && 0 !== args.dotFactor){
        for(let i=0; i<area / (Math.pow(args.fixedDots,args.dotFactor)); i++) {
          fixed.push(new Ball(Math.random()*x-args.paneBorder, Math.random()*y-args.paneBorder,0,0));
        }
      }
  }
  this.createFromId = function(id){
      canvas = document.getElementById(id);
      canvas.width = args.paneWidth;
      canvas.height = args.paneHeight;
      canvas.addEventListener('click',(e) => {clickMouse(e);});     // make me interactive
      //    canvas.addEventListener('mousemove', function(e){moveMouse(e)});
      ctx = canvas.getContext("2d");
      var x = (canvas.width+2*args.paneBorder);
      var y = (canvas.height+2*args.paneBorder);
      var area = x*y;
      // squares = A_screen / A_square = A_screen / (a_square,exponent)
      if(0 !== args.dotDensity && 0 !== args.dotFactor){
        for (let i = 0; i < area / (Math.pow(args.dotDensity,args.dotFactor)); i++) {
            dots.push(new Ball(Math.random()*x-args.paneBorder, Math.random()*y-args.paneBorder));
        }
      }
      if(0 !== args.fixedDots && 0 !== args.dotFactor){
        for (let i = 0; i < area / (Math.pow(args.fixedDots,args.dotFactor)); i++) {
          fixed.push(new Ball(Math.random()*x-args.paneBorder, Math.random()*y-args.paneBorder,0,0));
        }
      }
  }
  this.start = function(){
      paused = false
      stopped = false
      loop();
  }
  this.pause = function(){
      if(paused){paused = false}
      else{paused = true}
  }
  this.stop = function(){
      stopped = true
      paused = false
  }

  var paused = false
  var stopped = false
  function loop() {
    if(!paused){
      if(args.drunkenDots){
          var transferCount = dots.length*0.1
          var transferDots = dots.slice(0,transferCount)
          var fixedCount = fixed.length*0.1
          var transferFixed = fixed.slice(0,fixedCount)
          dots.concat(transferDots)
          fixed.concat(transferFixed)
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      update();
      draw();
    }
    if(!stopped){
      requestAnimationFrame(loop);
    }
  }


  function Ball(startX, startY, startVelX, startVelY){
    var startVelx = Math.round(Math.random())*2 - 1
    var startVely = Math.round(Math.random())*2 - 1
    this.x = startX || Math.random() * canvas.width;
    this.y = startY || Math.random() * canvas.height;

    this.vel = {
      x: startVelX || startVelx*(Math.random()*(args.dotVelMax-args.dotVelMin) + args.dotVelMin)/args.dotVelScale,
      y: startVelY || startVelx*(Math.random()*(args.dotVelMax-args.dotVelMin) + args.dotVelMin)/args.dotVelScale
    };
    this.update = function(canvas) {
      var drunken = 1
      if (this.x >= canvas.width + args.paneBorder || this.x <= -args.paneBorder) {
        this.vel.x = -this.vel.x;
      }
      if (this.y >= canvas.height + args.paneBorder || this.y <= -args.paneBorder) {
        this.vel.y = -this.vel.y;
      }
      // change position
      this.x += this.vel.x*drunken;
      this.y += this.vel.y*drunken;
    };
    this.draw = function(ctx, can) {
      ctx.beginPath();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = args.lineColor;
      // arc(x, y, r, sAngle, eAngle, counterclockwise)
      ctx.arc((args.dotOffset+this.x) | 0, (args.dotOffset+this.y) | 0, args.dotRadius, 0, TAU, false);
      ctx.fill();
    }
    this.velocity = function(velX,velY){
      this.vel = {x:velX,y:velY}
    }
  }



  var lastTime = Date.now();
  function update() {
    var diff = Date.now() - lastTime;
    for (var frame = 0; frame * 100 / args.paneFrames < diff; frame++) {
      for (var index = 0; index < dots.length; index++) {
        dots[index].update(canvas);
      }
    }
    lastTime = Date.now();
  }


  var mouse = {'x':-1e9,'y':-1e9}
  function moveMouse(e){
    console.log('move')
  //  var ball = dots[0]
  //  var dist = Math.hypot(ball.x - e.clientX, ball.y - e.clientY);
  }
  function clickMouse(e){
    var data = {'call':'click-animation'
               ,'id':args.paneId
               ,'x':e.clientX,'y':e.clientY}
    $('body').trigger(data.call,[data]);
  }

  function drawLine(ball,ball2){
      var dist = Math.hypot(ball.x-ball2.x, ball.y-ball2.y);
      if (dist < args.dotDistance) {
        ctx.strokeStyle = args.lineColor;
        ctx.globalAlpha = 1 - (dist > args.dotDistance ? 0.8 : dist / 150);
        ctx.lineWidth = args.lineWidth;
        ctx.moveTo((args.dotOffset+ball.x)  | 0, (args.dotOffset+ball.y)  | 0);
        ctx.lineTo((args.dotOffset+ball2.x) | 0, (args.dotOffset+ball2.y) | 0);
      }
  }

  function draw() {
    ctx.globalAlpha=1;
    ctx.fillStyle = args.paneColor;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    // opeate moving dots
    for (let index = 0; index < dots.length; index++) {
      let ball = dots[index];
      if(args.dots){ball.draw(ctx,canvas);}
      if(args.lines){
        ctx.beginPath();
        for(let i=index; i<fixed.length; i++){
          drawLine(ball,fixed[i])
        }
        for(let i=index; i<dots.length; i++){
          drawLine(ball,dots[i])
        }

        // old code
        // for(var index2 = fixed.length - 1; index2 > index; index2 += -1) {
        //   drawLine(ball,fixed[index2])
        // }
        // for(var index2 = dots.length - 1; index2 > index; index2 += -1) {
        //   drawLine(ball,dots[index2])
        // }
        ctx.stroke();
      }
    }
    // opeate fixed dots
    for(let index = 0; index < fixed.length; index++) {
      let ball = fixed[index];
      if(args.dots){ball.draw(ctx,canvas);}
      if(args.lines){
        ctx.beginPath();
        for(let i=index; i<fixed.length; i++){
          drawLine(ball,fixed[i])
        }
        for(let i=index; i<dots.length; i++){
          drawLine(ball,dots[i])
        }

        // old
        // for (var index2 = dots.length - 1; index2 > index; index2 += -1) {
        //   drawLine(ball,dots[index2])
        // }
        // for (var index2 = fixed.length - 1; index2 > index; index2 += -1) {
        //   drawLine(ball,fixed[index2])
        // }
        // ctx.stroke();
      }
    }


  }




}