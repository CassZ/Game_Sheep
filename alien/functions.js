
function key_event(){
	if(left_key_hold) {
		mShip.move_left();
	}
	if(right_key_hold) {
		mShip.move_right();
	}
	if(up_key_hold) {
		mShip.move_up();
	}
	if(down_key_hold) {
		mShip.move_down();
	}
}

function handle_hit(alien_id, bullet_id){
	var score=mShip.add_score(aliens[alien_id].score);
	score_doc.innerHTML=score;
	mShip.gain_exp(aliens[alien_id].score);	
	
	bullets.splice(bullet_id,1);
	aliens.splice(alien_id,1);
	alien.total--;
	bullet.total--;		

}

function invader_move(){
	if(stop_flag)
		return;
	window.setTimeout(invader_move,invader_move_timeout);
	
	/* - Find the Leading Alien(Left Most / Right Most)
	 * - Store It's index in lflag
	 * */
	var lflag=0;
	var small=999;
	var large=0;
	for(var i=0; i < alien.total; i++){
		if(alien.dir < 0){ // Current direction: Left
			if(aliens[i].x < small){
				small=aliens[i].x;
				lflag=i;
			}
		}else{//Current direction: Right
			if(aliens[i].x > large){
				large=aliens[i].x;
				lflag=i;
			}
		}
	}
		
	//Handle the situation when alien hit the left/right wall(Boundary)
	if(alien.total!=0){
		if(aliens[lflag].x < alien.speed){
			alien.dir=1;
			alien.forward+=alien.speed;
		}else if(aliens[lflag].x > (canvas.width - aliens[lflag].w - alien.speed)){
			alien.dir=-1;
			alien.forward+=alien.speed;
		}
	}	
	for(var i=0; i < alien.total; i++){	
		aliens[i].move();
	}
	
	//Handle the situation when alien reached the bottom
	for(var i=0; i < alien.total; i++){
		if(aliens[i].y+aliens[i].h+alien.forward >= canvas.height){
			stop_flag=true;
			game_on=false;
			end_page();
		}
	}
}

function create_alien_wave(stage){
	alien.forward=0;
	if(stage > 7)
		stage = 7;
	for(var j=0; j <=stage ;j++){
		var type=Math.floor((Math.random()*4)+1); 
		for(var i=0; i <=10; i++){
			aliens[alien.total] = new alien(gcontext, 35+(i*35), 35+(j*40), type, "#FF00AA")
		}
	}
}

function draw_aliens(){
	for(var i=0; i < 2; i++){  //used to be i < alien.total
		aliens[i].draw();
	}	
}

function load_images(){
	ship_images[1] = new Image();
	ship_images[1].src = '1.jpg';
	ship_images[2] = new Image();
	ship_images[2].src = '1.jpg';
	ship_images[3] = new Image();
	ship_images[3].src = '1.jpg';

	bullet_images[1] = new Image();
	bullet_images[1].src = 'b_1.png';	
	bullet_images[2] = new Image();
	bullet_images[2].src = 'b_2.png';	
	bullet_images[3] = new Image();
	bullet_images[3].src = 'b_3.png';	
	bullet_images[4] = new Image();
	bullet_images[4].src = 'b_4.png';	
	
	alien_images[1] = new Image();
	alien_images[2] = new Image();
	alien_images[3] = new Image();
	alien_images[4] = new Image();

	alien_images[1].src = 'man.jpg';	
	alien_images[2].src = 'man.jpg';	
	alien_images[3].src = 'man.jpg';	
	alien_images[4].src = 'man.jpg';
	
	trap_images[1] = new Image();
	trap_images[1].src = 'mud.png';


	//img.width & img.height work differently in different browser
	//to save time(from researching) hard code the size
	alien_w[1]=20;
	alien_w[2]=20;
	alien_w[3]=20;
	alien_w[4]=20;

	alien_h[1]=40;
	alien_h[2]=40;
	alien_h[3]=40;
	alien_h[4]=40;

	//alien_w[1]=25;
}

function modify_prog_bar(exp,total_exp){
	var width=Math.floor(150*(exp/total_exp));
	exp_prog_doc.style.width=width+"px";
}


function end_page(){
	//alert("Game Over!");
	var instr = canvas.getContext("2d");	
	instr = canvas.getContext("2d");			
	instr.font="60px Georgia";
	instr.fillStyle = 'yellow';
	instr.fillText("Game Over!",80,200);

	instr.font = "25px Georgia" 
	instr.fillStyle = 'yellow';
	instr.fillText("Press ENTER to Restart",110, 290);
}

function start_page(){
	var title = canvas.getContext("2d");	
	gcontext.clearRect(0,0,canvas.width,canvas.height);
	title.font = "50px Georgia" 
	title.fillStyle = 'yellow';
	title.fillText("SPACE INVADERS",37,120);
	var instr = canvas.getContext("2d");	
	instr.font = "25px Georgia" 
	instr.fillStyle = 'yellow';
	instr.fillText("CONTROL KEYS",150, 200);

	var x=95;
	instr.font = "bold 16px Courier" 
	instr.fillStyle = 'yellow';
	instr.fillText("Move Left:            ←   or  A", x, 240);
	instr.fillText("Move Right:           →   or  D", x, 280);
	instr.fillText("Fire Bullet:        space  or  J",x, 320);
	instr.fillText("Pause Game:                    P",x, 360);
	instr.fillText("Main Menu:                    ESC",x, 400);

	instr.font = "25px Georgia" 
	instr.fillStyle = 'yellow';
	instr.fillText("Press ENTER to Start",120, 460);
}

function load_game(){
	//Initialization
	stage=1;
	invader_move_timeout=1000;
	aliens.splice(0,aliens.length);
	alien.total=0;
	bullets.splice(0,bullets.length);
	bullet.total=0;
	score_doc.innerHTML=0;
	stage_doc.innerHTML=1;
	level_doc.innerHTML=1;
	exp_doc.innerHTML=0;
	total_exp_doc.innerHTML=10;	
	modify_prog_bar(0,10);
	
	mShip = new ship(canvas, 400, 200, 20, 25);	
	iTrap = new trap(canvas, 400, 800, 20, 25, 1);
	create_alien_wave(stage);	
	stop_flag=false;
	time();
	invader_move();
}