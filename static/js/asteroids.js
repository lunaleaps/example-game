function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}
var asteroids;
App.controller('asteroids', function(page) {
    asteroids = new Asteroids($(page).find("#si-main-div"));
    asteroids.start();
    $(window).on("keypress", asteroids.handleKeydown);
    $(window).on("keyup", asteroids.handleKeyup);
    $(page).on("appDestroy", function() {
        $(window).off("keypress", asteroids.handleKeydown);
        $(window).off("keyup", asteroids.handleKeydown);
    });
});
try {
    App.restore();
} catch (err) {
    App.load('home');
    console.log(err);
}
function filterIsNot(obj) {
    return function(o) {
        return o != obj;
    };
}
function Asteroids(div) {
    this.div = div;
    div.append($("<div>")
        .addClass("si-trackpad-container")
        .append($("<div>")
            .addClass("si-trackpad"))
        .on("touchstart", function(evt) {
            console.log(evt);
        }));
    this.div.addClass("si-main");
    this.sprites = [];
    this.prevPhysicsTime = new Date();
    this.stopped = false;
    var thiz = this;
    thiz.directions = {
        left: [-1, 0],
        right: [1, 0],
        up: [0, -1],
        down: [0, 1]
    };
    thiz.enemyDirection = 1; //1 for right, -1 for left; multiplier.
    thiz.viewportWidth = window.innerWidth;
    thiz.viewportHeight = window.innerHeight - 44;
    thiz.score = 0;
    thiz.asteroids = [];
    //Compute the scale of a square
    thiz.directionsTrying = [];
    thiz.createWall = function(pos, scale) {
        thiz.createSprite($("<div>")
            .addClass("si-wall")
            .css("width", scale)
            .css("height", scale), function() {}, pos);
    }
    thiz.handleKeydown = function(evt) {
        var found = true;
        if(evt.which == 119) {
            thiz.downDown = true;
        } else if(evt.which == 115) {
            thiz.upDown = true;
        } else if(evt.which == 32) {
            thiz.firing = true;
        } else if(evt.which == 100) {
            thiz.player.rotating = 1;
        } else if(evt.which == 97) {
            thiz.player.rotating = -1;
        };
    }
    thiz.handleKeyup = function(evt) {
        if(evt.which == 83) {
            thiz.upDown = false;
        } else if(evt.which == 87) {
            thiz.downDown = false;
        } else if(evt.which == 32) {
            //Do nothing
            thiz.firing = false;
        } else if(evt.which == 68 || evt.which == 65) {
            thiz.player.rotating = 0;
        }
    };
    thiz.createSprite = function(div, update, position) {
        div.addClass("si-sprite");
        div.css("left", position[0])
        div.css("top", position[1]);
        thiz.div.append(div);
        var sprite = {
            div: div,
            update: update,
            x: position[0],
            y: position[1],
            setPosition: function(pos) {
                this.x = pos[0];
                this.y = pos[1];
                this.div.css("left", Math.floor(pos[0]))
                    .css("top", Math.floor(pos[1]));
            },
            setX: function(x) {
                this.setPosition([x, this.y]);
            },
            setY: function(y) {
                this.setPosition([this.x, y]);
            },
            addX: function(x) {
                this.setPosition([this.x + x, this.y]);
            },
            addY: function(y) {
                this.setPosition([this.x, this.y + y]);
            }
        };
        thiz.sprites.push(sprite);
        return sprite;
    };
    thiz.createVelSprite = function(div, update, position, startVel) {
        var sprite = thiz.createSprite(div, function(deltaTime) {
            update(deltaTime); //Call the "superclass"'s update
            this.addX(this.velX * deltaTime);
            this.addY(this.velY * deltaTime);
        }, position);
        sprite.velX = startVel[0];
        sprite.velY = startVel[1];
        return sprite;
    };
    thiz.createBullet = function(position, velocity) {
        var sprite = thiz.createVelSprite($("<div>")
            .addClass("si-pellet"), function(deltaTime) {
                for(key in thiz.asteroids) {
                    var asteroid = thiz.asteroids[key];
                    var distX = Math.abs(asteroid.x - sprite.x);
                    var distY = Math.abs(asteroid.y - sprite.y);
                    var dist = Math.sqrt(distX * distX + distY * distY);
                    if(dist < 54) {
                        asteroid.hide();
                    }
                }
            }, position, velocity);
    }
    thiz.createEnemy = function(position, scale) {
        var sprite = thiz.createSprite($("<div>")
            .addClass("si-enemy"), function(deltaTime) {
                if(this.isCollidingWithPlayer()) {
                    console.log("You died.");
                }
            }, position);
        sprite.isCollidingWithPlayer = function() {
            var distX = Math.abs(this.x - thiz.player.x);
            var distY = Math.abs(this.y - thiz.player.y);
            var totalDist = Math.sqrt(distX * distX + distY * distY);
            if(totalDist <= this.div.width() / 2 + thiz.player.div.width() / 2) {
                return true;
            } else {
                return false;
            }
        }
        sprite.isCollidingWithOld = function(other) { //This is never used, keeping it around in case it becomes useful
            var theirWidth = other.div.width();
            var theirRadius = theirWidth / 2;
            var ourWidth = this.div.width();
            var ourRadius = theirWidth / 2;
            //We're doing circle collision here.
            //Get the point equadistant to both sprites.
            var point = [
                //X
                this.x + (other.x - this.x),
                //Y
                this.y + (other.y - this.y)
            ];
            //Is is contained within both of us? If so, return true.
            var ourA = point[0] - this.x;
            var ourB = point[1] - this.y;
            var ourC = Math.sqrt((ourA * ourA) + (ourB * ourB));
            var theirA = point[0] - other.x;
            var theirB = point[1] - other.y;
            var theirC = Math.sqrt((theirA * theirA) + (theirB * theirB));
            //Check to see if both theirC and ourC is less than the respective radii
            if(theirC < other.div.width() / 2) {
                if(ourC < this.div.width() / 2) {
                    //We're colliding
                    return true;
                }
            }
            return false;
        };
        sprite.div.css("width", Math.floor(scale))
            .css("height", Math.floor(scale));
    }
    thiz.stop = function() {
        thiz.stopped = true;
    };
    thiz.removeSprite = function(sprite) {
        delete thiz.sprites[thiz.sprites.indexOf(sprite)];
    };
    thiz.createAsteroid = function(position, speed) {
        //div update startpos startvel
        var sprite = thiz.createVelSprite($("<div>")
            .addClass("si-asteroid"), function() {
                if(!sprite.hidden) {
                    //Are we colliding with the player? If so, game over.
                    var distX = Math.abs(sprite.x - thiz.player.x);
                    var distY = Math.abs(sprite.y - thiz.player.y);
                    var dist = Math.sqrt(distX * distX + distY * distY);
                    if(dist < 96) {
                        thiz.stop();
                        App.dialog({
                            title: "You died",
                            okButton: "OK"
                        }, function() {

                        });
                    }
                }
            }, position, speed);
        sprite.hide = function() {
            this.div.animate({
                opacity: 0,
                width: 0,
                height: 0,
                transform: "translate(40px, 40px)"
            }, 400, "linear", function() {
                sprite.div.hide();
                sprite.hidden = true;
            });
        }
        thiz.asteroids.push(sprite);
        return sprite;
    }
    thiz.createRandomAsteroid = function() {
        return thiz.createAsteroid([0, 0], [20, 20]);
    }
    thiz.createPlayer = function() {
        var sprite = thiz.createSprite($("<div>")
            .addClass("si-player"), function(deltaTime) {
                if(thiz.leftDown) {
                    this.velX += this.acceleration * deltaTime;
                } else if(thiz.rightDown) {
                    this.velX -= this.acceleration * deltaTime;
                } else if(thiz.upDown) {
                    this.velY += Math.cos(Math.abs(360 - this.rotation) / 360 * 3.14159265 * 2) * this.acceleration;
                    this.velX += Math.sin(Math.abs(360 - this.rotation) / 360 * 3.14159265 * 2) * this.acceleration;
                } else if(thiz.downDown) {
                    this.velY -= Math.cos(Math.abs(360 - this.rotation) / 360 * 3.14159265 * 2) * this.acceleration;
                    this.velX -= Math.sin(Math.abs(360 - this.rotation) / 360 * 3.14159265 * 2) * this.acceleration;
                }
                if(thiz.firing) {
                    this.firingDelay += deltaTime;
                    if(this.firingDelay > 0.1) {
                        var velX = -Math.sin(Math.abs(360 - this.rotation) / 360 * 3.14159265 * 2) * 500;
                        var velY = -Math.cos(Math.abs(360 - this.rotation) / 360 * 3.14159265 * 2) * 500;
                        thiz.createBullet([this.x + 12, this.y + 12], [velX, velY]);
                        this.firingDelay = 0;
                    }
                }
                this.rotate(this.rotating * 200 * deltaTime);
                this.addX(this.velX);
                this.addY(this.velY);
            }, [300, 300]);
        sprite.velX = 0;
        sprite.velY = 0;
        sprite.firingDelay = 0;
        sprite.acceleration = 0.1;
        sprite.div.css("width", 32)
            .css("height", 32);
        sprite.rotation = 0;
        sprite.rotating = 0;
        sprite.rotate = function(amt) {
            this.rotation += amt;
            this.div.css("transform", "rotate(" + this.rotation + "deg)")
        }
        sprite.attemptTurn = function(direction) {
            //Attempt to turn in direction if there is no wall obstructing our path.
            //Get the square in the map that the sprite is in
            var x = Math.floor(this.x / thiz.squareScale);
            var y = Math.floor(this.y / thiz.squareScale);
            var newX = x + direction[0];
            var newY = y + direction[1];
            if(thiz.map[newY][newX] != "x") {
                //We can turn there! Yay!
                this.velX = 1.5 * thiz.squareScale * direction[0];
                this.velY = 1.5 * thiz.squareScale * direction[1];
            }
        };
        thiz.player = sprite;
    };
    thiz.start = function() {
        thiz.createPlayer();
        thiz.updateLoop();
    };
    thiz.updateLoop = function() {
        if(thiz.stopped) {
            return;
        }
        requestAnimationFrame(thiz.updateLoop);
        thiz.update();
    };
    thiz.asteroidTime = 0;
    thiz.update = function() {
        var currentTime = new Date();
        var millis = currentTime - thiz.prevPhysicsTime;
        var delta = millis / 1000;
        thiz.asteroidTime -= delta;
        if(thiz.asteroidTime <= 0) {
            thiz.asteroidTime = 5;
            thiz.createRandomAsteroid();
        }
        for(key in thiz.sprites) {
            var sprite = thiz.sprites[key];
            sprite.update(delta);
        }
        thiz.prevPhysicsTime = currentTime;
    }
}
