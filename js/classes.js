class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frameMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frameMax = frameMax;
    this.frameCurrent = 0;
    this.frameEllapsed = 0;
    this.frameHold = 5;
    this.offset = offset;
  }
  draw() {
    context.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frameMax),
      0,
      this.image.width / this.frameMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frameMax) * this.scale,
      this.image.height * this.scale
    );
  }
  animateFrames() {
    this.frameEllapsed++;
    if (this.frameEllapsed % this.frameHold === 0) {
      if (this.frameCurrent < this.frameMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }
  update() {
    this.draw();
    this.animateFrames();
  }
}
class Figther extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    frameMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    super({
      position,
      imageSrc,
      scale,
      frameMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.isAttacking;
    this.color = color;
    this.health = 100;
    this.frameCurrent = 0;
    this.frameEllapsed = 0;
    this.frameHold = 3;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //function gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }
  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.frameCurrent < this.sprites.attack1.frameMax - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frameMax = this.sprites.idle.frameMax;
          this.frameCurrent = 0;
        }

        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frameMax = this.sprites.run.frameMax;
          this.frameCurrent = 0;
        }

        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frameMax = this.sprites.jump.frameMax;
          this.frameCurrent = 0;
        }
        break;

      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frameMax = this.sprites.fall.frameMax;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frameMax = this.sprites.attack1.frameMax;
        }
        break;
    }
  }
}
