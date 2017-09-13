var s;
var scl = 20;
var yflag=0;
var xflag=1;

var f=0;
var last=0;
var food;
var bonus;
var counter=0;
var time;
var img1;
function timer()
{
  counter++;
  time=floor(counter/floor(s.spd*(5/7)));
}
function mousePressed()
{
  if(s.isdead===1)
  {
    yflag=0;
    xflag=1;
    f=0;
    s.x = 0;
    s.y = 0;
    s.xspeed = 1;
    s.yspeed = 0;
    s.total = 0;
    s.tail = [];
    s.isdead=0;
    setup();
    loop();
  }
}

function setup() {
  createCanvas(400, 420);
	img1=loadImage("s.png");
  s = new Snake();
  frameRate(s.spd);
last=0;
    pickLocation();
    bonus=createVector(-100,-100);

}
function pickbonus()
{
  var cols = floor(width/scl);
  var rows = floor((height-20)/scl);
  bonus = createVector(floor(random(cols)), floor(random(rows)));
  bonus.mult(scl);
  s.bonusenable=1
}
function pickLocation() {
  var cols = floor(width/scl);
  var rows = floor((height-20)/scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}
function draw() {
  background(255,235,238);
	image(img1,0,0);
  if(time==6)
  {
    counter=0;
    time=0;
  }
  if(s.bonusenable==1)
  setTimeout(timer,1);
  if (s.eat(food)) {
    pickLocation();
  }
  s.death();
  s.update();
  s.show();

  if((s.total)%10==0 && s.total >last && s.bonusenable==0)
  {
    last=s.total;
   
      time=0;
      counter=0;
      pickbonus();
      s.bonusenable=1;
  }
  if(time==5 && s.bonusenable==1)
  {
    console.log("Bonus Timedout");
    s.bonusenable=0;
    bonus.x=-100;
    bonus.y=-100;
  }

  if(s.eatbonus(bonus,time))
  {
   
    bonus.x=-100;
    bonus.y=-100;
  }
if(s.bonusenable==1){
  fill(156, 39, 176);
  rect(bonus.x, bonus.y, scl, scl);}
  fill(240,98 ,146 );
  rect(food.x, food.y, scl, scl);
   if((s.total)%10==0 && (s.total)!=0 && f!=(s.total)){
	  s.spd = s.spd+1;
	  s.lvl= s.lvl+1;
	  f=(s.total);
	  frameRate(s.spd);
  }
  fill(239,154,154);
  rect(0,400,400,420);

  fill(183,28,28);
  textSize(18);
  if(s.bonusenable==1)
  text("Time:"+(5-time),(width/2)-(50 *3),height);
 text("Total Score = "+(s.total+s.score) + "  Level : "+s.lvl , (width/2)-(3*25), height);
}





function keyPressed() {
  if (keyCode === UP_ARROW && yflag===0) {
    yflag=1;
    xflag=0;
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW && yflag===0) {
    yflag=1;
    xflag=0;
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW && xflag===0) {
    yflag=0;
    xflag=1;
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW && xflag===0) {
    yflag=0;
    xflag=1;
    s.dir(-1, 0);
  }
}

