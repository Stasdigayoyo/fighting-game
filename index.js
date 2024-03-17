const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 1.5;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 619,
    y: 135,
  },
  imageSrc: "./img/shop.png",
  scale: 2.7,
  frameMax: 6,
});

const player = new Figther({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/SamuraiMack/Idle.png",
  frameMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/SamuraiMack/Idle.png",
      frameMax: 8,
    },
    run: {
      imageSrc: "./img/SamuraiMack/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./img/SamuraiMack/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./img/SamuraiMack/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./img/SamuraiMack/Attack1.png",
      frameMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      frameMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      frameMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 157,
    height: 50,
  },
});

player.draw();

const enemy = new Figther({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },

  offset: {
    x: -50,
    y: 0,
  },

  imageSrc: "./img/kenji/Idle.png",
  frameMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 168,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      frameMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      frameMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take Hit.png",
      frameMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      frameMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -172,
      y: 50,
    },
    width: 157,
    height: 50,
  },
});
enemy.draw();

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

//animation
function animate() {
  window.requestAnimationFrame(animate);
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  context.fillStyle = "rgba(255,255,255,0.1)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -10;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 10;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  //Jump player
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -10;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 10;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  //Jump enemy
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect for collision
  //player collision & enemy gets hit
  if (
    rectangularCollision({
      rentangle1: player,
      rentangle2: enemy,
    }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }
  //if player missed
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  //enemy collision & player gets hit
  if (
    rectangularCollision({
      rentangle1: enemy,
      rentangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    enemy.health -= 5;

    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }
  //if enemy missed
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  //end game based on health
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    //player keys
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -25;
        break;
      case " ":
        player.attack();
        break;
    }
  }
  //enemy keys
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -25;
        break;
      case "l":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    //enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
