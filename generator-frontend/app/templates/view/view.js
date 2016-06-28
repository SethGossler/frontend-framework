define('<%= answers.name %>',[], function (require) {
	var module = function($el) {
		console.log('init - <%= answers.name %>');
	}

	return module;
});
