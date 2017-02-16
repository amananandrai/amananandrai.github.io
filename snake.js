function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.lvl=0;
  this.spd=7;
  this.total = 0;
  this.tail = [];
  this.isdead=0;
  
  this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  this.dir = function(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.death = function() {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        s.isdead=1;
		this.lvl=0;
        this.spd=7;
         noLoop();
        textSize(40);
        text("Game Over", (width/2)-(4*25), (height/2)-20);
        textSize(20);
        text("Total Score="+this.total, (width/2)-(3*25), height/2);
        textSize(20);
        text("Press Left Mouse Button to Restart", (width/2)-(5*25), (height/2)+20);
        console.log('starting over');
        this.total = 0;
        this.tail = [];
		
		
      }
    }
  }

  this.update = function() {
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = createVector(this.x, this.y);

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;
    if(this.x>width-scl)
    this.x=0;
    if(this.y>height-2*scl)
    this.y=0;
    if(this.x<0)
    this.x=width-scl;
    if(this.y<0)
    this.y=height-scl;

    
  }

  this.show = function() {
    fill(255,255,9)
    for (var i = 0; i < this.tail.length; i++) {
      ellipse(this.tail[i].x+10, this.tail[i].y+10, scl, scl);
    }
    fill(255,0,0);
    ellipse(this.x+10, this.y+10, scl, scl);
	

  }
}
