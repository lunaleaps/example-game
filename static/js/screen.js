$(document).ready(function() {
	var ul;
	var liItems;
	var imageNumber;
	var imageWidth;
	var prev, next;
	var currentPostion = 0;
	var currentImage = 0;


  function init(){
    ul = document.getElementById('image_slider');
    liItems = ul.children;
    imageNumber = liItems.length;
    imageWidth = liItems[0].children[0].clientWidth;
    ul.style.width = parseInt(imageWidth * imageNumber) + 'px';
    prev = document.getElementById("previous-button");
    next = document.getElementById("next-button");
    generatePager(imageNumber);
    //.onclike = slide(-1) will be fired when onload;
    /*
    prev.onclick = function(){slide(-1);};
    next.onclick = function(){slide(1);};*/
    prev.onclick = function(){ onClickPrev();};
    next.onclick = function(){ onClickNext();};
  }

  function animate(opts){
    var start = new Date;
    var id = setInterval(function(){
      var timePassed = new Date - start;
      var progress = timePassed / opts.duration;
      if (progress > 1){
        progress = 1;
      }
      var delta = opts.delta(progress);
      opts.step(delta);
      if (progress == 1){
        clearInterval(id);
        opts.callback();
      }
    }, opts.delay || 17);
    //return id;
  }

  function slideTo(imageToGo){
    var direction;
    var numOfImageToGo = Math.abs(imageToGo - currentImage);
    // slide toward left

    direction = currentImage > imageToGo ? 1 : -1;
    currentPostion = -1 * currentImage * imageWidth;
    var opts = {
      duration:1000,
      delta:function(p){return p;},
      step:function(delta){
        ul.style.left = parseInt(currentPostion + direction * delta * imageWidth * numOfImageToGo) + 'px';
      },
      callback:function(){currentImage = imageToGo;}
    };
    animate(opts);
  }

  function onClickPrev(){
    if (currentImage == 0){
      slideTo(imageNumber - 1);
    }
    else{
      slideTo(currentImage - 1);
    }
  }

  function onClickNext(){
    if (currentImage == imageNumber - 1){
      slideTo(0);
    }
    else{
      slideTo(currentImage + 1);
    }
  }

	function generatePager(imageNumber){
		var pageNumber;
		var pagerDiv = document.getElementById('pager');
		for (i = 0; i < imageNumber; i++){
			var li = document.createElement('li');
			pageNumber = document.createTextNode(parseInt(i + 1));
			li.appendChild(pageNumber);
			pagerDiv.appendChild(li);
			// add event inside a loop, closure issue.
			li.onclick = function(i){
				return function(){
					slideTo(i);
				}
			}(i);
		}
		var computedStyle = document.defaultView.getComputedStyle(li, null);
		//border width 1px; offsetWidth = 22
		var liWidth = parseInt(li.offsetWidth);
		var liMargin = parseInt(computedStyle.margin.replace('px',""));
		pagerDiv.style.width = parseInt((liWidth + liMargin * 2) * imageNumber) + 'px';
	}
	window.onload = init;

	function kikPoints(){
		var id = kik.utils.random.uuid();
    var pointsValue = 1;
    var sku = 'com.herokuapp.kp-aracde.play';
		points.redeem(id, pointsValue, sku, function spend(transaction){
      if (transaction.status == "PROCESSED"){
        $("#testing").text("paid");
      } else {
        $("#testing").text("unpaid");
      }
		});
	}

	var start_button = document.getElementById("play-button");
	$(start_button).on('vmousedown', function(e){
    var paid = false;
    var str = 'paid';
    $("#testing").text("unpaid");
		var game_button;
		kikPoints();
    var str2 = $("#testing").text();
    if (str === str2){
      $("#testing").text("FOOD");
      paid = true;
    }
		switch (currentImage) {
		    case 0:
		    	if (paid){
		    		$(".pacman").click();
		    	}
		        break;
		    case 1:
		    	if (paid){
		        	$(".asteroids").click();
		    	}
		        break;
		    case 2:
		    	if (paid){
			        $(".pong").click();
			    }
		        break;
		    case 3:
		    	if (paid){
		        	$(".snake").click();
		    	}
		        break;
		    case 4:
		    	if (paid){
		        	$(".spaceInvaders").click();
		        }
		        break;
		    case 5:
		    	if (paid){
		        	$(".arkanoid").click();
		        }
		        break;
		}
	});
	
});
