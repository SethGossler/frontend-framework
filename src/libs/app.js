require([],function(){
	function App() {
		console.log('%c####################\n#App.js Initializing\n####################', 'background: #bada55; color: #222');
		this.registeredModules = require.s.contexts['_'].registry
		this.init();
	}

	App.prototype.init = function(){
		this.initViewsLayouts();
	};

	App.prototype.initViewsLayouts = function() {
		for( module in this.registeredModules) {
			if( module !== "_@r4" ) { // don't load this one, some requirejs obj.
				(function(module) {
					require([module], function(thisModule){
						if(thisModule !== undefined) {
							var $elements = $('.'+module);
							$elements.each(function(){
								thisModule($(this));
							})
						}
					});
				}(module));
			}
		}
	};

	return new App();

});