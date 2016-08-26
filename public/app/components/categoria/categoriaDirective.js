app.directive('previewArticoli', function() {
	return {
	  	restrict: 'AE',
	  	controller: 'categoriaCtrl',
		templateUrl: "app/components/categoria/previewArticoliView.html"
	};
});