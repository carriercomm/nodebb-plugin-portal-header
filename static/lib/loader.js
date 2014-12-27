"use strict";
require(['portal/header/filterheader'],function(filterheader){
  filterheader.parse();
});
$(window).on('action:ajaxify.end', function (event, data) {
  require(['portal/header/filterheader'],function(filterheader){
    filterheader.show(data.url);
  });
});
$(window).on('action:ajaxify.end', function (event, data) {
  require(['portal/header/filterheader'],function(filterheader){
    filterheader.show(data.url);
  });
});
