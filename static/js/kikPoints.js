$(document).ready(function() {
	Shop = {};
	points.debug = true;
	var button = document.getElementById("play-button");

	var paid = false;

	$(".arcade-button").on('tap', function(e) {
		if (!paid){
			e.preventDefault();
		}
	});

	$(".app-topbar").on('tap', function(e) {
		paid = false;
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