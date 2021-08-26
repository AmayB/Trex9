//sun and windowed
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var trex, trex_running, trex_collided;
var ground, groundImage, invisibleGround;
var cloudsGroup, cloudImagel
var obstacleGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var score = 0;
var gameover, restart;
var backgroundImage;

function preload() {
  trex_running = loadAnimation("trex_1.png", "trex_2.png", "trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  backgroundImage = loadImage("backgroundImg.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.1;
  trex.x = 50;

  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100);
  ground.scale = 1;

  gameover = createSprite(width/2,height/2- 50);
  gameover.addImage(gameoverImage);
  gameover.visible = false;
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.visible = false;
  gameover.scale = 0.3;
  restart.scale = 0.3;

  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstacleGroup = new Group();

  score = 0
}

function draw() {
  background(backgroundImage);
  text("Score: " + score, 500, 50);

  if(gamestate === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + 3 * score / 100);
    trex.changeAnimation("running", trex_running);

    if (keyDown("space") && trex.y >= 559) {
      trex.velocityY = -12;
    }

    trex.velocityY = trex.velocityY + 0.8;

    if(ground.x < 0) {
      ground.x = ground.width/2;
    }

    trex.collide(invisibleGround);

    cloudSpawn();
    obstacleSpawn();

    if (obstacleGroup.isTouching(trex)) {
      gamestate = END;
    }
  }
  else if (gamestate === END) {
    gameover.visible = true;
    restart.visible = true;

    trex.velocityY = 0;
    ground.velocityX = 0;

    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function cloudSpawn() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(900,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.liftime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }

}

function reset() {
  gamestate = PLAY;
  gameover.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function obstacleSpawn() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(900, 610, 10, 40);
    obstacle.velocityX = -(6 + 3 * score / 100);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      default: break;
    }
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacleGroup.add(obstacle);
  }
}