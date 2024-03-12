//collision condition
function rectangularCollision({ rentangle1, rentangle2 }) {
  return (
    rentangle1.attackBox.position.x + rentangle1.attackBox.width >=
      rentangle2.position.x &&
    rentangle1.attackBox.position.x <=
      rentangle2.position.x + rentangle2.width &&
    rentangle1.attackBox.position.y + rentangle1.attackBox.height >=
      rentangle2.position.y &&
    rentangle1.attackBox.position.y <=
      rentangle2.attackBox.position.y + rentangle2.attackBox.position.y
  );
}

//determine Winner
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins";
  }
}

//timer
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
