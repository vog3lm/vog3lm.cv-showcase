function scatterAnimation(){

  var canvas = null
  var ctx = null


  var TAU = 2 * Math.PI;
  var dots = [];

  var args = {
      'lines':true
     ,'lineColor':'rgba(0,0,0,1)'
     ,'lineWidth':'2px'
     ,'paneParent':'body'
     ,'paneId':'animation-'+(Math.random()*(99999-10000)-10000)
     ,'paneColor':'rgba(0,0,0,0)'
     ,'paneFrames':5
     ,'paneWidth':window.innerWidth
     ,'paneHeight':window.innerHeight
     ,'paneBorder':100
     ,'dots':true
     ,'dotOffset':0         // def 0
     ,'dotRadius':6        // def 3
     ,'dotDensity':70
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
      canvas.addEventListener('click',function(e){clickMouse(e);});
      canvas.addEventListener('mousemove', function(e){moveMouse(e)});
      ctx = canvas.getContext("2d");
      if(args.paneParent == 'body'){
        document.body.appendChild(canvas)
      } else {
        document.getElementById(args.paneParent).appendChild(canvas)
      }
      if(0 == args.dotDensity){
        args.dotDensity = 1;
      }
      var lines = canvas.height / args.dotDensity;
      var rows = canvas.width / args.dotDensity;
      // squares = A_screen / A_square = A_screen / (a_square,exponent)
      var x_start = args.dotDensity/2;
      for (var i = 0; i < lines ;i++) {
        for (var j = 0; j < rows ;j++) {
          dots.push(new Ball(args.dotDensity/2+j*args.dotDensity,args.dotDensity/2+i*args.dotDensity));
        }
      }
  }
  this.start = function(){
      loop();
  }
  this.pause = function(){
      if(paused){paused = false}
      else{paused = true}
  }
  this.stop = function(){
      stopped = true
  }


  var paused = false
  var stopped = false
  function loop() {
    if(!paused){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    //  update(); // make it move
      draw();
    }
    if(!stopped){
      requestAnimationFrame(loop);
    } else {
      stopped = false
    }
  }


  function Ball(x,y){
    this.x = x;
    this.y = y;
    this.clr = args.lineColor;
    this.update = function(canvas) {
      this.x = this.x;
      this.y = this.y;
    };
    this.draw = function(ctx,can) {
      ctx.beginPath();
      ctx.globalAlpha = .4;
      ctx.fillStyle = this.clr;
      // arc(x, y, r, sAngle, eAngle, counterclockwise)
      ctx.arc((this.x) | 0, (this.y) | 0, args.dotRadius, 0, TAU, false);
      ctx.fill();
    }
    this.position = function(){
      return {'x':this.x,'y':this.y}
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

  // unused
  var mouseX = -1e9, mouseY = -1e9;
  document.addEventListener('mousemove', function(e) {
    var mouse = {'x':e.clientX,'y':e.clientY}
  });
  var clicked = -1
  function moveMouse(e) {
    var mouse = {'x':e.clientX,'y':e.clientY}
    if(-1 != clicked){
      var ball = dots[clicked];
      var dist = Math.hypot(mouse.x-ball.x, mouse.y-ball.y);
      console.log(dist);
    }

  }
  function clickMouse(e){
    var mouse = {'x':e.clientX,'y':e.clientY}
    var bubble = 0
    clicked = -1
    for(var i=0; i<dots.length; i++){
      var position = dots[i].position();
      if((bubble+args.dotRadius) >= Math.abs(position.x - mouse.x) && (bubble+args.dotRadius) >= Math.abs(position.y - mouse.y)){
        dots[i].clr = 'red'
        clicked = i
        break;
      }
    }


  }


  function draw() {
    ctx.globalAlpha=1;
    ctx.fillStyle = args.paneColor;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    // opeate moving dots
    for (var index = 0; index < dots.length; index++) {
      var ball = dots[index];
      if(args.dots){ball.draw(ctx,canvas);}
      if(args.lines){

      }
      ctx.stroke();
    }
  }
}