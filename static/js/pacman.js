// Two levels of coordinates.
// Units and cells (with coords)
// constants
var UP = 1,
    DOWN = -1,
    LEFT = -2,
    RIGHT = 2,

    PATH = 0,
    WALL_HORIZONTAL = 1,
    WALL_VERTICAL = 5,
    CORNER_RIGHT_UP = 6,
    CORNER_RIGHT_DOWN = 7,
    CORNER_LEFT_UP = 8,
    CORNER_LEFT_DOWN = 9,
    UP_T = 10,
    DOWN_T = 11,
    LEFT_T = 12,
    RIGHT_T = 13,

    SMALLDOT = 2,
    BIGDOT = 3,
    DOOR = 4,

    C_BIGDOT = 0,
    C_SMALLDOT = 1,
    C_DIE = 8,
    C_WALL = 3,
    C_EAT = 4,
    C_NONE = -1,
    MAX_SCORE = 146,

    WEAK = 25; // times to redraw before not weak

App.controller('pacman', function($page) {
  var $game = $page.querySelector('.game'),
      $controls = $($page.querySelector('.joystick')),
      context = $game.getContext('2d'),
      $scoreElement = $page.querySelector('.scoreText'),
      unit = Math.floor(window.innerWidth/63), // 21 * 3
      width = unit * 63,
      height = width,
      cellSize = unit * 3,
      new_direction = UP,
      score = 0,
      pacman = new Pacman(15 * 3 + 1, 10 * 3 + 1),
      ghost = new Ghost('red', 9 * 3 + 1, 9 * 3),
      GHOST_RADIUS = Math.round(cellSize/2),
      count = 0;
      GHOST_COUNT = 4;
      layout = [ [00, 07, 01, 01, 01, 01, 01, 01, 01, 01, 11, 01, 01, 01, 01, 01, 01, 01, 01, 09, 00],
                 [00, 05, 02, 02, 02, 02, 02, 02, 02, 02, 05, 02, 02, 02, 02, 02, 02, 02, 02, 05, 00],
                 [00, 05, 03, 01, 01, 02, 01, 01, 01, 02, 05, 02, 01, 01, 01, 02, 01, 01, 03, 05, 00],
                 [00, 05, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 05, 00],
                 [00, 05, 02, 01, 01, 02, 05, 02, 01, 01, 11, 01, 01, 02, 05, 02, 01, 01, 02, 05, 00],
                 [00, 05, 02, 02, 02, 02, 05, 02, 02, 02, 05, 02, 02, 02, 05, 02, 02, 02, 02, 05, 00],
                 [00, 06, 01, 01, 09, 02, 13, 01, 01, 00, 05, 00, 01, 01, 12, 02, 07, 01, 01, 08, 00],
                 [00, 00, 00, 00, 05, 02, 05, 00, 00, 00, 00, 00, 00, 00, 05, 02, 05, 00, 00, 00, 00],
                 [01, 01, 01, 01, 08, 02, 05, 00, 07, 01, 04, 01, 09, 00, 05, 02, 06, 01, 01, 01, 01],
                 [00, 00, 00, 00, 00, 02, 00, 00, 05, 00, 00, 00, 05, 00, 00, 02, 00, 00, 00, 00, 00],
                 [01, 01, 01, 01, 09, 02, 05, 00, 06, 01, 01, 01, 08, 00, 05, 02, 07, 01, 01, 01, 01],
                 [00, 00, 00, 00, 05, 02, 05, 00, 00, 00, 00, 00, 00, 00, 05, 02, 05, 00, 00, 00, 00],
                 [00, 07, 01, 01, 08, 02, 05, 00, 01, 01, 11, 01, 01, 00, 05, 02, 06, 01, 01, 09, 00],
                 [00, 05, 02, 02, 02, 02, 02, 02, 02, 02, 05, 02, 02, 02, 02, 02, 02, 02, 02, 05, 00],
                 [00, 05, 02, 01, 09, 02, 01, 01, 01, 02, 05, 02, 01, 01, 01, 02, 07, 01, 02, 05, 00],
                 [00, 05, 03, 02, 05, 02, 02, 02, 02, 02, 00, 02, 02, 02, 02, 02, 05, 02, 03, 05, 00],
                 [00, 13, 01, 02, 05, 02, 05, 02, 01, 01, 11, 01, 01, 02, 05, 02, 05, 02, 01, 12, 00],
                 [00, 05, 02, 02, 02, 02, 05, 02, 02, 02, 05, 02, 02, 02, 05, 02, 02, 02, 02, 05, 00],
                 [00, 05, 02, 01, 01, 01, 10, 01, 01, 02, 05, 02, 01, 01, 10, 01, 01, 01, 02, 05, 00],
                 [00, 05, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 05, 00],
                 [00, 06, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 08, 00]];

  initialize();

  function isWall(cell) {
    return cell === WALL_HORIZONTAL |
          cell === WALL_VERTICAL |
          cell === CORNER_RIGHT_UP |
          cell === CORNER_RIGHT_DOWN |
          cell === CORNER_LEFT_UP |
          cell === CORNER_LEFT_DOWN |
          cell === UP_T |
          cell === DOWN_T |
          cell === LEFT_T |
          cell === RIGHT_T;
  }

  function isPath(cell, ghost) {
    if (ghost) {
      return (cell === PATH || cell === SMALLDOT || cell === BIGDOT || cell == DOOR);
    } else {
      return (cell === PATH || cell === SMALLDOT || cell === BIGDOT);
    }
  }

  function getCellCoords(i, j) {
    var I = Math.floor(i / 3);
    var J = Math.floor(j / 3);
    return {I: I, J:J};
  }
  function Ghost (color, i, j) {
    // i, j are the grid cell size.. 63 of them in one row/col
    this.i =  i;
    this.j = j;
    this.color = color;
    this.direction = UP;
    this.leave = true;
    this.chasing = true;
    this.previousCell = PATH;
    this.isMoving =  false;
    this.radius = GHOST_RADIUS;
    this.ROOM_UP  = i -1;
    this.ROOM_DOWN = i;
  }

  Ghost.prototype.chooseDirection = function (grid, pacman) {
    function hash(i, j) {
      return i + ' ' + j;
    }

    var stack = new Array(),
        popped,
        neighbors = [],
        neighbor,
        first = true,
        k = 0, ghostCoords,
        seen = {};

    pacmanCoords = getCellCoords(pacman.i, pacman.j);
    ghostCoords = getCellCoords(this.i, this.j);


    seen[hash(ghostCoords.I, ghostCoords.J)] = true;
    stack.push({I: ghostCoords.I, J: ghostCoords.J});

    popped = stack.pop();
    while (popped) {
      if (popped.I == pacmanCoords.I && popped.J == pacmanCoords.J) {
        if (first) {
          return C_DIE;
        } else {
          return popped.path;
        }
      }
      if (first) {
        neighbors = [{I: popped.I-1, J: popped.J, path: UP},
                  {I: popped.I+1, J: popped.J, path: DOWN},
                  {I: popped.I, J: popped.J + 1, path: RIGHT},
                  {I: popped.I, J: popped.J-1, path: LEFT}];
        first = false;
      } else {
        neighbors = [{I: popped.I-1, J: popped.J, path: popped.path},
                  {I: popped.I+1, J: popped.J, path: popped.path},
                  {I: popped.I, J: popped.J + 1, path: popped.path},
                  {I: popped.I, J: popped.J-1, path: popped.path}];
      }

      for (k = 0; k< 4; k++) {
        neighbor = neighbors[k];
        if (neighbor.I < 0 | neighbor.I > 62 | neighbor.J < 0 | neighbor.J > 62) {
          continue;
        }
        if (!seen[hash(neighbor.I, neighbor.J)] && isPath(grid[neighbor.I][neighbor.J], true)) {
          stack.push(neighbor);
        } else {
          seen[hash(neighbor.I, neighbor.J)] = true;
        }
      }
      seen[hash(popped.I, popped.J)] = true;
      popped = stack.pop();
    }
  }

  Ghost.prototype.move = function(grid, pacman) {
    var direction;
    // TODO leave condition
    if (this.leave) {
      // TODO change direction
      //direction = this.chooseDirection(grid, pacman);
      direction = new_direction;
      var next_ghost = {};
      next_ghost.i = this.i;
      next_ghost.j = this.j;

      if (this.direction !== direction && this.i %3 ===1 && this.j %3 === 1) {
        this.direction = direction;
      } else {

      }
      console.log(this.direction);
    } else {
      if (this.i <=  this.ROOM_UP) {
        this.direction = DOWN;
      } else if (this.i >= this.ROOM_DOWN) {
        this.direction = UP;
      }
    }
      if (this.direction === UP) {
        this.i -=1;
      } else if (this.direction === LEFT) {
        this.j -= 1;
      } else if (this.direction === RIGHT) {
        this.j += 1;
      } else {
        this.i += 1;
      }
  }

  Ghost.prototype.collision = function(pacman) {
    // what is the center of the ghost? figure this out
    // TODO
    return false;
  }

  Ghost.prototype.draw = function(context) {
    var x = this.j * unit + unit
        y = this.i * unit + unit;

    context.fillStyle = this.color;
    context.beginPath();

    context.arc(x, y, GHOST_RADIUS, Math.PI, 0, false);
    context.moveTo(x-GHOST_RADIUS, y);

    // LEGS
    if (!this.isMoving){
      context.lineTo(x-this.radius, y+this.radius);
      context.lineTo(x-this.radius+this.radius/3, y+this.radius-this.radius/4);
      context.lineTo(x-this.radius+this.radius/3*2, y+this.radius);
      context.lineTo(x, y+this.radius-this.radius/4);
      context.lineTo(x+this.radius/3, y+this.radius);
      context.lineTo(x+this.radius/3*2, y+this.radius-this.radius/4);

      context.lineTo(x+this.radius, y+this.radius);
      context.lineTo(x+this.radius, y);
    }
    else {
      context.lineTo(x-this.radius, y+this.radius-this.radius/4);
      context.lineTo(x-this.radius+this.radius/3, y+this.radius);
      context.lineTo(x-this.radius+this.radius/3*2, y+this.radius-this.radius/4);
      context.lineTo(x, y+this.radius);
      context.lineTo(x+this.radius/3, y+this.radius-this.radius/4);
      context.lineTo(x+this.radius/3*2, y+this.radius);
      context.lineTo(x+this.radius, y+this.radius-this.radius/4);
      context.lineTo(x+this.radius, y);
    }
    context.fill();
    //eyes
    context.fillStyle = "white"; //left eye
    context.beginPath();
    context.arc(x-this.radius/2.5, y-this.radius/5, this.radius/3, 0, Math.PI*2, true); // white
    context.fill();

    context.fillStyle = "white"; //right eye
    context.beginPath();
    context.arc(x+this.radius/2.5, y-this.radius/5, this.radius/3, 0, Math.PI*2, true); // white
    context.fill();
    switch(this.direction) {
      case UP:
        context.fillStyle="black"; //left eyeball
        context.beginPath();
        context.arc(x-this.radius/3, y-this.radius/5-this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
        context.fill();

        context.fillStyle="black"; //right eyeball
        context.beginPath();
        context.arc(x+this.radius/3, y-this.radius/5-this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
        context.fill();
      break;

      case DOWN:
        context.fillStyle="black"; //left eyeball
        context.beginPath();
        context.arc(x-this.radius/3, y-this.radius/5+this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
        context.fill();

        context.fillStyle="black"; //right eyeball
        context.beginPath();
        context.arc(x+this.radius/3, y-this.radius/5+this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
        context.fill();
      break;

      case LEFT:
        context.fillStyle="black"; //left eyeball
        context.beginPath();
        context.arc(x-this.radius/3-this.radius/5, y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
        context.fill();

        context.fillStyle="black"; //right eyeball
        context.beginPath();
        context.arc(x+this.radius/3-this.radius/15, y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
        context.fill();
      break;

      case RIGHT:
        context.fillStyle="black"; //left eyeball
        context.beginPath();
        context.arc(x-this.radius/3+this.radius/15, y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
        context.fill();

        context.fillStyle="black"; //right eyeball
        context.beginPath();
        context.arc(x+this.radius/3+this.radius/5, y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
        context.fill();
      break;
    }
  }

  // i, j are the unit indices for i, j
  function Pacman(i, j) {
    this.i = i;
    this.j = j;
    this.direction = UP;
    this.new_direction = this.direction;
    this.mouthOpenValue = 40;
    this.mouthPos = -1;
    this.stopped = false;
  }

  function getCell(pacman) {
    coords = getCellCoords(pacman.i, pacman.j);
    return layout[coords.I][coords.J];
  }

  Pacman.prototype.collisionType = function (pacman) {
    var next = {i: pacman.i, j: pacman.j, direction: pacman.direction},
        cell = getCell(pacman),
        cellPrime,
        g = 0,
        //ghost,
        C_TYPE = C_NONE;

    // Find next cell if we move one more in the current direction
    moveOneUnit(next);
    cellPrime = getCell(next);
    if (isWall(cellPrime) | cellPrime === DOOR) {
      C_TYPE = C_WALL;
    } else if (cell === SMALLDOT && (pacman.i % 3) == 1 && (pacman.j % 3) == 1) {
      C_TYPE = C_SMALLDOT;
    } else if (cell === BIGDOT && (pacman.i % 3) == 1 && (pacman.j % 3) == 1) {
      C_TYPE = C_BIGDOT;
    }

    // check if pacman dies
    // TODO
    if (ghost.collision(pacman)) {
      return C_DIE;
    }
    /*for (g = 0; g < 4; g++) {*/
      //ghost = ghosts[g];
      //if (ghost.collision(pacman)) {
        //return C_DIE;
      //}
    /*}*/

    return C_TYPE;
  }

  function moveOneUnit(sprite) {
    if (sprite.direction === UP) {
      sprite.i -=1;
    } else if (sprite.direction === LEFT) {
      sprite.j -= 1;
    } else if (sprite.direction === RIGHT) {
      sprite.j += 1;
    } else {
      sprite.i += 1;
    }
  }

  Pacman.prototype.update = function () {
    var cell,
        collision,
        next = {};

    next = {};
    next.i = this.i;
    next.j = this.j;
    next.direction = this.direction;

    // see if next_pacman can work in this new direction
    if (this.direction !== new_direction && this.i % 3 == 1 && this.j % 3 == 1) {
      next.direction = new_direction;
      moveOneUnit(next);
      collision = this.collisionType(next);
      // reset
      if (collision === C_WALL) {
        next.i = this.i;
        next.j = this.j;
        next.direction = this.direction;
        new_direction = this.direction;
      }
    } else {
      moveOneUnit(next);
    }

    if (collision === C_WALL) {
      moveOneUnit(next);
    }

    collision = this.collisionType(next);
    if (collision === C_WALL) {
      next.i = this.i;
      next.j = this.j;
      this.stopped = true; // TODO update this.not to draw when stopped
    } else if (collision === C_SMALLDOT) {
      updateScore(C_SMALLDOT);
      cellCoords = getCellCoords(next.i, next.j);
      layout[cellCoords.I][cellCoords.J] = PATH;
    } else if (collision === C_BIGDOT) {
      // TODO handle bigdot eating
      // go through ghosts and update status of each ghost
      console.log('Big dot collected');
      updateScore(C_BIGDOT);
      cellCoords = getCellCoords(next.i, next.j);
      layout[cellCoords.I][cellCoords.J] = PATH;
    } else if (collision === C_EAT) {
      console.log('Eaten by ghost');
      updateScore(C_EAT);
    }

    if (collision !== C_WALL) {
      this.stopped = false;
    }

    this.i = next.i;
    this.j = next.j;
    this.direction = next.direction;
  }

  Pacman.prototype.draw = function(context) {
    var startAngle, endAngle,
        radius = Math.round(0.7 * cellSize),
        x = this.j * unit + (unit/2),
        y = this.i * unit + (unit/2);

    // don't animate mouth if stopped
    if (this.stopped) {
      this.mouthOpenValue = 40;
    } else {
      // animate mouth
      if (this.mouthOpenValue <= 0) {
        this.mouthPosition = 1;
      } else if (this.mouthOpenValue >= 40) {
        this.mouthPosition = -1;
      }
      this.mouthOpenValue +=  10 * this.mouthPosition;
    }

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

    context.fillStyle = '#FF0';
    context.beginPath();
    context.arc(x, y, radius, startAngle, endAngle);
    context.lineTo(x, y);
    context.fill();
  }

  function initialize() {

    $game.width = width,
    $game.height = height,

    // paint
    setInterval(paint, 75);

    var joystick = new Joystick($controls);
    $(joystick)
      .on('move', function(non, pos) {
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

  function paint() {
    count += 1;
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    paintBackground();
    if (count == GHOST_COUNT) {
      count = 0;
      ghost.move(layout, pacman);
      ghost.draw(context);
    }
    pacman.update();
    pacman.draw(context);
  }

  function paintBackground() {
    var I = 0,
        J = 0,
        topLeftX = 0,
        topLeftY = 0,
        prev, next,
        cell,
        largeRadius = Math.round(0.30*cellSize),
        smallRadius = Math.round(0.10*cellSize);

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
        } else if (cell === WALL_HORIZONTAL ) {
          context.fillStyle = 'blue';
          prev = layout[I][J - 1];
          next = layout[I][J + 1];
          if (prev === PATH | prev === SMALLDOT | prev === BIGDOT) {
            context.fillRect(topLeftX+unit, topLeftY + unit, cellSize, unit);
          } else if (next === PATH | next === SMALLDOT | next === BIGDOT) {
            context.fillRect(topLeftX, topLeftY + unit, 2*unit, unit);
          } else {
            context.fillRect(topLeftX, topLeftY + unit, cellSize, unit);
          }
        } else if (cell === WALL_VERTICAL) {
          context.fillStyle = 'blue';
          prev = layout[I-1][J];
          next = layout[I+1][J];
          if (prev === PATH | prev === SMALLDOT | prev === BIGDOT) {
            context.fillRect(topLeftX+unit, topLeftY + unit, unit, 2*unit);
          } else if (next === PATH | next === SMALLDOT | next === BIGDOT) {
            context.fillRect(topLeftX+unit, topLeftY, unit, 2*unit);
          } else {
            context.fillRect(topLeftX + unit, topLeftY, unit, cellSize);
          }
        } else if (cell === CORNER_RIGHT_UP) {
          context.fillStyle = 'blue';
          context.fillRect(topLeftX + unit, topLeftY, unit, unit);
          context.fillRect(topLeftX + unit, topLeftY + unit, unit * 2, unit);
        } else if (cell === CORNER_LEFT_UP) {
          context.fillStyle = 'blue';
          context.fillRect(topLeftX + unit, topLeftY, unit, unit);
          context.fillRect(topLeftX, topLeftY + unit, unit * 2, unit);
        } else if (cell === CORNER_RIGHT_DOWN) {
          context.fillStyle = 'blue';
          context.fillRect(topLeftX + unit, topLeftY+unit, unit * 2, unit);
          context.fillRect(topLeftX + unit, topLeftY + 2*unit, unit, unit);
        } else if (cell === CORNER_LEFT_DOWN) {
          context.fillStyle = 'blue';
          context.fillRect(topLeftX, topLeftY+unit, unit * 2, unit);
          context.fillRect(topLeftX + unit, topLeftY + 2*unit, unit, unit);
        } else if (cell === UP_T) {
          context.fillStyle = 'blue';
          context.fillRect(topLeftX+unit, topLeftY, unit, unit);
          context.fillRect(topLeftX, topLeftY + unit, cellSize, unit);
        } else if (cell === DOWN_T) {
          context.fillStyle = 'blue';
          context.fillRect(topLeftX, topLeftY+unit, cellSize, unit);
          context.fillRect(topLeftX +unit , topLeftY + 2*unit, unit, unit);
        } else if (cell === RIGHT_T) {
          context.fillStyle = 'blue';
          context.fillRect(topLeftX+ 2*unit, topLeftY+unit, unit, unit);
          context.fillRect(topLeftX +unit , topLeftY, unit, cellSize);
        } else if (cell === LEFT_T) {
          context.fillStyle = 'blue';
          context.fillRect(topLeftX, topLeftY+unit, unit, unit);
          context.fillRect(topLeftX +unit , topLeftY, unit, cellSize);
        } else if (cell === DOOR) {
          context.fillStyle = 'grey';
          context.fillRect(topLeftX, topLeftY+unit, unit, unit);
        }
        topLeftX += cellSize;
      }
      topLeftY += cellSize;
    }
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
