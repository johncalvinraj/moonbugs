
const STATE_INTRO = 'Intro',
      STATE_GAME = 'Game'

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

  destroy() {}
}

class IntroScreen extends Screen {
  constructor() {
    super(320, 200)
    document.addEventListener('keydown', this.handleKey)
    document.addEventListener('click', this.handleKey)
  }

  handleKey() {
    console.log('Press')
    transition(STATE_GAME)
  }

  draw() {
    var gameCanvas = document.getElementById('gameCanvas');
    var ctx = gameCanvas.getContext("2d");
    ctx.scale(scaleX, scaleY)
    ctx.imageSmoothingEnabled = false

    const img = new Image()
    img.src = "./assets/title.png"
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
    }    
  }

  destroy() {
    document.removeEventListener("keydown", this.handleKey);
    document.removeEventListener("click", this.handleKey);
  }
}

class GameScreen extends Screen {
  constructor() {
    super(160, 100)
    
    document.addEventListener('keydown', this.handleKey)

    var gameCanvas = document.getElementById('gameCanvas');
    var ctx = gameCanvas.getContext("2d");
    this.backgroundImg = new Image()
    this.backgroundImg.src = "./assets/sprite.png"
    this.tick = 0
    this.dir = 0
    this.craftX = 25;

    ctx.imageSmoothingEnabled = false

    resizeGame()
    ctx.scale(scaleX, scaleY)
    let fps = 60;

    function redraw() {
      setTimeout(function(){ //throttle requestAnimationFrame to 24fps
        window.requestAnimationFrame(resizeGame);
        redraw()
      }, 1000/fps)   
    }

    redraw()
  
  }

  handleKey(event) {
    if (event.key == 'ArrowLeft' ) {
      if (currentScreen.craftX > 25) {
        currentScreen.craftX -= 5
      }
    }
    if (event.key == 'ArrowRight' ) {
      if (currentScreen.craftX < 150) {
        currentScreen.craftX += 5
      }
    }    
    console.log('Press')
  }

  draw() {
    currentScreen.tick++
    
    var gameCanvas = document.getElementById('gameCanvas');
    var ctx = gameCanvas.getContext("2d");    

    ctx.scale(scaleX, scaleY)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(currentScreen.backgroundImg, 0, 0)
      
    ctx.fillStyle = "#aa0000";

    let n = currentScreen.tick
    n = n % 120
    if (n == 0) {
      currentScreen.dir = 1 - currentScreen.dir
    }
    let x = n
    if (currentScreen.dir) x = 120 - x

    ctx.fillRect(15, 98, x, 1);

    ctx.drawImage(currentScreen.backgroundImg, 9, 101, 5, 3, currentScreen.craftX, 91, 5, 3)

  }

  destroy() {
  }
}

function transition(newState) {
  console.log(currentState, newState);
  if (currentState == null && newState == STATE_INTRO) {
    currentScreen = new IntroScreen()
  } else if (currentState == STATE_INTRO && newState == STATE_GAME) {
    console.log('game')
    currentScreen.destroy()
    currentScreen = new GameScreen()
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
  //console.log('dim:', width,height)
  var widthToHeight = width / height;
  var newWidth = window.innerWidth-10;
  var newHeight = window.innerHeight-10;
  var newWidthToHeight = newWidth / newHeight;

  //console.log('window dims', newWidth,newHeight)
  
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

  //console.log(newWidth,newHeight)

  gameArea.style.width = newWidth + 'px';
  gameArea.style.height = newHeight + 'px';

  scaleX = newWidth / width
  scaleY = newHeight / height
  //console.log('scales', scaleX, scaleY)
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