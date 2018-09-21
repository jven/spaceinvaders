spaceinvaders.view.View = function(model, canvasEl) {
  this.model = model;

  canvasEl.width = model.map.maxX;
  canvasEl.height = model.map.maxY;
  this.canvasEl = canvasEl;
  this.canvasContext = canvasEl.getContext("2d");
};

spaceinvaders.view.View.prototype.redraw = function() {
  // Clear the canvas.
  this.canvasContext.clearRect(0, 0, this.model.map.maxX, this.model.map.maxY);

  // Draw the background.
  this.canvasContext.fillStyle = 'black';
  this.canvasContext.fillRect(0, 0, this.model.map.maxX, this.model.map.maxY);

  // Draw the good guy.
  this.drawGameObject_(this.model.goodGuy.gameObject, '#FFC');

  // Draw the enemies.
  for (var i = 0; i < this.model.enemies.length; i++) {
    this.drawGameObject_(this.model.enemies[i].gameObject, 'red');
  }
};

spaceinvaders.view.View.prototype.drawGameObject_ = function(
    gameObject, color) {
  this.canvasContext.fillStyle = color;
  this.canvasContext.fillRect(
      gameObject.position.x,
      gameObject.position.y,
      gameObject.shape.widthX,
      gameObject.shape.widthY);
};
