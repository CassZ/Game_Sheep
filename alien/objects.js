function ship(canvas,x, y, w, h) {
	this.context = canvas.getContext("2d");
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;	
	this.speed=1;
	this.score=0;
	
	this.level=1;
	var exp=0;
	var img_use=1;
	
	// cass is good
	this.is_trapped=function(){
		//alert("none");
		if(this.x > (canvas.width/2-10) && this.x < (canvas.width/2+10) && 
			this.y > (canvas.height/2-10) && this.y < (canvas.height/2+10)){
			return true;
		}else {
			return false;
		}
	}
	
	this.move_left=function(){
		if(this.x >= this.speed)
			this.x=this.x-this.speed;
	}
	this.move_right=function(){
		if(this.x<(canvas.width-this.w)-this.speed)
			this.x=this.x+this.speed;
	}
	this.move_down=function(){
		if(this.y >= this.speed)
			this.y=this.y-this.speed;
	}
	this.move_up=function(){
		if(this.y<(canvas.height-this.h)-this.speed)
			this.y=this.y+this.speed;
		
	}
	
	this.getCenter=function(size){
		return this.x + (this.w / 2) - size/2;
	}
	
	this.add_score=function(iscore){
		this.score=this.score+iscore;
		return this.score;
	}
	
	this.gain_exp=function(gexp){
		exp=exp+gexp;
		exp_doc.innerHTML=exp;
		var total_exp=Math.floor(10*Math.pow(this.level,2));
		modify_prog_bar(exp,total_exp);		
		if(exp >= total_exp){//Exp Full, Level Up!!
			exp=0;
			this.level++;
			img_use=this.level;
			if(img_use>3) img_use=3;
			total_exp=Math.floor(10*Math.pow(this.level,2))
			level_doc.innerHTML=this.level;
			exp_doc.innerHTML=exp;
			total_exp_doc.innerHTML=total_exp;
			modify_prog_bar(exp,total_exp);			
			return true;
		}
		return false;
	}
	
	this.shoot=function(){
		var size=10;	//bullet size
		var center=this.x + (this.w / 2) - size/2;
		if(this.level<4){
			if(bullet.total<this.level){
				bullets[bullet.total] = new bullet(gcontext,center,this.y,10);
			}
		}else{
			if(bullet.total < this.level){
				bullets[bullet.total] = new bullet(gcontext,center-8,this.y,10);				
				bullets[bullet.total] = new bullet(gcontext,center+8,this.y,10);
			}				
		}
	}
	
	this.draw=function(){				
		this.context.drawImage(ship_images[img_use],this.x,this.y);
		//draw one trap
		this.context.drawImage(trap_images[1], (canvas.width/2), (canvas.height/2));
	}

}

function bullet(context, x, y, size){
	this.context = canvas.getContext("2d");
	this.x=x;
	this.y=y;
	this.size=size;
	
	this.constructor.total++;
	this.dir=-1;//-1:toward alien, 1:toward ship
	
	
	this.out_of_bounds = function(){
		if(this.y < 5)
			return true;
		else
			return false;
	}
	
	this.fly=function(){ //Let the bullet fly
		this.y=this.y+(this.constructor.speed*this.dir);
	}	
	
	this.draw=function(){
		this.context.fillStyle="#0000FF";
		//this.context.fillRect(100,100,100,100);
		//this.context.fillRect(this.x,this.y,this.size,this.size+this.speed);
		this.context.drawImage(bullet_images[2],this.x,this.y);
	}
}
bullet.speed = 3;
bullet.total = 0;





function alien(context,x, y, type, color){
	this.context = context;
	this.x=x;
	this.y=y;
	this.type=type;
	this.w=alien_w[type];
	this.h=alien_w[type];
	this.color=color;
	this.score=1+stage;
	//alert(this.w+","+this.h);
	this.constructor.total++;
	
	this.is_hit=function(bulletx, bullety){
		var y = this.y  + this.constructor.forward;
		var dy = bullety - y;
		var dx = bulletx - this.x;
		var dy2 = bullety - y;
		var dx2 = bulletx - this.x;						
		if(dy<=this.h && dy>=0 && dx<=this.w && dx>=0 ||
		   dy2<=this.h && dy2>=0 && dx2<=this.w && dx2>=0)
			return true;
		else
			return false;
	}
	
	this.if_touched=function(shipx, shipy, shipw, shiph, dir){
		var tw = this.x + this.w;
		var sw = shipx + shipw;
		var sh = shipy - shiph;
		var th = this.y - this.h
		switch (this.dir) {
			case 0: //alien moves upwards
				if (tw>shipx && sw>this.x && sh>=this.y) { 
					alert(this.w);
					//alert(this.w);//ship is below alien
					return true;
					break;
				}else{
					return false;
					break;
					}

			case 1: //alien moves downwards
				if (tw>shipx && sw>this.x && shipy<=th) { 
					alert(this.w);
					//alert(this.w);//ship is below alien
					return true;
					break;
				}else{
					return false;
					break;
					}

			case 2: //alien moves leftwards
				if (shipy>th && this.y>sh && sh<=this.y && tw<=shipx) { 
					alert(this.w);
					//alert(this.w);//ship is below alien
					return true;
					break;
				}else{
					return false;
					break;
					}

			case 3: //alien moves rightwards
				if (shipy>th && this.y>sh && sh<=this.y && this.x>=sw) { 
					alert(this.w);
					//alert(this.w);//ship is below alien
					return true;
					break;
				}else{
					return false;
					break;
					}

				
					
			
		//return false;
		}
	}
	
	//current move function
	this.move=function(){
		this.x=this.x + (this.constructor.dir * this.constructor.speed);
	}
	
	this.move_up=function(shipx shipy shipw shiph){
		if  (if_touched(shipx, shipy, shipw, shiph, 0)) {
			this.y=this.y + this.constructor.speed;
		}
	}
	
	this.move_down=function(shipx shipy shipw shiph){
		if  (if_touched(shipx, shipy, shipw, shiph, 1)) {
			his.y=this.y + this.constructor.speed;
		}
	}
	
	this.move_left=function(shipx shipy shipw shiph){
		if  (if_touched(shipx, shipy, shipw, shiph, 2)) {
			this.x=this.x - this.constructor.speed;
			}
	}
	
	this.move_right=function(shipx shipy shipw shiph 3){
		if  (if_touched(shipx, shipy, shipw, shiph, 3)) {
		this.x=this.x + this.constructor.speed;
		}
	}
	
	this.shock_mode=function(){
		this.x+=Math.floor((Math.random()*3))-1; 
		this.y+=Math.floor((Math.random()*3))-1;
		if(this.x<0) this.x=0;
		else if(this.x+this.w>canvas_width) this.x=canvas_width-this.w;
		if(this.y<0) this.y=0;
	}
	this.draw=function(){
		//this.shock_mode();
		this.context.drawImage(alien_images[this.type],this.x,this.y+this.constructor.forward);
	}	
}
alien.speed=20;
alien.forward=0;
alien.dir = 1;
alien.total = 0;


function trap(canvas,x, y, w, h, type) {
	this.context = canvas.getContext("2d");
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
	this.type=type
	
	this.draw=function(){
		this.context.drawImage(trap_images[this.type],this.x,this.y);
	}
}
