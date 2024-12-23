//اللوحة
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//احجام اللاعبين
let playerWidth = 10;
let playerHeight = 50;

let player1 = {
  x: 10,
  y: boardHeight / 2 - playerHeight / 2,
  width: playerWidth,
  height: playerHeight,
};

let computerPlayer = {
  x: boardWidth - playerWidth - 10,
  y: boardHeight / 2 - playerHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: 3.2,
};

//خصائص الكرة
let ballWidth = 10;
let ballHeight = 10;
let ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: 1,
  velocityY: 2,
};

let player1Score = 0;
let computerScore = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // حدث الاستجابة لحركة الماوس
  board.addEventListener("mousemove", movePlayer);

  requestAnimationFrame(update);
};
let ballHitCounter = 0;
function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  // شكل اللاعب
  context.fillStyle = "skyblue";
  context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

  // شكل وخصائص الكمبيوتر
  context.fillStyle = "skyblue";
  computerAI();
  context.fillRect(
    computerPlayer.x,
    computerPlayer.y,
    playerWidth,
    playerHeight
  );

  // حركة الكرة
  context.fillStyle = "white";
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

  // اصطدام الكرة مع الحواف
  if (ball.y <= 0 || ball.y + ballHeight >= boardHeight) {
    ball.velocityY *= -1;
  }

  // اصطدام الكرة مع اللاعبين
  if (detectCollision(ball, player1)) {
    if (ball.x <= player1.x + player1.width) {
      ball.velocityX *= -1;
      speedUpBall();
      
    }
  } else if (detectCollision(ball, computerPlayer)) {
    if (ball.x + ballWidth >= computerPlayer.x) {
      ball.velocityX *= -1;
      speedUpBall();
      
    }
  }

  // شروط الفوز
  if (ball.x < 0) {
    computerScore++;
    resetGame(1);
  } else if (ball.x + ballWidth > boardWidth) {
    player1Score++;
    resetGame(-1);
  }

  // عرض النتيجة
  context.font = "45px sans-serif";
  context.fillText(player1Score, boardWidth / 5, 45);
  context.fillText(computerScore, (boardWidth * 4) / 5 - 45, 45);

  // رسم خط منقط منتصف اللوحة
  for (let i = 10; i < board.height; i += 25) {
    context.fillRect(board.width / 2 - 10, i, 5, 5);
  }
}

function speedUpBall() {
  // زبادة سرعه الكرة عند كل اصطدام
  const speedFactor = 0.5; // قية الزيادة
  ball.velocityX += ball.velocityX > 0 ? speedFactor : -speedFactor;
  ball.velocityY += ball.velocityY > 0 ? speedFactor : -speedFactor;
}
// function increaseComputerSpeed() {
//   ballHitCounter++;

//   // زيادة سرعه الكمبيوتر عند كل اصطدام
//   if (ballHitCounter >= 1) {
//     computerPlayer.velocityY += 1; // قيمة الزيادة
//     ballHitCounter = 0;
//   }
// }
function detectCollision(a, b) {
  return (
    //دالة التحقق من الاصطدامات
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function movePlayer(e) {
  //دالة تتبع الماوس
  let rect = board.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;

  if (mouseY > 0 && mouseY + playerHeight < boardHeight) {
    player1.y = mouseY;
  }
}

function computerAI() {
  // دالة تتبع الكمبيوتر للكرة

  if (ball.y < computerPlayer.y) {
    computerPlayer.y -= computerPlayer.velocityY;
  } else if (ball.y > computerPlayer.y + playerHeight) {
    computerPlayer.y += computerPlayer.velocityY;
  }

  // منع الكمبيوتر من الخروج خارج اللوحة

  if (computerPlayer.y < 0) {
    computerPlayer.y = 0;
  } else if (computerPlayer.y + playerHeight > boardHeight) {
    computerPlayer.y = boardHeight - playerHeight;
  }
}

function resetGame(direction) {
  ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: direction,
    velocityY: 2,
  };
}
