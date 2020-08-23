# Javascript Fundamentals with Phaser 3

Lately I've been working with React a lot so I haven't been writing much actual JavaScript code. But thankfully, I've been learning Phaser 3 on the side and as it turns out, that is a great way to reinforce JavaScript fundamentals.

Most prominently, Phaser 3 requires a solid understanding of `this` but it also makes heavy use of the ES6 PseudoClassical instantiation pattern. 

This walk through is designed to show you how to make a simple spaceship game, but more importantly reinforce some core JavaScript concepts. So for the sake of keeping this concise I'm going to brush past a lot of intro Phaser concepts and focus on the parts that emphasize JavaScript core concepts.
___
I'm going to assume you've already followed all the steps in the first part of this series. And you already have an empty scene set up.

Most of what we're going to do in our scene is going to involve our game objects, so let's make those first. Since we have several things that we want to be able to move around and hit and potentially die, let's make one object that does all those things that the others can inherit from!

So make a MovementEntity.js.
```javascript
import Phaser from 'phaser';

export default class MovementEntity extends Phaser.Physics.Matter.Image {
  constructor(data){
    const { scene, x, y, texture, name, health } = data;
    super(scene.matter.world, x, y, texture);
    this.x = x;
    this.y = y;
    this.health = health;
    this._position = new Phaser.Math.Vector2(this.x, this.y);
    this.name = name;
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    this.collider = Bodies.circle(x, y, 24, {
      isSensor: false,
      label: `${name}Collider`
    });
    const compoundBody = Body.create({
      parts: [this.collider],
      frictionAir: .3,
    });
    this.setExistingBody(compoundBody);
    this.scene.add.existing(this);
  }
};
```
We will declare these objects with the keyword `New` so we've made this a class that extends a Matter Physics Image, because we want it to have physics. Note how we're destructuring what we want out of the data we get from our constructor and passing it back into super. Then we start using `this` to set up all of the variables we want every MovementEntity to have.

I'm not going to go into how to make a collider, but know that it's what we're using for hit detection. We then attach it to our object and add the MovementEntity to the scene.

However, we're going to need a couple more methods. Let's set up two getters, one so that we can always have access to the object's position, and one to know if it has run out of health.
```javascript
get position() {
  this._position.set(this.x, this.y);
  return this._position;
}

get dead() {
  return this.health <= 0;
}
```
We'll also want a method to call when an object gets hit, since that should be the same for everything, and then a default onDeath method so our code doesn't break if we forget to add one to each child of this class.
```javascript
hit() {
  this.health--;
  if(this.dead) {
    this.onDeath();
  }
}
onDeath() {}
```
Now we can easily set up our Player class to extend our MovementEntity and most of the logic is already there. We'll give it a custom onDeath method to randomly spawn somewhere else. And we'll also add a `static` method to load the image we're using for the Player. In case you don't know, a `static` method only exists on the class itself and not each instance of the class.
```javascript
import MovementEntity from './MovementEntity';

export default class Player extends MovementEntity {
  constructor(data){
    super(data);
  }

  static preload (scene) {
    scene.load.image('ship', '/assets/player.png');
  }

  onDeath() {
    this.x = Math.random() * 512;
    this.y = Math.random() * 512;
    this.rotation = Math.random() * 360;
    this.health = 1;
  }

  update() { // This is our movement code
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
```
And now our Enemy class! In our constructor we need to set up a collider to check if the Enemy has run into the player. And in our preload method we need to dynamically load the enemy asset based on its color.
```javascript
import Phaser from 'phaser';
import MovementEntity from './MovementEntity';

export default class Enemy extends MovementEntity {
  constructor(data){
    super(data);
    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.collider],
      callback: ({ gameObjectB }) => {
        if(gameObjectB && gameObjectB.name === 'player') {
          gameObjectB.hit();
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

  update(player) { // This is how our enemy follows the player
    const direction = player.position.subtract(this.position);
    this.setVelocityX(direction.x);
    this.setVelocityY(direction.y);
    this.rotation = Phaser.Math.Angle.BetweenPoints(this.position, player.position);
  }
};
```
Now that we have the bones of our Player and Enemy Objects, let's set them up in our scene.

I've got two images for enemy ships, pink and blue, so real quick let's add an array with that information to our scene's constructor. We're also going to want an empty array to track all the enemies in our scene, so let's set that up as well.
```javascript
this.enemyColors = ['blue', 'pink'];
this.enemies = [];
```
In the Scene's preload method we want to call the preload methods for our Player and our Enemies. This loads the Player's image into the scene statically and the Enemie's dynamically.
```javascript
preload() {
  Player.preload(this);
  this.enemyColors.forEach(color => Enemy.preload(this, color));
}
```
Now we need to make a Player and some Enemies. We'll save the Player to a variable so the scene can track them, and we'll add all the Enemies to the array we set up earlier.
```javascript
create() {
  this.player = new Player({
    scene: this, x: 40, y: 40, texture: 'ship', name: 'player', health: 1
    });
  this.enemies.push(...this.enemyColors.map(color =>  new Enemy({
    scene: this, 
    x: Math.random() * 512, 
    y: Math.random() * 512, 
    texture: `${color}Enemy`, 
    name: `${color}Enemy`, 
    health: 2
  })));
  // This gets the movement keys for the player
  this.player.inputKeys = this.input.keyboard.addKeys('W,A,D');
}
```
Now that our player and our enemies are added to the scene, we just need to call their update methods in the scene's update method. Make sure to remember to call every enemy in the array.
```javascript
update() {
  this.player.update();
  this.enemies.forEach(i => i.update(this.player));
}
```
As you can see, to use Phaser you really need to have a firm grasp on what `this` is doing and to really understand how ES6 PseudoClassical instantiation works. But just remember, it's all JavaScript. And learning to make simple games in Phaser 3 is fun practice for reinforcing how JavaScript behaves.