# Setting up a Phaser 3 Project using the Matter Physics Plugin

Phaser 3 is an open source JavaScript video game framework made to run in browsers.

It's easy to use, and if you know JavaScript, should be a breeze to start learning.

We're going to be setting it up with the Matter physics plugin, this will give us quick and easy access to collision detection and movement for our game objects.
___
Let's go through the basic setup that you'll need for basically any Phaser 3 project.

To start off, you're going to need to [import Phaser 3](1), either through their CDN or by importing it as a package. We'll also need to create a html file that has a `<div id="app"></div>` and imports your index.js. Whenever you want to run your game just use live-server to host your index.html file.

We're also going to need to import the Matter physics engine for Phaser 3. You can get it [here](2). This is going to let us get some cool physics up and running fast.

And now we need to setup our index.js file.
```javascript
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
```
Here we are just initially setting up the look of the Phaser game canvas. Most notably, we're setting the size and color. And then we're doing some initial set up on the Matter plugin. We want the y gravity to be 0 because we're going to be making a game in space, so we don't want any gravity.
___
Now let's set up our scene, which will handle all our game logic. In a more advanced game, you can have multiple scenes, but for ours, we only need one.
```javascript
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // Called before the scene is created
    //  used to load assets
  }

  create() {
    // Called once when the scene is made
    //  used to do any initial setup of the scene
  }

  update() {
    // Called every game step
    //  used to update the game elements
  }
}
```
Notice that our scene is using `class` and is extending `Phaser.Scene` so we need a constructor method and we want to call super so that we can start using `this` to refer to this scene. We also set up a few more methods that are going to be useful for a scene.

Ok, now we're ready to start really diving into how Phaser 3 works. Check out my next article to see how you can really reinforce JavaScript fundamentals with Phaser 3.

[1]:https://phaser.io/phaser3/gettingstarted
[2]:https://github.com/mikewesthad/phaser-matter-collision-plugin