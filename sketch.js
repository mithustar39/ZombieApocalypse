var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;
var alien, alienImg;
var edge;
var heart1,heart1Img,heart2,heart2Img,heart3,heart3Img;
var zombieGroup,alienGroup;
var bulletImg,bullet,bulletGroup;
var reset,resetImg;
var life = 3;
var gameState = "play";
var play = 1;
var end = 0;
var gameOver,gameOverImg;
var score;
var explosion,explosionSound;
var loseSound;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");

  zombieImg = loadImage("assets/zombie.png");

  alienImg = loadImage("assets/alien.png");

  bgImg = loadImage("assets/bg.jpeg");

  heart1Img = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");

  bulletImg = loadImage("assets/bullet.png");

  resetImg = loadImage("assets/reset.png");
  
  gameOverImg = loadImage("assets/gameover.png");

  explosionSound = loadSound("assets/explosion.mp3")
  loseSound = loadSound("assets/lose.mp3")
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1

gameOver = createSprite(windowWidth/2,windowHeight/2-100);
gameOver.addImage("gameover",gameOverImg);
gameOver.scale=0.5;
gameOver.visible = false;

//creating the player sprite
   player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
    player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = false
   player.setCollider("rectangle",0,0,300,300)

  zombieGroup = new Group();  
  alienGroup = new Group();
  bulletGroup = new Group();

  heart1 = createSprite(displayWidth - 75,40,20,20);
    heart1.addImage("heart1",heart1Img);
    heart1.scale = 0.2;
    heart1.visible = false;

    heart2 = createSprite(displayWidth - 75,40,20,20);
    heart2.addImage("heart2",heart2Img);
    heart2.scale = 0.2;
    heart2.visible = false;

    heart3 = createSprite(displayWidth - 75,40,20,20);
    heart3.addImage("heart3",heart3Img);
    heart3.scale = 0.2;

    reset = createSprite(windowWidth/2,windowHeight/2,20,20);
   reset.addImage("reset",resetImg);
   reset.scale=0.3;
}
function draw() {
  background(0);
    textSize(20);
    fill("white");
     text("Score : "+score,displayWidth-75,displayHeight/2-200);

  if(gameState === "play"){
    reset.visible = false;
    if(keyDown("UP_ARROW")||touches.length>0){
      player.y = player.y-30
    }
  
    if(keyDown("DOWN_ARROW")||touches.length>0){
     player.y = player.y+30
    }
  
    if(keyDown("LEFT_ARROW")||touches.length>0){
      player.x = player.x-30
     }
  
     if(keyDown("RIGHT_ARROW")||touches.length>0){
      player.x = player.x+30
     }

     spawnAliens();
     spawnZombies();
     reset.visible = false;
     gameOver.visible = false;

     if(zombieGroup.isTouching(player)){
      for(var i=0; i<zombieGroup.length;i++){
        if(zombieGroup[i].isTouching(player)){
          zombieGroup[i].destroy();
          life = life - 1;
          if(life ===2){
            heart3.visible = false;
            heart2.visible = true;
          }
          if(life ===1){
            heart2.visible = false;
            heart1.visible = true;
          }
          else if(life ===0){
           heart1.visible = false;
           gameState = "end";
          }
        }
      }
    }

    //alien takes away all three lives
    if(alienGroup.isTouching(player)){
      for(var i=0; i<alienGroup.length;i++){
        if(alienGroup[i].isTouching(player)){
          alienGroup[i].destroy();
          life = life - 3;
          if(life<1){
            heart1.visible = false;
            heart2.visible = false;
            heart3.visible = false;
            gameState="end";
          }
        }
      }
    }
    
    if(alienGroup.isTouching(player)){
      for(var i=0; i<alienGroup.length;i++){
        if(alienGroup[i].isTouching(player)){
          alienGroup[i].destroy();
        }
      }
    }

    if(alienGroup.isTouching(bulletGroup)){
      for(var i=0; i<alienGroup.length;i++){
        if(alienGroup[i].isTouching(bulletGroup)){
          alienGroup[i].destroy();
          bulletGroup.destroyEach();
          explosionSound.play();
          score= score + 10;
        }
      }
    }
    if(zombieGroup.isTouching(bulletGroup)){
      for(var i=0; i<zombieGroup.length;i++){
        if(zombieGroup[i].isTouching(bulletGroup)){
          zombieGroup[i].destroy();
          bulletGroup.destroyEach();
          explosionSound.play();
          score= score + 5;
        }
      }
    }

    if(keyWentDown("space")){
 
      player.addImage(shooter_shooting)
      shootBullet();
    }
    else if(keyWentUp("space")){
      player.addImage(shooterImg)
    }
 
  }


  else if(gameState === "end"){
    reset.visible = true;
    gameOver.visible = true;
    zombieGroup.destroyEach();
    alienGroup.destroyEach();
    loseSound.play();
    if(mousePressedOver(reset)){
    resetButton();
    }
  }

 
  drawSprites();
}
 function spawnZombies(){
  if(frameCount%100 === 0){
  zombie = createSprite(random(700,1000), random(150,550), 20, 20);
  zombie.addImage("zombie",zombieImg);
  zombie.scale=0.15;
  zombie.velocityX = -3;
  zombieGroup.add(zombie);
  zombie.debug = false;
  zombie.setCollider("rectangle",0,0,550,900)
  zombie.lifetime = 400;
  }
}

 function spawnAliens(){
  if(frameCount%200 === 0){
  alien = createSprite(random(900,1200),random(200,400), 20, 20);
  alien.addImage("alien",alienImg);
  alien.scale=0.6;
  alien.velocityX = -5;
  alienGroup.add(alien);
  alien.debug = false;
  alien.setCollider("rectangle",0,0,120,200)
  alien.lifetime = 400;
  }
 }

 function shootBullet(){
  bullet= createSprite(150, width/2, 50,20)
  bullet.y= player.y-20;
  bullet.x= player.x-20;
  bullet.addImage(bulletImg)
  bullet.scale=0.12
  bullet.velocityX= 7;
  bullet.lifetime = 400;
  bulletGroup.add(bullet);
 }

 function resetButton(){
     gameState="play";
     heart3.visible = true;
     player.x=displayWidth-1150;
     player.y=displayHeight-300;
 }