App.controller('pacman', function(page) {
  var game = page.querySelector('.game'),
      joystick = page.querySelector('.joystick'),
      context = game.getContext('2d'), UP = 1,
      DOWN = -1,
      LEFT = -2,
      RIGHT = 2,
      PATH = 0,
      WALL = 1,
      SMALLDOT = 2,
      BIGDOT = 3,
      DOOR = 4,
      PACMAN = 5,
      C_BIGDOT = 0,
      C_SMALLDOT = 1,
      C_DIE = 2,
      C_NONE = -1,
      MAX_SCORE = 146,

      score = 0,
      pacman,
      width = window.innerWidth,
      height = window.innerWidth,
      cellSize = Math.round(width/21);

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

  initialize(15, 10);

  function initPacman(i, j) {
    var promise = $.Deferred(),
        img = new Image,
        data = {
          i: i,
          j: j,
          image: img,
          direction: RIGHT
        };

    img.src = '/images/kp_grey_logo.png';
    img.addEventListener('load', function() {
      promise.resolve(data);
    });

    // TODO set failure handle
    //return promise;
    return data;
  }

  function initialize(posI, posJ) {
    game.width = window.innerWidth;
    game.height = window.innerWidth;
    pacman = initPacman(posI, posJ);

    /*(initPacman(posI, posJ)).done(function(pacman) {*/
      //// TODO
    /*});*/
    setInterval(paint, 500);

  }

  function update() {
    var copy = $.extend(true, [], layout),
        collision = {
          type: C_NONE
        };
    // need list of characters that are moving -- ghosts, pacman
    // updated both -- need to track
    // update pacman
    // how to handle cases where ghost is passing through?
    // TODO ghost needs to save previous background
    next_pacman = {};
    next_pacman.i = pacman.i;
    next_pacman.j = pacman.j;

    if (pacman.direction === UP) {
      next_pacman.i -=1;
    } else if (pacman.direction === LEFT) {
      next_pacman.j -= 1;
    } else if (pacman.direction === RIGHT) {
      next_pacman.j += 1;
    } else {
      next_pacman.i += 1;
    }

    if (copy[next_pacman.i][next_pacman.j] === SMALLDOT) {
      collision.type = C_SMALLDOT;
    } else if (copy[next_pacman.i][next_pacman.j] === BIGDOT) {
      collision.type = C_BIGDOT;
    } else if (copy[next_pacman.i][next_pacman.j] === WALL) {
      next_pacman.i = pacman.i;
      next_pacman.j = pacman.j;
    }
    copy[pacman.i][pacman.j] = PATH;
    copy[next_pacman.i][next_pacman.j] = PACMAN;
    collision.layout = copy;
    pacman.i = next_pacman.i
    pacman.j = next_pacman.j
    return collision;
  }

  function paint() {
    var i = 0;
    var j = 0;
    var topLeftX = 0;
    var topLeftY = 0;
    var cell, collision;
    var smallRadius = Math.round(0.25*cellSize);

    //updates the board according to every player
    collision = update();
    if (collision.type === C_SMALLDOT) {
      score += 1;
      // TODO handle win case
    } else if (collision.type === C_BIGDOT) {
      // TODO swap around
    } else if (collision.type === C_DIE) {
      // TODO how to die?
    }

    layout = collision.layout;

    //clear everytime
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (i=0; i<21; i++) {
      topLeftX = 0;
      for (j=0; j<21; j++){
        cell = layout[i][j];

        if (cell === PACMAN) {
          context.drawImage(pacman.image, topLeftX, topLeftY, cellSize, cellSize);
        } else if (cell === SMALLDOT) {
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
