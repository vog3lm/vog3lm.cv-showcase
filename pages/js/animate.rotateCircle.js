function circleAnimation(){

  var canvas = null
  var ctx = null


  var TAU = 2 * Math.PI;
  var dots = [];

  var args = {
      'lines':true
     ,'lineColor':'rgba(0,0,0,1)'
     ,'lineWidth':'2px'
     ,'paneParent':'body'
     ,'paneId':'animation-'+(Math.random()*(99999-10000)+10000)
     ,'paneColor':'rgba(0,0,0,0)'
     ,'paneFrames':5
     ,'paneWidth':window.innerWidth
     ,'paneHeight':window.innerHeight
     ,'circleRadius':400
     ,'circleSpeed':10
     ,'circleSpin':1
     ,'circleBounce':false
     ,'dots':true
     ,'dotAngle':10
     ,'dotRadius':2        // def 3
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
      ctx = canvas.getContext("2d");
      if(args.paneParent == 'body'){
        document.body.appendChild(canvas)
      } else {
        document.getElementById(args.paneParent).appendChild(canvas)
      }
      var area = canvas.width * canvas.height;
      // dots = u_circle / radians
      var count = 360/args.dotAngle;
      var angle = 2*Math.PI/360*args.dotAngle
      var x_org = args.paneWidth/2;
      var y_org = args.paneHeight/2;
      for (var i = 0; i < count; i++) {
          dots.push(new Ball(x_org,y_org,args.circleRadius,angle*i));
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
      update(); // make it move
      draw();
    }
    if(!stopped){
      requestAnimationFrame(loop);
    } else {
      stopped = false
    }
  }


  function Ball(x,y,radius,a){
    var angle = a;
    var x = x;
    var y = y;
    var radius = radius
    var wave = 1;
    var waver = 1;
    this.x = radius * Math.cos(angle) + x;
    this.y = radius * Math.sin(angle) + y;
    this.update = function(canvas) {
      angle -= args.circleSpin*2*Math.PI/args.paneFrames/1000*args.circleSpeed;
      if(Math.abs(angle) >= 2*Math.PI){angle=0;}
      if(args.circleBounce){
        if(1.1 <= wave){waver = -1;}
        else if(0.9 >= wave){waver = 1;}
        wave += waver * 0.001
        if(1.1 <= wave){wave = 1.1;}
        else if(0.9 >= wave){wave = 0.9}
      }
      this.x = radius * wave * Math.cos(angle) + x;
      this.y = radius * wave * Math.sin(angle) + y;
    };
    this.draw = function(ctx,can) {
      ctx.beginPath();
      ctx.globalAlpha = .4;
      ctx.fillStyle = args.lineColor;
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
  document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });
  function distMouse(ball) {
    return Math.hypot(ball.x - mouseX, ball.y - mouseY);
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
          ctx.strokeStyle = args.lineColor;
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = args.lineWidth;
          var position = ball.position();
          ctx.moveTo(position.x,position.y);
          if(0 == index){position = dots[dots.length-1].position();}
          else{position = dots[index-1].position();}
          ctx.lineTo(position.x,position.y);
      }
      ctx.stroke();
    }
  }
}