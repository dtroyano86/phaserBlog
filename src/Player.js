import Phaser from 'phaser';
import MovementEntity from './MovementEntity.js';
import Bullet from './Bullet.js';

export default class Player extends MovementEntity {
  constructor(data){
    super(data);
    this.bulletTimer = null;
  }

  static preload (scene) {
    scene.load.image('ship', '/assets/P-blue-b3.png');
  }

  onDeath() {
    this.x = Math.random() * 512;
    this.y = Math.random() * 512;
    this.rotation = Math.random() * 360;
    this.health = 1;
  }

  update(bullets) {
    if (this.inputKeys.SPACE.isDown && !this.bulletTimer){
      this.bulletTimer = setTimeout(()=>{ this.bulletTimer = null; }, 300);
      const bullet = new Bullet({scene: this.scene, x: this.x, y: this.y, texture: 'playerBullet', health: 1, size: 5, isSensor: true });
      bullet.rotation = this.rotation;
      bullets.push(bullet);
    }
    if (this.inputKeys.W.isDown) {
      this.thrust(.005);
    }
    if (this.inputKeys.A.isDown) {
      this.setAngularVelocity(-.05);
    } else if (this.inputKeys.D.isDown) {
      this.setAngularVelocity(.05);
    } else {
      this.setAngularVelocity(0);
    }
  }
};