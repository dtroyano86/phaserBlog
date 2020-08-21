import Phaser from 'phaser';

const config = {
  width: 512,
  height: 512,
  backgroundColor: '#000000',
  type: Phaser.AUTO,
  parent: 'game',
  scene: [],
  scale: {
    zoom: 2
  },
};

new Phaser.Game(config);