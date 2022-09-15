const size = 90;
const N = 8;
const M = 7;
const delta = size / 10;
const acel = delta * 5;
const AIR = 1.5;

let game;

function init() {
  game = {
    board: {
      width: M * size,
      height: N * size,
    },
    player: {
      x: 0,
      y: 0,
      size: 1 * size,
      div: document.getElementById("player"),
      bearing: "w",
    },
    enemy: {
      x: 0,
      y: 0,
      size: 1.2 * size,
      div: document.getElementById("enemy"),
    },

    score: 0,
    lives: 3,
    enemyUpdateEnemy: undefined,
  };
}
function doIt() {
  init();
  showScore();
  showLives();
  const theBoard = document.getElementById("container");
  theBoard.style.width = game.board.width + "px";
  theBoard.style.height = game.board.height + "px";

  //Middle Position

  game.player.x = Math.round((game.board.width - game.player.size) / 2);
  game.player.y = Math.round((game.board.height - game.player.size) / 2);

  resetPlayerPosition();
  positionEnemy();

  draw(game.player);
  draw(game.enemy);

  var gameOverDiv = document.getElementById("game-over");
  gameOverDiv.style.top =
    Math.round((game.board.height - gameOverDiv.clientHeight) / 2) + "px";
  gameOverDiv.classList.add("nodisp");

  document.onkeydown = move;

  game.enemyUpdateEnemy = setInterval(updateEnemy, 2000);
}

function updateEnemy() {
  positionEnemy();
  draw(game.enemy);
}

function resetPlayerPosition() {
  game.player.x = Math.round((game.board.width - game.player.size) / 2);
  game.player.y = Math.round((game.board.height - game.player.size) / 2);
}

function positionEnemy() {
  do {
    game.enemy.x = numeroAlazarDentroDelRango(
      0,
      game.board.width - game.enemy.size
    );
    game.enemy.y = numeroAlazarDentroDelRango(
      0,
      game.board.height - game.enemy.size
    );
  } while (collision(game.enemy, game.player));

}

function collision(obj1, obj2, air = AIR) {
  return (
    obj1.x >= obj2.x - obj1.size * air &&
    obj1.x <= obj2.x + obj1.size * air &&
    obj1.y >= obj2.y - obj1.size * air &&
    obj1.y <= obj2.y + obj1.size * air
  );
}

function draw(who) {
  who.div.style.width = who.size + "px";
  who.div.style.height = who.size + "px";

  who.div.style.left = who.x + "px";
  who.div.style.top = who.y + "px";

  if (who.bearing) {
    who.div.setAttribute("class", who.bearing);
  }
}

function move(evt) {
  const realDelta = evt.shiftKey ? acel : delta;
  switch (evt.code) {
    case "ArrowLeft":
      if (game.player.x - realDelta >= 0) {
        game.player.x -= realDelta;
      } /*if (evt.shiftKey) */ else {
        /*game.player.x = 0;*/ die();
      }
      game.player.bearing = "w";
      break;
    case "ArrowRight":
      if (game.player.x + realDelta <= game.board.width - game.player.size) {
        game.player.x += realDelta;
      } /*if (evt.shiftKey)*/ else {
        die();
        /*game.player.x = game.board.width - game.player.size;*/
      }
      game.player.bearing = "e";
      break;
    case "ArrowUp":
      if (game.player.y - realDelta >= 0) {
        game.player.y -= realDelta;
      } /*if (evt.shiftKey)*/ else {
        die();
        /* game.player.y = 0;*/
      }
      game.player.bearing = "n";
      break;
    case "ArrowDown":
      if (game.player.y + realDelta <= game.board.height - game.player.size) {
        game.player.y += realDelta;
      } /*if (evt.shiftKey) */ else {
        die();
        /*game.player.y = game.board.height - game.player.size;*/
      }
      game.player.bearing = "s";
      break;
  }
  draw(game.player);
  if (collision(game.enemy, game.player, 0.7)) {
    score();
    setTimeout(function () {
      updateEnemy();
    }, 20);
  }
}

function numeroAlazarDentroDelRango(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showScore() {
  let scoreElement = document.getElementById("score");
  scoreElement.innerHTML = `Score: ${game.score}`;
}

function showLives() {
  let livesElement = document.getElementById("lives");
  livesElement.innerHTML = `Vidas: ${game.lives}`;
  if (game.lives == 1) {
    livesElement.style.color = "red";
    livesElement.style.fontStyle = "italic";
  }
}
function score() {
  game.score += 100;
  showScore();
}

function die() {
  game.lives -= 1;
  showLives();
  if (game.lives === 0) {
    gameOver();
  } else {
    resetPlayerPosition();
  }
}

function gameOver() {
  clearInterval(game.enemyUpdateInterval); //block enemy movement
  document.onkeydown = null; //block player move
  document.getElementById("game-over").style.color = "white";
  document.getElementById("game-over").classList.remove("nodisp");
  document.getElementById("btn-play").style.display = "block";
}

function playAgain() {
  document.getElementById("lives").style.color = "white";
  document.getElementById("btn-play").style.display = "none";
  doIt();
}

document.getElementById("btn-play").addEventListener("click", function () {
  playAgain();
});
