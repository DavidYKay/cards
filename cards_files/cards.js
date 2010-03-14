/* © 2009 ROBO Design
 * http://www.robodesign.ro
 */

// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
  //GUI stuff
  var canvas, context, canvaso, contexto;
  var Suits = {
   "hearts" : 0,
   "diamonds" : 1,
   "clubs" : 2,
   "spades" : 3,
 };

 var Ranks = {
   "two" : 2,
   "three" : 3,
   "four" : 4,
   "five" : 5,
   "six" : 6,
   "seven" : 7,
   "eight" : 8,
   "nine" : 9,
   "ten" : 10,
   "jack" : 11,
   "queen" : 12,
   "king" : 14,
   "ace" : 15,
 };

  var colors = {};
  var color;
  var color_default = 'red';
  colors.white = 'rgb(255,255,255)';
  colors.grey  = 'rgb(127,127,127)';
  colors.black = 'rgb(0,0,0)';
  colors.red   = 'rgb(255,0,0)';
  colors.green = 'rgb(0,255,0)';
  colors.blue  = 'rgb(0,0,255)';
  colors.purple = 'rgb(127,0,127)';
  colors.yellow = 'rgb(127,127,0)';

  //State/Model variables
  var dealer;
  var human ;

  //var shoe = initShoe(1);
  var shoe;

  //GUI COMPONENTS
  var stayButton;
  var hitButton;
  //Array to hold all clickable items
  var buttons;

/******************************************
 * MIX-INS
 ******************************************/
  //Array.prototype.shuffle = function () { for(var rnd, tmp, i=this.length; i; 
  //rnd=parseInt(Math.random()*i), tmp=this[--i], this[i]=this[rnd], 
  //this[rnd]=tmp);
  //};

/******************************************
 * MODEL OBJECTS
 ******************************************/
  function Shoe(numDecks) {
    this.cards = [];
    this.numDecks = numDecks;
    //this.getCard = function () { return new Card(Suits.hearts, Ranks.two) };
    this.getCard = function () { return (this.cards.pop()) };
    //this.getCard = this.cards.pop;
    this.isEmpty = function () { return (this.cards.length == 0); };
    this.renew = function () { 
      this.cards = prepShoecards(this.numDecks);
    };
    //Ensure that we have a full shoe of cards to start with
    //this.renew();
  }
  function prepShoecards(numDecks) {
    var decks = [ ];
    for (var i = 1; i <= numDecks; i++) {
      decks.push(new Deck().cards);
    }
    for (var i = 1; i < decks.length; i++) {
      //Squash the decks into one
      decks[0].concat(
        decks[i]
      );
    }
    return decks[0];
  }

  function Deck() {
    this.cards = [ ];
    for (var i in Suits) {
      for (var j in Ranks) {
        this.cards.push(
          new Card(
            Suits[i],
            Ranks[j]
          )
        );
      }
    }
  }

  function Player(role) {
    this.stay = function () {
      //Flag as done?
    }
    this.hit = function () {
      dealCard(this);
    };
    this.hand = new Hand();
    if (role == 0) {
      this.hand.addCard(
        new Card(
          Suits.hearts,
          Ranks.ace
        ))
      this.hand.addCard(
        new Card(
          Suits.clubs,
          Ranks.jack
        ))
      this.hand.addCard(
        new Card(
          Suits.diamonds,
          Ranks.king
        ))
    } else if (role == 1) {
      //human
      this.hand.addCard(
        new Card(
          Suits.hearts,
          Ranks.two
        ))
      this.hand.addCard(
        new Card(
          Suits.spades,
          Ranks.three
        ))
      this.hand.addCard(
        new Card(
          Suits.diamonds,
          Ranks.nine
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
    this.width  = function () { return canvas.width / 7; };
    this.height = function () { return canvas.height / 4; };
  }

  function setColor (newColor) {
    color = newColor;
    context.strokeStyle = color;
    context.fillStyle   = color;
  }

/******************************************
 * GAME LOGIC
 ******************************************/

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

    //GUI COMPONENTS
    var buttonHeight = canvas.height / 5;
    buttons = [];
    stayButton = new Button(
        "Stay",
        10,
        1.5 * buttonHeight
    );
    hitButton  = new Button(
        "Hit",
        10,
        2.5 * buttonHeight
    );
    buttons.push(stayButton);
    buttons.push(hitButton);

    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);
    initGame();
  }

  function initGame() {
    dealer = new Player(2);
    human  = new Player(2);
    shoe   = new Shoe(1);
    var testCards = prepShoecards(1);
    shoe.renew();

    human.hand.addCard(
      shoe.getCard()
    );
    human.hit();
    dealer.hand.addCard(
      shoe.getCard()
    );
    var empty = shoe.isEmpty();
  }

  function dealCard(player) {
      player.hand.addCard(
        shoe.getCard()
      );
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
      for (i in buttons) {
        var button = buttons[i];
        if (button.checkHit(ev)) {
          break;
        }
      }
    } else if (ev.type == 'mouseup') {
      for (i in buttons) {
        var button = buttons[i];
        button.pressed = false;
      }
    }
    img_update(0);
  }

  // This function draws the #imageTemp canvas on top of #imageView, after which 
  // #imageTemp is cleared. This function is called each time when the user 
  // completes a drawing operation.
  function img_update (down) {
    drawCards();
    
    var height = canvas.height / 5;
    stayButton.draw();
    hitButton.draw();
  }
/******************************************
 * BUTTON METHODS
 ******************************************/
  function Button(text, x, y) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.draw = drawButton;
    this.pressed = false;
    this.width  = function() { return canvas.width / 6; };
    this.height = function() { return canvas.height / 6; };
    this.checkHit = checkHit;
  }

  function checkHit(ev) {
    if (
        ev._x > this.x &&
        ev._x < (this.x + this.width()) &&
        ev._y > this.y &&
        ev._y < (this.y + this.height())
    ) {
      this.pressed = true;
      return true;
    } else {
      return false;
    }
  }

  function drawButton() {
    if (this.pressed) {
      context.fillStyle   = colors.black;
    } else {
      context.fillStyle   = color;
    }
    context.fillRect(
      this.x,
      this.y,
      this.width(),
      this.height()
    );
    context.strokeRect(
      this.x,
      this.y,
      this.width(),
      this.height()
    );
    var textWidth = context.measureText(this.text).width;
    context.strokeText(
      this.text,
      this.x + (this.width() - textWidth) / 2,
      this.y + (this.height() / 2)
    );
  }
/******************************************
 * CARD METHODS
 ******************************************/
  function drawCards() {
    var card = new Card(1, 2);
    var width  = card.width();
    var height = card.height();
    var spacing = 10;
    var numCards = dealer.hand.cards.length;
    var offset = (canvas.width - (numCards * (width + spacing))) / 2;
    
    //Draw his cards
    var x = offset;
    var y = 0;
    context.strokeStyle = color;
    context.fillStyle   = colors.red;
    for (var i in dealer.hand.cards) {
      drawCard(dealer.hand.cards[i], x, y);
      x += (width + spacing);
    }
    //Draw my cards
    var numCards = human.hand.cards.length;
    var offset = (canvas.width - (numCards * (width + spacing))) / 2;
    y = canvas.height - height;
    x = offset;
    context.strokeStyle = color;
    context.fillStyle   = colors.blue;
    for (var i in human.hand.cards) {
      drawCard(human.hand.cards[i], x, y);
      x += (width + spacing);
    }
  }
  function drawCard(card, x, y) {
    var cardColor;
    switch (card.suit) {
      case Suits.hearts:
        cardColor = colors.green;
        break;
      case Suits.diamonds:
        cardColor = colors.red;
        break;
      case Suits.clubs:
        cardColor = colors.purple;
        break;
      case Suits.spades:
        cardColor = colors.black;
        break;
    }
    //Draw card
    context.strokeStyle = colors.yellow;
    context.fillStyle   = cardColor;
    context.fillRect(x, y, card.width(), card.height());
    context.strokeRect(x, y, card.width(), card.height());

    context.strokeStyle = colors.yellow;
    var text = card.rank.toString();
    var textWidth = context.measureText(text).width;
    //Draw number
    context.strokeText(
      text,
      x + (card.width() - textWidth) / 2,
      y + (card.height() / 2)
    );
  }

  init();
}, false); }

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:

