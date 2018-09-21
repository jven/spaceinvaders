spaceinvaders.model.Map = function(maxX, maxY) {
  this.maxX = maxX;
  this.maxY = maxY;
};

spaceinvaders.model.GoodGuy = function(
    gameObject,
    weaponMaxCooldownMs,
    weaponVelocityPerMs,
    movementVelocityPerMs) {
  this.gameObject = gameObject;
  this.weaponMaxCooldownMs = weaponMaxCooldownMs;
  this.weaponVelocityPerMs = weaponVelocityPerMs;
  this.movementVelocityPerMs = movementVelocityPerMs;
  this.weaponCooldownMs = 0;
  this.movingUp_ = false;
  this.movingRight_ = false;
  this.movingDown_ = false;
  this.movingLeft_ = false;
};

spaceinvaders.model.GoodGuy.prototype.setMovingUp = function(moving) {
  this.movingUp_ = moving;
};

spaceinvaders.model.GoodGuy.prototype.setMovingRight = function(moving) {
  this.movingRight_ = moving;
};

spaceinvaders.model.GoodGuy.prototype.setMovingDown = function(moving) {
  this.movingDown_ = moving;
};

spaceinvaders.model.GoodGuy.prototype.setMovingLeft = function(moving) {
  this.movingLeft_ = moving;
};

spaceinvaders.model.GoodGuy.prototype.update = function(timeElapsedMs) {
  var dx = 0;
  var dy = 0;
  if (this.movingLeft_ && !this.movingRight_) {
    dx = -this.movementVelocityPerMs * timeElapsedMs;
  }
  if (this.movingRight_ && !this.movingLeft_) {
    dx = this.movementVelocityPerMs * timeElapsedMs;
  }
  if (this.movingUp_ && !this.movingDown_) {
    dy = -this.movementVelocityPerMs * timeElapsedMs;
  }
  if (this.movingDown_ && !this.movingUp_) {
    dy = this.movementVelocityPerMs * timeElapsedMs;
  }
  if (dx * dy != 0) {
    dx *= 0.75;
    dy *= 0.75;
  }
  var newX = this.gameObject.position.x + dx;
  var newY = this.gameObject.position.y + dy;
  this.gameObject.position.x = Math.min(
      this.gameObject.map.maxX - this.gameObject.shape.widthX,
      Math.max(0, newX));
  this.gameObject.position.y = Math.min(
      this.gameObject.map.maxY - this.gameObject.shape.widthY,
      Math.max(0, newY));
};

spaceinvaders.model.Enemy = function(
    gameObject,
    weaponProbability,
    marchWidth,
    marchVelocityPerMs) {
  this.gameObject = gameObject;
  this.weaponProbability = weaponProbability;
  this.marchWidth = marchWidth;
  this.marchVelocityPerMs = marchVelocityPerMs;
  this.marchDirection = 1;
  this.distanceUntilSwitchDirection = marchWidth / 2;
};

spaceinvaders.model.Enemy.prototype.update = function(timeElapsedMs) {
  var marchDistance = this.marchVelocityPerMs * timeElapsedMs;
  while (marchDistance > 0) {
    var go = Math.min(this.distanceUntilSwitchDirection, marchDistance);
    this.gameObject.position.x += this.marchDirection * go;
    marchDistance -= go;
    this.distanceUntilSwitchDirection -= go;
    if (this.distanceUntilSwitchDirection <= 0) {
      this.marchDirection *= -1;
      this.distanceUntilSwitchDirection = this.marchWidth;
    }
  }
};

// spaceinvaders.model.Bullet = function(gameObject, velocityPerMs) {
//   this.gameObject = gameObject;
//   this.velocityPerMs = velocityPerMs;
// };

spaceinvaders.model.GameObject = function(map, birthdayMs, shape, position) {
  this.map = map;
  this.birthdayMs = birthdayMs;
  this.shape = shape;
  this.position = position;
};

spaceinvaders.model.Model = function(map, goodGuy, enemies) {
  this.map = map;
  this.goodGuy = goodGuy;
  this.enemies = enemies;
  this.timeMs = 0;
};

spaceinvaders.model.Model.prototype.update = function(timeElapsedMs) {
  // Update the good guy.
  this.goodGuy.update(timeElapsedMs);

  // Update the enemies.
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].update(timeElapsedMs);
  }

  this.timeMs += timeElapsedMs;
};

spaceinvaders.model.Model.createDefault = function() {
  var mapMaxX = 400;
  var mapMaxY = 600;
  var goodGuyWidthX = 20;
  var goodGuyWidthY = 5;
  var numEnemyRows = 4;
  var enemiesPerRow = 5;
  var enemyWidthX = 30;
  var enemyWidthY = 20;
  var enemyGap = 20;
  var enemyRowLeft = (mapMaxX - (
      enemiesPerRow * enemyWidthX + (enemiesPerRow - 1) * enemyGap)) / 2;

  var map = new spaceinvaders.model.Map(mapMaxX, mapMaxY);
  var goodGuy = new spaceinvaders.model.GoodGuy(
      new spaceinvaders.model.GameObject(
          map,
          0 /* birthdayMs */,
          new spaceinvaders.common.Shape(goodGuyWidthX, goodGuyWidthY),
          new spaceinvaders.common.Position(
              (mapMaxX - goodGuyWidthX) / 2, mapMaxY - goodGuyWidthY - 20)),
      500 /* weaponMaxCooldownMs */,
      1 /* weaponVelocityPerMs */,
      0.1 /* movementVelocityPerMs */);
  var enemies = [];
  for (var i = 0; i < numEnemyRows; i++) {
    for (var j = 0; j < enemiesPerRow; j++) {
      var enemy = new spaceinvaders.model.Enemy(
          new spaceinvaders.model.GameObject(
              map,
              0 /* birthdayMs */,
              new spaceinvaders.common.Shape(enemyWidthX, enemyWidthY),
              new spaceinvaders.common.Position(
                  enemyRowLeft + j * (enemyWidthX + enemyGap),
                  i * (enemyWidthY + enemyGap) + 100)),
          0.01 /* weaponProbability */,
          50 /* marchWidth */,
          0.05 /* marchProbabilityPerMs */);
      enemies.push(enemy);
    }
  }
  return new spaceinvaders.model.Model(map, goodGuy, enemies);
};

// spaceinvaders.model.Model.prototype.tick = function(tickTimeMs) {
//   this.goodGuy.tick(tickTimeMs);
//   for (var i = 0; i < this.enemies.length; i++) {
//     this.enemies[i].tick(tickTimeMs);
//   }
//   for (var i = 0; i < this.bullets.length; i++) {
//     this.bullets[i].tick(tickTimeMs);
//   }
// }