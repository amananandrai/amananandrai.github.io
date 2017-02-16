var s;
var scl = 20;
var yflag=0;//moving in y
var xflag=1;//moving in x

var f=0;

var food;

function mousePressed()
{
  if(s.isdead===1)
  {
    yflag=0;
    xflag=1;
    f=0;//added

    setup();//added
    loop();
  }
}

function setup() {
  createCanvas(400, 420);
  s = new Snake();
  frameRate(s.spd);
    pickLocation();

}

function pickLocation() {
  var cols = floor(width/scl);
  var rows = floor((height-20)/scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}


function draw() {
  background(51);

  if (s.eat(food)) {
    pickLocation();
  }
  s.death();
  s.update();
  s.show();
  fill(255, 0, 100);
  rect(food.x, food.y, scl, scl);
  console.log(s.total+"\n");
   if(s.total%10==0 && s.total!=0 && f!=s.total){
	  s.spd = s.spd+3;
    console.log('updated s.spd'+s.spd);
	  s.lvl= s.lvl+1;
	  f=s.total;
	  frameRate(s.spd);
  }
  fill("cyan");
  rect(0,400,400,420);

  fill("Green");
  textSize(18);
 text("Total Score = "+s.total + "  Level : "+s.lvl , (width/2)-(3*25), height);
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
