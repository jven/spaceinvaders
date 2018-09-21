spaceinvaders.controller.Controller = function(model) {
  this.model = model;

  window.addEventListener('keydown', this.handleKeyDown_.bind(this));
  window.addEventListener('keyup', this.handleKeyUp_.bind(this));
};

spaceinvaders.controller.Controller.prototype.handleKeyDown_ = function(e) {
  this.handleKey_(e, true /* isDown */);
};

spaceinvaders.controller.Controller.prototype.handleKeyUp_ = function(e) {
  this.handleKey_(e, false /* isDown */);
};

spaceinvaders.controller.Controller.prototype.handleKey_ = function(e, isDown) {
  var msg = isDown ? 'Start moving ' : 'Stop moving ';
  if (e.keyCode == 38 || e.keyCode == 87) {
    // 'UP' or 'W'
    console.log(msg + 'up');
    this.model.goodGuy.setMovingUp(isDown);
  } else if (e.keyCode == 39 || e.keyCode == 68) {
    // 'RIGHT' or 'D'
    console.log(msg + 'right');
    this.model.goodGuy.setMovingRight(isDown);
  } else if (e.keyCode == 40 || e.keyCode == 83) {
    // 'DOWN' or 'S'
    console.log(msg + 'down');
    this.model.goodGuy.setMovingDown(isDown);
  } else if (e.keyCode == 37 || e.keyCode == 65) {
    // 'LEFT' or 'A'
    console.log(msg + 'left');
    this.model.goodGuy.setMovingLeft(isDown);
  }
};