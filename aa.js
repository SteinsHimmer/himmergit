
  
function draw(){
    var canvas = document.getElementById("h5game");
    if(!canvas.getContext) return;
    var ctx = canvas.getContext("2d");
     var grd=ctx.createRadialGradient(300,300,200,300,280,440);
grd.addColorStop(0,"deepskyblue");
grd.addColorStop(1,"aqua");
ctx.fillStyle=grd;
ctx.fillRect(0,0,600,600);
 

   
    for(var i=100;i<600;i+=100){
              ctx.beginPath(); 
              ctx.lineJoin="round";
    ctx.moveTo(0, i); 
    ctx.lineTo(600,i );  
    ctx.closePath();
    ctx.stroke(); 
    }
     for(var j=100;j<600;j+=100){
              ctx.beginPath(); 
              ctx.lineJoin="round";
    ctx.moveTo(j, 0); 
    ctx.lineTo(j,600 );  
    ctx.closePath();
    ctx.stroke(); 
    }
}
draw();

