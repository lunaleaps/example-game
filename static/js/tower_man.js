App.controller('towerman', function(page) {
  var canvas = page.querySelector('.game');
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth;
  var context = canvas.getContext('2d');


  var levelLayout = [ [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
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
                      [0, 1, 3, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 3, 1, 0],
                      [0, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 0],
                      [0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0],
                      [0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0],
                      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
                      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]];

  var grid = initGrid();
  paint();
  console.log("sweg");
  function initGrid() {
    var width, height, squareSize;
    width = height = window.innerWidth;
    squareSize = Math.round(width/21);
    //TODO hardcode pacman grid

    return {
      width: width,
      height: height,
      squareSize: squareSize,
      layout: levelLayout
    };
  }

  function paint() {
    var i = 0;
    var j = 0;
    var cellSize = grid.squareSize;
    var topLeftX = 0;
    var topLeftY = 0;
    var cell;
    var drawn = 0;
    var smallRadius = Math.round(0.25*cellSize);

    for (i=0; i<21; i++) {
      topLeftX = 0;
      for (j=0; j<21; j++){
        cell = grid.layout[i][j];

        if (cell === 1) {
          context.fillStyle = 'blue';
        } else if (cell === 0 || cell === 2){
          context.fillStyle = "black";
        } else if (cell === 3){
          context.fillStyle = "green";
        } else if (cell === 4){
          context.fillStyle = "grey";
        }

        context.fillRect(topLeftX, topLeftY, cellSize, cellSize);
        
        if (cell ===2 && drawn < 10){
          drawn += 1;
          context.arc(topLeftX + Math.round(cellSize/2), topLeftY + Math.round(cellSize/2), smallRadius, 0, 2*Math.PI);
          context.fillStyle = "white";
          context.fill();
        }

        topLeftX += cellSize;
        
      }
      topLeftY += cellSize;
    }
  }
});
