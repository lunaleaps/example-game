$( document ).ready(function() {
    $("#snake-game-button").click(function(event){
        //Canvas
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        //var w = $("#canvas").width();
        //var h = $("#canvas").height();

        var titlebar_height = $( "div.app-title" ).height();

        // Set the canvas's height and width
        canvas.width = screen.width;
        canvas.height = screen.height - titlebar_height;

        var w = canvas.width; // Window's width
        var h = canvas.height/2; // Window's height
        
        //save the cell width in a variable for easy control
        var cw = 10;
        var d;
        var food;
        var score;

        var up_arrow = new Image();
        up_arrow.src = "../img/up_green.png";
        var ux = w/2 - up_arrow.width/2;
        var uy = 6*(h/5);
        var down_arrow = new Image();
        down_arrow.src = "../img/down_green.png";
        var dx = w/2 - down_arrow.width/2;
        var dy = 8*(h/5);
        var left_arrow = new Image();
        left_arrow.src = "../img/left_green.png";
        var lx = w/4 - left_arrow.width/2;
        var ly = 7*(h/5);
        var right_arrow = new Image();
        right_arrow.src = "../img/right_green.png";
        var rx = 3*w/4 - right_arrow.width/2;
        var ry = 7*(h/5);

        
        //create the snake
        var snake_array; //an array of cells to make up the snake
        canvas.addEventListener("touchstart", touchHandler, true);

        function touchHandler(event) {
            if (event.targetTouches.length >= 1) { //one finger touche
                var touch = event.targetTouches[0];

                if (event.type == "touchstart") {
                    
                    if (d == "left" || d == "right"){
                        if(event.type == "touchstart" && touch.pageX > dx && touch.pageX < (dx + down_arrow.width) && touch.pageY > (dy + titlebar_height) && touch.pageY < (dy + titlebar_height + down_arrow.height)){
                            //alert("touch " + touch.pageX + ", " + touch.pageY + " down_arrow " + down_arrow.x + ", " + down_arrow.y + ", " + down_arrow.r + " bar height " + titlebar_height);
                            d = "down";
                        }
                        else if(event.type == "touchstart" && touch.pageX > ux && touch.pageX < (ux + up_arrow.width) && touch.pageY > (uy + titlebar_height) && touch.pageY < (uy + titlebar_height + up_arrow.height)){
                            //alert("touch " + touch.pageX + ", " + touch.pageY + " up_arrow " + up_arrow.x + ", " + up_arrow.y + ", " + up_arrow.r + " bar height " + titlebar_height);
                            d = "up";
                        }
                    } 
                    else if(d == "up" || d == "down"){
                        if (event.type == "touchstart" && touch.pageX > lx && touch.pageX < (lx + left_arrow.width) && touch.pageY > (ly + titlebar_height) && touch.pageY < (ly + titlebar_height + left_arrow.height)){
                            //alert("touch " + touch.pageX + ", " + touch.pageY + " left_arrow " + left_arrow.x + ", " + left_arrow.y + ", " + left_arrow.r + " bar height " + titlebar_height);
                            d = "left";
                        }
                        else if (event.type == "touchstart" && touch.pageX > rx && touch.pageX < (rx + right_arrow.width) && touch.pageY > (ry + titlebar_height) && touch.pageY < (ry + titlebar_height + right_arrow.height)){
                            //alert("touch " + touch.pageX + ", " + touch.pageY + " right_arrow " + right_arrow.x + ", " + right_arrow.y + ", " + right_arrow.r + " bar height " + titlebar_height);
                            d = "right";
                        }
                    }
                }
            }
        }
        
        function init()
        {
            d = "right"; //default direction
            create_snake();
            create_food(); //draw food
            //display the score
            score = 0;
            
            //move the snake using a timer which will trigger the paint function
            //every 60ms
            if(typeof game_loop != "undefined") clearInterval(game_loop);
            game_loop = setInterval(paint, 60);
        }
        init();
        
        function create_snake()
        {
            var length = 5; //Length of the snake
            snake_array = []; //Empty array to start with
            for(var i = length-1; i>=0; i--)
            {
                //create a horizontal snake starting from the top left
                snake_array.push({x: i, y:0});
            }
        }
        
        //creates the food
        function create_food()
        {
            food = {
                x: Math.round(Math.random()*(w-cw)/cw), 
                y: Math.round(Math.random()*(h-cw)/cw), 
            };
        }
        
        //paints the snake now
        function paint()
        {
            //To avoid the snake trail we need to paint the BG on every frame
            //paint the canvas
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = "blue";
            ctx.fillRect(0, h, w, h*2);

            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, w, h);

            ctx.drawImage(up_arrow, ux, uy);
            ctx.drawImage(down_arrow, dx, dy);
            ctx.drawImage(right_arrow,rx, ry);
            ctx.drawImage(left_arrow, lx, ly);
            
            //The movement of the snake: pop out the tail cell and place it infront of the head cell
            var nx = snake_array[0].x;
            var ny = snake_array[0].y;
            //These were the position of the head cell.
            //We will increment it to get the new head position
            //Lets add proper direction based movement now
            if(d == "right") nx++;
            else if(d == "left") nx--;
            else if(d == "up") ny--;
            else if(d == "down") ny++;
            
            //This will restart the game if the snake hits the wall or if the head of the snake bumps into its body, the game will restart
            if(nx < 0 || nx >= w/cw || ny < 0 || ny >= h/cw || check_collision(nx, ny, snake_array))
            {
                //restart game
                init();
                return;
            }
            
            //If the new head position matches with that of the food,
            //Create a new head instead of moving the tail
            if(nx == food.x && ny == food.y)
            {
                var tail = {x: nx, y: ny};
                score++;
                //Create new food
                create_food();
            }
            else
            {
                var tail = snake_array.pop(); //pops out the last cell
                tail.x = nx; tail.y = ny;
            }
            //The snake can now eat the food.
            
            snake_array.unshift(tail); //puts back the tail as the first cell
            
            for(var i = 0; i < snake_array.length; i++)
            {
                var c = snake_array[i];
                //paint 10px wide cells
                paint_cell(c.x, c.y);
            }
            
            //paint the food
            paint_cell(food.x, food.y);
            //paint the score
            var score_text = "Score: " + score;
            ctx.fillText(score_text, 5, h-5);
        }
        
        //create a generic function to paint cells
        function paint_cell(x, y)
        {
            ctx.fillStyle = "white";
            ctx.fillRect(x*cw, y*cw, cw, cw);
            ctx.strokeStyle = "blue";
            ctx.strokeRect(x*cw, y*cw, cw, cw);
        }
        
        function check_collision(x, y, array)
        {
            //This function will check if the provided x/y coordinates exist
            //in an array of cells or not
            for(var i = 0; i < array.length; i++)
            {
                if(array[i].x == x && array[i].y == y)
                 return true;
            }
            return false;
        }
        });
});