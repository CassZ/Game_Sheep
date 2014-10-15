/*List of Global Variables needed and their initialization*/
//canvas
var canvas=document.getElementById("canvas");
var gcontext = canvas.getContext("2d");
var canvas_width=canvas.width;
var canvas_height=canvas.height;

//docs
var score_doc = document.getElementById("score");
var level_doc = document.getElementById("level");
var exp_doc = document.getElementById("exp");
var stage_doc = document.getElementById("stage");
var total_exp_doc = document.getElementById("total_exp");
var exp_prog_doc = document.getElementById("exp_prog");

//Images
var ship_images = [];
var bullet_images = [];	
var alien_images = [];
var trap_images = [];	

var game_on=false;
var stop_flag=true;
var stage;
var invader_move_timeout;
var mShip;
var bullets = [];	//Array to store bullet object
var aliens = [];	//Array to store alien object
var alien_w =[];
var alien_h =[];
var up_touch_flag=false;
var down_touch_flag=false;
var left_touch_flag=false;
var down_touch_flag=false;
var iTrap;

load_images();

start_page();

function time(){
	if(stop_flag)
		return;		
	window.setTimeout(time,1);
	
	//clear the canvas, get ready for drawing
	gcontext.clearRect(0,0,canvas.width,canvas.height);
	
	//check which keys are pressed, and run their correspond functions
	key_event();
	
	//draw aliens
	draw_aliens();

	//draw ship
	mShip.draw();
	
	iTrap.draw();

	/* - draw each bullet existed
	 * - check if bullet hits an alien & perform correspond function
	 * - check if bullet is out of bound & perform correspond function ((mship.h *2) + (aliens[i].h *2))
	 * */
	
	
	for(var i=0; i < bullet.total; i++){
		var hit_flag=false;
		for(var j=0; j < alien.total; j++){
			if(aliens[j].is_hit(bullets[i].x, bullets[i].y, bullets[i].size)){
				handle_hit(j,i);				
				hit_flag=true;
				break;
			}
		}		
		if(hit_flag)
			continue;
		
		if(bullets[i].out_of_bounds()){
			bullets.splice(i,1);
			bullet.total--;
			continue;
		}
		bullets[i].fly();
		bullets[i].draw();
	}
	

	for(var k=0; k < alien.total; k++){
	if (aliens[k].if_touched(mShip.x, mShip.y, mShip.w, mShip.h, 0)) {
			up_touch_flag=true;
			alert("UPtouched");
			
		}
	}
	
	//handle the situation when all aliens are defeated
	if(alien.total==0){
		invader_move_timeout=invader_move_timeout-50;
		stage++;
		stage_doc.innerHTML=stage;
		create_alien_wave(stage);
	}	

	if (mShip.is_trapped()) {
			stop_flag=true;
			game_on=false;
			end_page();
	}

}

/* ========================================================================
 * The Fellowing Code handle the situation when a keyboard event occurs
 * ========================================================================
 */ 

var left_key_hold=false,
	right_key_hold=false,
	shoot_key_hold=false;
	up_key_hold=false;
	down_key_hold=false;


$(document.body).keydown(function (evt) {
	code=evt.keyCode;
	//alert(code);
	if(code == 65 || code == 37) { //When key 'a' or '←' pressed
		left_key_hold=true;
	}else if(code == 68 || code == 39) { //When key 'd' or '→' pressed
		right_key_hold=true;
	}else if(code == 40 ) { //When key 'up' pressed
		up_key_hold=true;
	}else if(code == 38) { //When key 'down' pressed
		down_key_hold=true;
	}else if(code == 74){	// not used in this version
		shoot_key_hold=true;
	}
});

$(document.body).keyup(function (evt) {
	code=evt.keyCode;
    //alert(code);
	if(code == 65 || code == 37) {	//When key 'a' or '←' pressed
		left_key_hold=false;
	}else if(code == 68 || code == 39) { //When key 'd' or '→' pressed
		right_key_hold=false;
	}else if(code == 40 ) { //When key 'up' pressed
		up_key_hold=false;
	}else if(code == 38) { //When key 'down' pressed
		down_key_hold=false;
	}else if(code == 74){	// not used in this version
		shoot_key_hold=false;
	}
});

function keypressed(e){
		code=e.keyCode;
//alert(code);
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 106 || code == 32){ // 'j' or 'Space' is pressed
		mShip.shoot();
	}else if(code == 112){// key 'p' is pressed, toggle Pause event
		stop_flag=!stop_flag;
		time();
	}else if(code == 13 && !game_on){//Enter pressed when game in off state
		game_on=true;
		load_game();
	}else if(code == 27){//ESC pressed
		game_on=false;
		stop_flag=true;
		start_page();
	}
}
