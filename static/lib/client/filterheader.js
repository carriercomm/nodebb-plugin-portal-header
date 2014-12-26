define('portal/header/filterheader', function () {
	var Filter = {};
	var filtermap = {};
	filtermap['/recent'] = true;
	filtermap['/tags'] = true;
	filtermap['/popular'] = true;
	filtermap['/users'] = true;
  filtermap['/unread'] = true;
  filtermap['/admin'] = true;
  filtermap['/category'] = true;
  filtermap['/topic'] = true;
  filtermap['/user'] = true;
  filtermap['/search'] = false;
  filtermap['/forum'] = false;
	filtermap['/portals'] = false;
  var cache = [];

	Filter.parse = function () {
		$('#main-nav li a').each(function () {
			var $this = $(this);
      if(filtermap[$this.attr('href')]){
        $this.parent().addClass('user-cpanel-item');
      }
      $this.find('span.visible-xs-inline').removeClass('visible-xs-inline');
    });

    $('#main-nav li.user-cpanel-item').each(function () {
      var $this = $(this);
      cache.push($this);
      $this.remove();
    });
	};

  Filter.show = function(path){
    cache.forEach(function(item){
      if($('.user-cpanel').length > 0){
        $('.user-cpanel').append(item);
      }else if(filtermap['/'+path]){
        $('#main-nav').append(item);
      }else{
        item.remove();
      }
    });
  }
	return Filter;
});
