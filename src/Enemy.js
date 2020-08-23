import Phaser from 'phaser';
import MovementEntity from './MovementEntity';

export default class Enemy extends MovementEntity {
  constructor(data){
    super(data);
    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.collider],
      callback: other => {
        if(other.gameObjectB && other.gameObjectB.name === 'player') {
          other.gameObjectB.hit();
        }
      },
      context: this.scene,
    });
  }

  static preload (scene, color) {
    scene.load.image(`${color}Enemy`, `/assets/${color}Enemy.png`);
  }

  onDeath() {
    this.scene.enemies = this.scene.enemies.filter(i => i !== this);
    this.destroy();
  }

  update(player) {
    const direction = player.position.subtract(this.position);
    this.setVelocityX(direction.x);
    this.setVelocityY(direction.y);
    this.rotation = Phaser.Math.Angle.BetweenPoints(this.position, player.position);
  }
};