
const STATE_INTRO = 'Intro'

var scaleX = 1,
  scaleY = 1,
  currentState = null,
  currentScreen = null

class Screen {
  constructor(width, height) {
    this.width = width
    this.height = height
  }

  get dimensions() {
    return [this.width, this.height]
  }
}

class IntroScreen extends Screen {
  constructor() {
    super(320, 200)
  }

  draw() {
    var gameCanvas = document.getElementById('gameCanvas');
    var ctx = gameCanvas.getContext("2d");
    ctx.scale(scaleX, scaleY)
    ctx.imageSmoothingEnabled = false

    const img = new Image()
    img.src = "./title.png"
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
    }    
  }
}

function transition(newState) {
  if (currentState == null && newState == STATE_INTRO) {
    currentScreen = new IntroScreen()
  }
  currentState = newState
}

function introScreen(ctx) {
  const img = new Image()
  img.src = "./title.png"
  img.onload = () => {
    ctx.drawImage(img, 0, 0)
  }


  // press any key or click to continue
  document.addEventListener('keydown', function () {
    console.log('A')
  })
  document.addEventListener('click', function () {
    console.log('A')
  })
}

/*
function draw() {
  var gameCanvas = document.getElementById('gameCanvas');
  var ctx = gameCanvas.getContext("2d");
  ctx.scale(scaleX, scaleY)
  ctx.imageSmoothingEnabled = false
  //ctx.fillStyle = "#FF0000";
  //ctx.fillRect(0, 10, 160, 1);

  if (gameState == 'Intro') {
    introScreen(ctx)
  }
}
*/

function resizeGame() {
  var gameArea = document.getElementById('gameArea');
  let [width, height] = currentScreen.dimensions

  var widthToHeight = width / height;
  var newWidth = window.innerWidth-10;
  var newHeight = window.innerHeight-10;
  var newWidthToHeight = newWidth / newHeight;

  console.log('window dims', newWidth,newHeight)
  
  if (newWidthToHeight > widthToHeight) {
    newWidth = newHeight * widthToHeight;
    //gameArea.style.marginTop = (-newHeight / 2) + 'px';
    let delta = window.innerWidth - newWidth
    if (delta > 0) {
      gameArea.style.marginLeft = Math.floor((window.innerWidth - newWidth) / 2) + 'px';
    } else {
      gameArea.style.marginLeft = '0px'
    }
  } else {
    newHeight = newWidth / widthToHeight;
    let delta = window.innerHeight - newHeight
    if (delta > 0) {
      gameArea.style.marginTop = Math.floor((window.innerHeight - newHeight) / 2) + 'px';
    } else {
      gameArea.style.marginTop = '0px'
    }
  }

  console.log(newWidth,newHeight)

  gameArea.style.width = newWidth + 'px';
  gameArea.style.height = newHeight + 'px';

  scaleX = newWidth / width
  scaleY = newHeight / height
  
  //gameArea.style.marginLeft = (-newWidth / 2) + 'px';
  
  var gameCanvas = document.getElementById('gameCanvas');
  gameCanvas.width = newWidth;
  gameCanvas.height = newHeight;
  currentScreen.draw()
}

transition(STATE_INTRO)
resizeGame();
window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);