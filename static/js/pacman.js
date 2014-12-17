// constants
var UP = 1,
    DOWN = -1,
    LEFT = -2,
    RIGHT = 2,
    PATH = 0,
    WALL = 1,
    SMALLDOT = 2,
    BIGDOT = 3,
    DOOR = 4,
    C_BIGDOT = 0,
    C_SMALLDOT = 1,
    C_DIE = 2,
    C_WALL = 3,
    C_EAT = 4,
    C_NONE = -1,
    MAX_SCORE = 146;

App.controller('pacman', function($page) {
  var $game = $page.querySelector('.game'),
      $controls = $page.querySelector('.joystick'),
      context = $game.getContext('2d'),
      $scoreElement = $page.querySelector('.scoreText'),
      score = 0,
      pacman,
      unit = Math.floor(window.innerWidth/63),
      width = unit * 63,
      height = width,
      cellSize = unit * 3,
      new_direction = UP,
      layout = [ [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
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
                 [0, 1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1, 0],
                 [0, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 0],
                 [0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0],
                 [0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0],
                 [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
                 [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]];

  initialize(15 * 3 + 1, 10 * 3 + 1);

  function initPacman(i, j) {
    return {
            i: i,
            j: j,
            direction: UP,
            mouthOpenValue: 40,
            mouthPos: -1,
            draw : function(context) {
              var startAngle, endAngle,
                  radius = Math.round(0.5 * cellSize),
                  x = this.j * unit + (unit/2),
                  y = this.i * unit + (unit/2);

              if (this.mouthOpenValue <= 0) {
                this.mouthPosition = 1;
              } else if (this.mouthOpenValue >= 40) {
                this.mouthPosition = -1;
              }
              this.mouthOpenValue +=  10 * this.mouthPosition;

              if (this.direction === RIGHT) {
                startAngle = (Math.PI / 180) * this.mouthOpenValue;
                endAngle =  (Math.PI / 180) * (360 -this.mouthOpenValue);
              } else if (this.direction === LEFT) {
                startAngle = (Math.PI / 180) * (180 + this.mouthOpenValue);
                endAngle =  (Math.PI / 180) * (179 - this.mouthOpenValue);
              } else if (this.direction === UP) {
                startAngle = (Math.PI / 180) * (270 + this.mouthOpenValue);
                endAngle =  (Math.PI / 180) * (269 - this.mouthOpenValue);
              } else {
                startAngle = (Math.PI / 180) * (90 + this.mouthOpenValue);
                endAngle =  (Math.PI / 180) * (89 - this.mouthOpenValue);
              }

              context.beginPath();
              context.arc(x, y, radius, startAngle, endAngle);
              context.lineTo(x, y);
              context.fillStyle = '#FF0';
              context.fill();
            }
    };
  }

  function initialize(posI, posJ) {
    var joystickDiv = createNewJoystickDiv(),
        joystick;
    $game.width = width;
    $game.height = height;
    pacman = initPacman(posI, posJ);

    // paint
    setInterval(paint, 75);

    $($controls).append(joystickDiv);
    joystick = new Joystick(joystickDiv);
    $(joystick)
      .on('done', function(non, pos) {
        if (Math.abs(pos.x) > Math.abs(pos.y)) {
          if (pos.x > 0) {
            new_direction = RIGHT;
          } else {
            new_direction = LEFT;
          }
        } else {
          if (pos.y > 0) {
            new_direction = DOWN;
          } else {
            new_direction = UP;
          }
        }
      });
  }

  function update() {
    var copy = $.extend(true, [], layout),
        cell,
        changeDirection = false,
    // need list of characters that are moving -- ghosts, pacman
    // updated both -- need to track
    // update pacman
    // how to handle cases where ghost is passing through?
    // TODO ghost needs to save previous background
    next_pacman = {};
    next_pacman.i = pacman.i;
    next_pacman.j = pacman.j;
    next_pacman.direction = pacman.direction;

    if (pacman.direction !== new_direction && pacman.i % 3 == 1 && pacman.j % 3 == 1) {
      // see if next_pacman can work in this new direction
      move(next_pacman, new_direction);
      if (getCollisionType(copy, next_pacman) === C_WALL) {
        changeDirection = false;
        // reset the values
        new_direction = pacman.direction; // should we do this?
        next_pacman.direction = pacman.direction;
        next_pacman.i = pacman.i;
        next_pacman.j = pacman.j;
      } else {
        changeDirection = true;
      }
    }

    if (!changeDirection) {
      move(next_pacman, pacman.direction);
    }

    var collision = getCollisionType(copy, next_pacman);
    if (collision === C_WALL) {
      next_pacman.i = pacman.i;
      next_pacman.j = pacman.j;
    } else if (collision === C_SMALLDOT) {
      updateScore(C_SMALLDOT);
      cellCoords = getCellCoords(next_pacman.i, next_pacman.j);
      copy[cellCoords[0]][cellCoords[1]] = PATH;
    } else if (collision === C_BIGDOT) {
      // TODO handle bigdot eating
      console.log('Big dot collected');
      updateScore(C_BIGDOT);
      cellCoords = getCellCoords(next_pacman.i, next_pacman.j);
      copy[cellCoords[0]][cellCoords[1]] = PATH;
    } else if (collision === C_EAT) {
      updateScore(C_EAT);
    }

    layout = copy;
    pacman.i = next_pacman.i;
    pacman.j = next_pacman.j;
    pacman.direction = next_pacman.direction;

    function getCellCoords(i, j) {
      var I = Math.floor(i / 3);
      var J = Math.floor(j / 3);
      return [I, J];
    }

    function getCell(grid, pacman) {
      coords = getCellCoords(pacman.i, pacman.j);
      return grid[coords[0]][coords[1]];
    }

    function getCollisionType(grid, pacman) {
      var fake = JSON.parse(JSON.stringify(pacman)),
          cell = getCell(grid, pacman),
          C_TYPE = C_NONE;

      move(fake, pacman.direction);
      var cellPrime = getCell(grid, fake);
      if (cellPrime === WALL || cellPrime === DOOR) {
        C_TYPE = C_WALL;
      } else if (cell === SMALLDOT && (pacman.i % 3) == 1 && (pacman.j % 3) == 1) {
        C_TYPE = C_SMALLDOT;
      } else if (cell === BIGDOT && (pacman.i % 3) == 1 && (pacman.j % 3) == 1) {
        C_TYPE = C_BIGDOT;
      }
      return C_TYPE;
    }

    function move(pacman, direction) {
      pacman.direction = direction;
      if (direction === UP) {
        pacman.i -=1;
      } else if (direction === LEFT) {
        pacman.j -= 1;
      } else if (direction === RIGHT) {
        pacman.j += 1;
      } else {
        pacman.i += 1;
      }
    }
  }

  function paint() {
    var I = 0;
    var J = 0;
    var topLeftX = 0;
    var topLeftY = 0;
    var cell, collision;
    var largeRadius = Math.round(0.30*cellSize);
    var smallRadius = Math.round(0.10*cellSize);

    // updates layout
    collision = update();

    //clear everytime
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // paint full background
    for (I=0; I<21; I++) {
      topLeftX = 0;
      for (J=0; J<21; J++){
        cell = layout[I][J];

        if (cell === SMALLDOT) {
          context.beginPath();
          context.arc(topLeftX + Math.round(cellSize/2), topLeftY + Math.round(cellSize/2), smallRadius, 0, 2*Math.PI);
          context.fillStyle = "white";
          context.fill();
        } else if (cell === BIGDOT) {
          context.beginPath();
          context.arc(topLeftX + Math.round(cellSize/2), topLeftY + Math.round(cellSize/2), largeRadius, 0, 2*Math.PI);
          context.fillStyle = "white";
          context.fill();
        } else if (cell === WALL | cell === DOOR) {
          if (cell === WALL) {
            context.fillStyle = 'blue';
          } else if (cell === DOOR){
            context.fillStyle = "grey";
          }
          context.fillRect(topLeftX, topLeftY, cellSize, cellSize);
        }
        topLeftX += cellSize;
      }
      topLeftY += cellSize;
    }

    // paint pacman
    pacman.draw(context);
    //context.drawImage(pacman.image, topLeftX, topLeftY, cellSize, cellSize);
  }

  function updateScore(collisionType) {
    if (collisionType === C_SMALLDOT) {
      score += 10;
      $scoreElement.textContent = score;
    } else if (collisionType === C_BIGDOT) {
      score += 100;
      $scoreElement.textContent = score;
    } else if (collisionType === C_EAT) {
      score += 200;
      $scoreElement.textContent = score;
    }
  }
  $(document).keydown(function(e){
    var key = e.which;
    if(key == "37") new_direction = LEFT;
    else if(key == "38" ) new_direction = UP;
    else if(key == "39") new_direction = RIGHT;
    else if(key == "40") new_direction = DOWN;
  })
});
