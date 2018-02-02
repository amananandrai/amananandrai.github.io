

function Bird() {
  this.w = 45;
    this.h = 45;
    this.y = floor(height/2) - floor(this.h/2);
    this.x = floor(width/2) - floor(this.w/2);
  this.gravity =1;
  this.lift = -25;
  this.velocity = 0;

  this.show = function() {
	 
     image(bimg,this.x-50,this.y-55,this.w*2,this.h*2);
       
	 }

  this.up = function() {
    this.velocity += this.lift;
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.velocity *= 0.8;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height-this.h;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }

  }

}
