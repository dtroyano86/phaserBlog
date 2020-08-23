import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import GameScene from './GameScene';

const config = {
  width: 512,
  height: 512,
  backgroundColor: '#000000',
  type: Phaser.AUTO,
  parent: 'game',
  scene: [GameScene],
  scale: {
    zoom: 1
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0 },
      debug: false,
    }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision'
      }
    ]
  }
};

new Phaser.Game(config);