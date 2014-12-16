App.controller('towerman', function(page) {
  var canvas = page.querySelector('.game');
  var context = canvas.getContext('2d');
  var PATH = 0;
  var WALL = 1;
  var SMALLDOT = 2;
  var BIGDOT = 3;
  var DOOR = 4;
  var PACMAN = 5;
  var layout = [ [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                 [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
                 [0, 1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1, 0],
                 [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
                 [0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 0],
                 [0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0],
                 [0, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 0],
                 [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
                 [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 4, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
                 [0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0],
                 [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
                 [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
                 [0, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 0],
                 [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
                 [0, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 0],
                 [0, 1, 3, 2, 1, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 1, 2, 3, 1, 0],
                 [0, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 0],
                 [0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0],
                 [0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0],
                 [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
                 [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]];

  initialize(0, 0);

  function initPacman(x, y) {
    var promise = $.Deferred(),
        img = new Image,
        data = {
          x: x,
          y: y
        };

    img.src = '/images/kp_grey_logo.png';
    img.addEventListener('load', function() {
      promise.resolve(data);
    });

    // TODO set failure handle
    return promise;
  }

  function initialize(posX, posY) {
    var width = window.innerWidth,
        height = window.innerWidth,
        cellSize = Math.round(width/21);

    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;

    (initPacman(posX, posY)).done(function(pacman) {
      paint(cellSize, width, height);
    });

  }

  function paint(cellSize, width, height) {
    var i = 0;
    var j = 0;
    var topLeftX = 0;
    var topLeftY = 0;
    var cell;
    var smallRadius = Math.round(0.25*cellSize);

    //clear everytime
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (i=0; i<21; i++) {
      topLeftX = 0;
      for (j=0; j<21; j++){
        cell = layout[i][j];

        if (cell === SMALLDOT) {
          context.beginPath();
          context.arc(topLeftX + Math.round(cellSize/2), topLeftY + Math.round(cellSize/2), smallRadius, 0, 2*Math.PI);
          context.fillStyle = "white";
          context.fill();
        } else if (cell === WALL | cell === BIGDOT | cell === DOOR) {
          if (cell === WALL) {
            context.fillStyle = 'blue';
          } else if (cell === BIGDOT) {
            context.fillStyle = "green";
          } else if (cell === DOOR){
            context.fillStyle = "grey";
          }
          context.fillRect(topLeftX, topLeftY, cellSize, cellSize);
        }
        topLeftX += cellSize;
      }
      topLeftY += cellSize;
    }
  }
});
