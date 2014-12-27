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

	function highlightNavigationLink(active, check) {
		$('#main-nav li,.user-cpanel li').removeClass('active');
		if (active) {
			$('#main-nav li a,.user-cpanel li a').each(function () {
				var href = $(this).attr('href');
				if (active === "sort-posts" || active === "sort-reputation" || active === "search" || active === "latest" || active === "online") {
					active = 'users';
				}
				if ((href && href.match(active)) || check == href) {
					$(this.parentNode).addClass('active');
					return false;
				}
			});
		}
	}
	Filter.parse = function () {
		var oldheader = {};
		$('#main-nav li a').each(function () {
			var $this = $(this);
			if (filtermap[$this.attr('href')] || $this.parent().hasClass('cpanel')) {
				$this.parent().addClass('user-cpanel-item');
			}
			if ($this.parent().hasClass('show-title')) {
				$this.find('span.visible-xs-inline').removeClass('visible-xs-inline');
			} else {
				$this.find('span').addClass('visible-xs-inline');
			}
			if (oldheader[$this.attr('href')]) {
				if ($this.parent().hasClass('force')) {
					oldheader[$this.attr('href')].remove();
					oldheader[$this.attr('href')] = $this.parent();
				} else {
					$this.parent().remove();
				}
			} else {
				oldheader[$this.attr('href')] = $this.parent();
			}
		});

		$('#main-nav li.user-cpanel-item').each(function () {
			var $this = $(this);
			cache.push($this.detach());
		});
	};

	Filter.show = function (url) {
		var path = url || window.location.pathname,
			parts = path.split('/'),
			check = parts[0],
			active = parts[parts.length - 1];

		cache.forEach(function (item) {
			if ($('.user-cpanel').length > 0) {
				$('.user-cpanel').append(item);
			} else if (check == 'forum' || filtermap['/' + check] && !item.hasClass('cpanel-only')) {
				$('#main-nav').append(item);
			} else {
				item.remove();
			}
		});
		highlightNavigationLink(active, '/' + check);
	}
	return Filter;
});
