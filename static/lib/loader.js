"use strict";
(function(){

$(document).on('ready',function(){
  require(['portal/header/filterheader'],function(filterheader){
    filterheader.parse();
  });
});
$(window).on('action:ajaxify.end', function (event, data) {
  require(['portal/header/filterheader'],function(filterheader){
    filterheader.parse();
    filterheader.show(data.url);
  });
});
}());
