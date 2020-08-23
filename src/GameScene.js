import Phaser from 'phaser';
import Player from './Player.js';
import Enemy from './Enemy.js';
import Bullet from './Bullet.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.enemies = [];
    this.bullets = [];
    this.enemyColors = ['pink', 'blue']
    setInterval(() => {
      const color = this.enemyColors[Math.floor(Math.random() * 2)];
      this.enemies.push(new Enemy({
        scene: this, x: Math.random() * 512, y: Math.random() * 512, texture: `${color}Enemy`, name: color, health: 2
      }));
    }, 5000);
  }

  preload() {
    Player.preload(this);
    Bullet.preload(this);
    this.enemyColors.forEach(color => Enemy.preload(this, color));
  }

  create() {
    this.player = new Player({scene: this, x: 40, y: 40, texture: 'ship', name: 'player', health: 1});
    this.enemies.push(...this.enemyColors.map(color =>  new Enemy({
      scene: this, x: Math.random() * 512, y: Math.random() * 512, texture: `${color}Enemy`, name: color, health: 2
    })))
    this.player.inputKeys = this.input.keyboard.addKeys('W,A,D, SPACE');
    this.matter.world.setBounds(0,0,512,512);
  }

  update() {
    this.player.update(this.bullets);
    this.bullets.forEach(i => i.update());
    this.enemies.forEach(i => i.update(this.player));
  }
}