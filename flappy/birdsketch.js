
var bird;
var back;
var jump_window = 70;
var bimg;
var pipes = [];
var score=0;
var isDead = false;
var isStarted = false;
function preload(){
	back=loadImage("back.jpg");
  bimg=loadGif("bird1.gif");
  go = loadSound("gameover.wav");
bonus1 = loadSound("bonus.wav");
}
function setup() {
  createCanvas(800, 600);
    bird = new Bird();
    pipes.push(new Pipe());
    noLoop();
}

function draw() {
   if (frameCount % 150 === 0 && isDead === false) {
	   bonus1.play();
        score++;
    }
  image(back,0,0,800,600);

  for (var i = pipes.length-1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].hits(bird)) {
    isDead = true;
    }


    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }


  }

  bird.update();
  bird.show();
  
  textSize(30);
  textStyle(BOLD);
textAlign(CENTER);
  fill(63,81,181);
  text('SCORE: '+score.toString(), floor(width-75), floor(height/8));

  if (frameCount % 150 == 0) {
    pipes.push(new Pipe());
  }
fill(244, 67, 54);

textAlign(CENTER);
textSize(40);
if (isDead === true) {
        
        go.play();
        text('Game Over', floor(width/2), floor(height/2 - 60));
        
        text('hit < F5 > to replay', floor(width/2), floor(height/2 + 80));
		noLoop();
    }

    if (isStarted === false) {
        
        
        text('GET READY', floor(width/2), floor(height/2 - 60));
       
        text('hit < spacebar > to play', floor(width/2), floor(height/2 + 80));
		
    }

}
    


function keyPressed() {
    if (key === ' ' && isDead === false) {
        if (isStarted === false) {
            isStarted = true;
            loop();
        }
        bird.up();
    }
}

