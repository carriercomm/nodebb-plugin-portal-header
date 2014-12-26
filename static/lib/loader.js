"use strict";
require(['portal/header/filterheader'],function(filterheader){
  console.log('init')
  filterheader.parse();
});
$(window).on('action:ajaxify.end', function (event, data) {
  require(['portal/header/filterheader'],function(filterheader){
    filterheader.show(data.url.split('/')[0]);
  });
});
$(window).on('action:ajaxify.end', function (event, data) {
  require(['portal/header/filterheader'],function(filterheader){
    filterheader.show(data.url.split('/')[0]);
  });
});
