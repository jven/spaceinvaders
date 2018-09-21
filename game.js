spaceinvaders.game.Game = function(model, view) {
  this.model = model;
  this.view = view;
  this.lastTimeMs = -1;
};

spaceinvaders.game.Game.prototype.tick = function() {
  // Update the model.
  var currentTime = new Date().getTime();
  if (this.lastTimeMs > -1) {
    this.model.update(currentTime - this.lastTimeMs);
  }
  this.lastTimeMs = currentTime;

  // Redraw the view.
  this.view.redraw();

  // Tick again at the next redraw.
  window.requestAnimationFrame(this.tick.bind(this));
};

spaceinvaders.game.startGame = function() {
  console.log('Would you like to play a game?');

  var model = spaceinvaders.model.Model.createDefault();
  var view = new spaceinvaders.view.View(
      model, document.getElementById('gameElement'));
  var game = new spaceinvaders.game.Game(model, view);
  window.requestAnimationFrame(game.tick.bind(game));
};

window.onload = spaceinvaders.game.startGame;
