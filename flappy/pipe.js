

function Pipe() {
    this.gap = jump_window; 
    this.mid = floor(random(height/6, 4 * height/6));
	
    this.topHeight = this.mid-this.gap;
    this.bottomHeight = height-this.mid-this.gap;

    this.x = width;
	
    this.w = 40;   
    this.speed = 2.5; 

  

  this.hits = function(bird) {
    if (bird.y-bird.h/2 < this.topHeight || bird.y+bird.h/2 > height - this.bottomHeight) {
      if (bird.x >this.x && bird.x < this.x + this.w) {
        
        return true;
      }
    }
   
    return false;
  }

  this.show = function() {
	  noStroke();
    fill(0, 230, 118);
    
    rect(this.x, 0, this.w, this.topHeight);
    rect(this.x, height-this.bottomHeight, this.w, this.bottomHeight);
  }

  this.update = function() {
    this.x -= this.speed;
	
  }

  this.offscreen = function() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }


}
