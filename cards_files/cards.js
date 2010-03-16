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
   "two"   : 2,
   "three" : 3,
   "four"  : 4,
   "five"  : 5,
   "six"   : 6,
   "seven" : 7,
   "eight" : 8,
   "nine"  : 9,
   "ten"   : 10,
   "jack"  : 11,
   "queen" : 12,
   "king"  : 14,
   "ace"   : 15,
 };

 var Values = {
    "2"  : 2,
    "3"  : 3,
    "4"  : 4,
    "5"  : 5,
    "6"  : 6,
    "7"  : 7,
    "8"  : 8,
    "9"  : 9,
    "10" : 10,
    "11" : 10,
    "12" : 10,
    "14" : 10,
    "15" : 10
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
  var shoe;
  
  var pot; //currently an int

  //GUI COMPONENTS
  var stayButton;
  var hitButton;
  //Array to hold all clickable items
  var buttons;

/******************************************
 * MIX-INS
 ******************************************/
  //Array.prototype.shuffle = function () { for(var rnd, tmp, i=this.length;
  // i;
  // rnd=parseInt(Math.random()*i), tmp=this[--i], this[i]=this[rnd], this[rnd]=tmp);
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
    this.draw = function () {
      var x = 330;
      var y = 150;
      var card = new Card();
      context.fillRect(
        x - (card.width() / 2),
        y - (card.height() / 2),
        card.width(),
        card.height()
      );
      context.strokeRect(
        x - (card.width() / 2),
        y - (card.height() / 2),
        card.width(),
        card.height()
      );

      var text = "SHOE: " + (this.cards.length.toString());
      context.font = '30 sans-serif';
      context.strokeStyle = colors.black;
      context.fillStyle   = colors.white;
      var textWidth = context.measureText(this.text).width;
      context.strokeText(
        text,
        x - (textWidth / 2),
        y 
      );
      context.fillText(
        text,
        x - (textWidth / 2),
        y 
      );
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
    this.getScore = function () {
      //Sum up the values of the cards
      var sum = 0;
      for (var i in this.hand.cards) {
        var card = this.hand.cards[i];
        //sum += card.value();
        var value = card.value();
        sum += value;
      }
      if (sum > 21) {
        return 0;
      } else {
        return sum;
      }
    }
    this.purse = 100;
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
    this.value = function() { return Values[this.rank] };
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
    initGame();
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
        1.5 * buttonHeight,
        function() { 
          human.stay();
          dealerMove();
        }
    );
    hitButton  = new Button(
        "Hit",
        10,
        2.5 * buttonHeight,
        function() { 
          human.hit();
          dealerMove();
        }
    );
    buttons.push(stayButton);
    buttons.push(hitButton);

    //DEBUG ONLY
    var dealerStayButton = new Button(
        "DealerStay",
        380,
        1.5 * buttonHeight,
        function() { dealer.stay() }
    );
    var dealerHitButton  = new Button(
        "DealerHit",
        380,
        2.5 * buttonHeight,
        function() { dealer.hit() }
    );
    var nextTurnButton  = new Button(
        "Next Turn",
        380,
        3.5 * buttonHeight,
        function() { endTurn() }
    );
    buttons.push(dealerStayButton);
    buttons.push(dealerHitButton);
    buttons.push(nextTurnButton);

    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);
  }

  function initGame() {
    dealer = new Player(2);
    human  = new Player(2);
    shoe   = new Shoe(1);
    shoe.renew();

    pot = 0;

    beginTurn();
  }
  function beginTurn() {
    dealCard(human);
    dealCard(dealer);
  }
  function endTurn() {
    var pot = 10;
    //Resolve winner
    if (human.getScore() > dealer.getScore()) {
      human.purse += pot;
    } else if (dealer.getScore() > human.getScore()) {
      dealer.purse += pot;
    } else {
      //Push
      //Return their bets
    }
    //Clear the cards
    human.hand.cards  = [ ];
    dealer.hand.cards = [ ];
    beginTurn();
  }

  function dealerMove() {
    var score = dealer.getScore();
    if (score < 17 && score != 0) {
      dealer.hit();
    } else {
      dealer.stay();
    }
  }

  function dealCard(player) {
    player.hand.addCard(
      shoe.getCard()
    );
  }

  /******************************************
 * EVENTS
 ******************************************/

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
        //if (button.checkHit(ev)) {
        if (button.onClick(ev)) {
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
    context.fillStyle = colors.white;
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawCards();
    
    for (var i in buttons) {
      buttons[i].draw();
    }
    //scores
    drawScore(dealer);
    drawScore(human);

    shoe.draw();
    drawPot();
  }
/******************************************
 * MISC GUI
 ******************************************/
  function drawPot() {
    var text = "Pot: " + pot;
    var x = 200;
    var y = 200;
     drawText(
      x,
      y,
      text,
      colors.black,
      colors.white
     );
  }

  function drawScore(player) {
    var score = player.getScore();
    if (score == 0) {
      score = "Bust";
    }
    var text = "Score: " + score;
    var x;
    var y;
    if (player == dealer) {
      x = 100;
      y = 50;
    } else {
      x = 100;
      y = 250;
    }
    drawText(
      x,
      y,
      text,
      colors.black,
      colors.white
    );

    y += 30;
    text = "Purse: " + player.purse;
    drawText(
      x,
      y,
      text,
      colors.black,
      colors.white
    );
  }
/******************************************
 * GUI UTIL
 ******************************************/
  function drawText(x, y, text, strokeStyle, fillStyle) {
    context.strokeStyle = strokeStyle;
    context.fillStyle   = fillStyle;
    drawText(x, y, text);
  }
  function drawText(x, y, text) {
    context.font = '30 sans-serif';
    var textWidth = context.measureText(this.text).width;
    context.strokeText(
      text,
      x - (textWidth / 2),
      y 
    );
    context.fillText(
      text,
      x - (textWidth / 2),
      y 
    );
  }

/******************************************
 * BUTTON METHODS
 ******************************************/
  function Button(text, x, y, callback) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.draw = drawButton;
    this.pressed = false;
    this.width  = function() { return canvas.width / 6; };
    this.height = function() { return canvas.height / 6; };
    this.checkHit = checkHit;
    this.callback = callback;
    this.onClick = function(ev) {
      if (this.checkHit(ev)) {
        this.callback();
      } else {
        return false;
      }
    };
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
      context.fillStyle   = colors.white;
    } else {
      context.fillStyle   = colors.yellow;
    }
    //context.strokeStyle = colors.yellow;
    context.strokeStyle = colors.black;
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
    var y = spacing;
    context.strokeStyle = color;
    context.fillStyle   = colors.red;
    for (var i in dealer.hand.cards) {
      drawCard(dealer.hand.cards[i], x, y);
      x += (width + spacing);
    }
    //Draw my cards
    var numCards = human.hand.cards.length;
    var offset = (canvas.width - (numCards * (width + spacing))) / 2;
    y = (canvas.height - height) - spacing;
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
    //var text = card.rank.toString();
    var text = card.value().toString();
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

