import Phaser from 'phaser';
import MovementEntity from './MovementEntity';

export default class Bullet extends MovementEntity {
  constructor(data){
    super(data);
    this.timer = setTimeout(() => this.hit(), 5000 );
    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.collider],
      callback: ({ gameObjectA, gameObjectB }) => {
        if(gameObjectB && gameObjectB.name !== 'player') {
          gameObjectB.hit();
          gameObjectA.hit();
        }
      },
      context: this.scene,
    });
  }

  static preload (scene) {
    scene.load.image(`playerBullet`, `/assets/playerBullet.png`);
  }

  onDeath() {
    this.scene.bullets = this.scene.bullets.filter(i => i !== this);
    clearTimeout(this.timer);
    this.destroy();
  }

  update() {
    this.thrust(.0005);
  }
};
