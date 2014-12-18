/*App.controller('kik-points', function($page) {
	points.debug = true;

	var $button = $page.querySelector('.play-button');

	$button.onclick(function clicking() {
		var id = kik.utils.random.uuid();
		var amount = 2;
		sku = 'com.herokuapp.kp-aracde.play';
		points.redeem(id, amount, sku, function (transaction){
			if (transaction) {
				alert("Redeemed points!");
			} else {
				alert("No points redeemed!");
			}
		});
	});

	//points.getTransactions(function (transactions) {
	//	if (transactions) {
	//		alert("There are transactions");
	//	}
	//});

});*/


$(document).ready(function() {
	Shop = {};
	points.debug = true;
	var button = document.getElementById("play-button");

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
				alert("Redeemed points!");
			} else {
				alert("No points redeemed!");
			}
		});
	});

});