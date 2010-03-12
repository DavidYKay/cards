/* © 2009 ROBO Design
 * http://www.robodesign.ro
 */

// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
  //GUI stuff
  var canvas, context, canvaso, contexto;

  var colors = {};
  var color;
  var color_default = 'red';
  colors.red   = 'rgb(255,0,0)';
  colors.green = 'rgb(0,255,0)';
  colors.blue  = 'rgb(0,0,255)';

  var dealer = new Player(0);
  var human  = new Player(1);

  function Player(role) {
    this.hand = new Hand();
    if (role == 0) {
      this.hand.addCard(
        new Card(
          'heart',
          1
        ))
    } else {
      //human
      this.hand.addCard(
        new Card(
          'diamond',
          2
        ))
      this.hand.addCard(
        new Card(
          'spade',
          3
        ))
    }
  }
  function addCard(newCard) {
    this.cards.push(newCard);
  }
  function Hand() {
    this.cards = [];
    this.addCard = addCard;
  }
  function Card(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  function setColor (newColor) {
    color = newColor;
    context.strokeStyle = color;
    context.fillStyle   = color;
  }
  function init () {
    // Find the canvas element.
    canvaso = document.getElementById('imageView');
    if (!canvaso) {
      alert('Error: I cannot find the canvas element!');
      return;
    }
    if (!canvaso.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }
    // Get the 2D canvas context.
    contexto = canvaso.getContext('2d');
    if (!contexto) {
      alert('Error: failed to getContext!');
      return;
    }
    // Add the temporary canvas.
    var container = canvaso.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
      alert('Error: I cannot create a new canvas element!');
      return;
    }

    canvas.id     = 'imageTemp';
    canvas.width  = canvaso.width;
    canvas.height = canvaso.height;
    container.appendChild(canvas);

    context = canvas.getContext('2d');
    
    // Activate the default tool.
    // Activate the default color.
    if (colors[color_default]) {
      setColor(colors[color_default]);
    }

    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);
  }

  // The general-purpose event handler. This function just determines the mouse 
  // position relative to the canvas element.
  function ev_canvas (ev) {
    if (ev.layerX || ev.layerX == 0) { // Firefox
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;
    }

    if (ev.type == 'mousedown') {
      img_update(1);
    } else if (ev.type == 'mouseup') {
      img_update(0);
    }
  }

  // This function draws the #imageTemp canvas on top of #imageView, after which 
  // #imageTemp is cleared. This function is called each time when the user 
  // completes a drawing operation.
  function img_update (down) {
    //if (up) {
    //  context.clearRect(0, 0, canvas.width, canvas.height);
    //} else {
    //  context.fillRect(0, 0, canvas.width, canvas.height);
    //}
    drawCards();
  }

  function drawCards() {
    var width  = canvas.width / 5;
    var height = canvas.height / 3;
    var spacing = 10;
    var numCards = dealer.hand.cards.length;
    var offset = (canvas.width - (numCards * (width + spacing))) / 2;
    
    //Draw his cards
    var x = offset;
    var y = 0;
    context.strokeStyle = color;
    context.fillStyle   = colors.red;
    //for (var i = 0; i < numCards; i++) {
    for (var i = 0; i < numCards; i++) {
      context.fillRect(x, y, width, height);
      x += (width + spacing);
    }
    //Draw my cards
    var numCards = human.hand.cards.length;
    var offset = (canvas.width - (numCards * (width + spacing))) / 2;
    y = canvas.height - height;
    x = offset;
    context.strokeStyle = color;
    context.fillStyle   = colors.blue;
    //for (var i = 0; i < numCards; i++) {
    for (var i = 0; i < human.hand.cards.length; i++) {
      context.fillRect(x, y, width, height);
      x += (width + spacing);
    }
  }

  init();
}, false); }

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:

