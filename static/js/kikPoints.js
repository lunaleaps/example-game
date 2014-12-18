$(document).ready(function() {
	points.debug = true;
	var start_button = document.getElementById("play-button");
	
	var paid = true;

	$(".arcade-button").on('tap', function(e) {
		if (!paid){
			e.preventDefault();
		}
	});

	// Once a user chooses a game, they have used up the turn they bought.
	$(".app-button").on('tap', function(e) {
		paid = false;
	});

	$(start_button).on('vmousedown', function(e){
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