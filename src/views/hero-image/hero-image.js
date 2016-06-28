define('hero-image',[], function (require) {
	var module = function($el) {
		console.log('init - hero-image');
		$el.click(function(){
			console.log("HERO CLICK!");
		})
	}

	return module;
});
