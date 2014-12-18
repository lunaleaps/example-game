$(document).ready(function() {
	Shop = {};
	points.debug = true;
	var button = document.getElementById("play-button");

	var paid = false;

	$(document).on('tap', '.app-button', function() {
		if (!paid){
			$(this).off('touchstart', this);
	    	$(this).off('touchmove', this);
		} else {
			$(this).on('touchstart', this);
	    	$(this).on('touchmove', this);
		}
	});

	//button.addEventListener("touchstart", touchHandler, false);
	$(button).on('vmousedown', function(e){
        // Variables for storing mouse position on click
        var mx = e.pageX,
        my = e.pageY;
        var id = kik.utils.random.uuid();
        var pointsValue = 2;
        var sku = 'com.herokuapp.kp-aracde.play';

		points.redeem(id, pointsValue, sku, function spend(transaction){
			if (transaction) {
				paid = true;
			} else {
				paid = false;
			}
		});
	});

});