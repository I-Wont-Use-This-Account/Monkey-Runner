var ground,groundImage,invisGround,backgroundImage;
var monkey , monkey_running,monkeyStop;
var banana ,bananaImage, obstacle, obstacleImage;
var foodGroup, obstacleGroup;
var score = 0;
var bananas = 1;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,gameOverImage,reset,resetImage;
var soundEffectDeath,soundEffectJump,soundEffectCheckpoint; 

function preload(){
  
  groundImage = loadImage("ground2.png");
  
  backgroundImage = loadImage("jungle.jpg");
  
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  monkeyStop = loadAnimation("sprite_7.png");
  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
 
  gameOverImage = loadImage("gameOver.png");
  resetImage = loadImage("restart.png");
  
  soundEffectDeath = loadSound("die.mp3");
  soundEffectJump = loadSound("jump.mp3");
  soundEffectCheckpoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(400,300);
  
  //backgroundPic = createSprite(200,150,900,10);
  //backgroundPic.addImage("backGround",backgroundImage);
  
  ground = createSprite(350,100,900,10);
  ground.addImage("ground",backgroundImage);
  ground.velocityX = -(4.5 + score*960);
  invisGround = createSprite(60,350,100,125);
  
  monkey = createSprite(60,250,20,20);
  monkey.addAnimation("monkeyTrex",monkey_running);
  monkey.addAnimation("monkeyMotionless",monkeyStop);
  monkey.scale = 0.125;
  
  gameOver = createSprite(200,125);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  
  reset = createSprite(200,150);
  reset.addImage(resetImage);
  reset.scale = 0.5;
  
  foodsGroup = new Group();
  obstaclesGroup = new Group();
}

function draw() {
  background(75,139,59);
  
  ground.scale = 0.75;
  
  invisGround.visible = false;
  
  monkey.collide(invisGround);
  
  if(gameState === PLAY){
  
    gameOver.visible = false;
    reset.visible = false;
  
    //ground.velocityX = -(4.5 + score*960);
    
    score = score + Math.round(getFrameRate()/60);
    
    //console.log(score);
    
    if(bananas < 1){
      gameState = END;
      soundEffectDeath.play();
    }
    
    if(keyWentDown("space")&&monkey.y>224||keyWentDown("up_arrow")&&monkey.y>224){
      monkey.velocityY = -15.5;
      soundEffectJump.play();
      //monkey.changeAnimation("monkeyMotionless",monkeyStop);
    }
    else{
      monkey.velocityY = monkey.velocityY + 0.98
      //monkey.changeAnimation("monkeyTrex",monkey_running);
    }
    
    //if(monkey.collide(invisGround)){
      //monkey.changeAnimation("monkeyTrex",monkey_running);
    //}
    
    if (ground.x < 15){
      ground.x = 350;
    }
  
    if(monkey.isTouching(foodsGroup)){
      bananas = bananas + 1;
      foodsGroup.destroyEach();
      soundEffectCheckpoint.play();
    }
    
    if(monkey.isTouching(obstaclesGroup)){
      bananas = bananas - 1;
      obstaclesGroup.destroyEach();
    }
        
  spawnFruit();
  spawnObstacles();
    
  }
  else if(gameState === END){
    
    gameOver.visible = true;
    reset.visible = true;
    
    monkey.velocityY = 0;
    monkey.changeAnimation("monkeyMotionless",monkeyStop);
    
    ground.velocityX = 0;
    
    obstaclesGroup.setVelocityXEach(0);
    
    foodsGroup.setVelocityXEach(0);
    foodsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(reset)||keyWentDown("space")){
      bananas = 1;
      score = 0;
      
      monkey.changeAnimation("monkeyTrex",monkey_running);
      
      ground.velocityX = -(4.5 + score*960);
      
      gameState = PLAY;
      
      foodsGroup.destroyEach();
      obstaclesGroup.destroyEach();
      
      foodsGroup.setLifetimeEach(150);
      obstaclesGroup.setLifetimeEach(150);
    }
  }
  
  drawSprites();
  
  text("Survival Time: " + score, 10,15);
  text("Bananas(Lives): " + bananas, 300,15);
}

function spawnFruit(){
  if (frameCount % 150 === 0) {
    banana = createSprite(450,20);
    banana.addImage("fruit",bananaImage);
    banana.scale = 0.1;
    banana.lifetime = 150;
    banana.y = Math.round(random(120,200))
    banana.velocityX = -(4 + 1.5*score/100);
    
    foodsGroup.add(banana);
  }
}
  
function spawnObstacles(){
  if (frameCount % 80 === 0) {
    obstacle = createSprite(450,275);
    obstacle.addImage("rock",obstacleImage);
    obstacle.scale = 0.1;
    obstacle.lifetime = 150;
    obstacle.velocityX = -(4 + 1.5*score/100);
    
    obstaclesGroup.add(obstacle);
  }
}