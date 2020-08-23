import Phaser from 'phaser';

export default class MovementEntity extends Phaser.Physics.Matter.Image {
  constructor(data){
    let { scene, x, y, texture, name, health, size = 24, isSensor } = data;
    super(scene.matter.world, x, y, texture);
    this.x = x;
    this.y = y;
    this.health = health;
    this._position = new Phaser.Math.Vector2(this.x, this.y);
    // this.setFixedRotation();
    this.setScale(.1);
    this.name = name;
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    this.collider = Bodies.circle(x, y, size, {isSensor, label: `${name}Collider`});
    const compoundBody = Body.create({
      parts: [this.collider],
      frictionAir: .3,
    });
    this.setExistingBody(compoundBody);
    this.scene.add.existing(this);
  }

  get position() {
    this._position.set(this.x, this.y);
    return this._position;
  }

  get dead() {
    return this.health <= 0;
  }

  onDeath() {
    console.log(`${this.name} has died`)
  }

  hit() {
    this.health--;
    if(this.dead) {
      this.onDeath();
    }
  }

};