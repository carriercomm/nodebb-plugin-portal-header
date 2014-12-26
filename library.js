"use strict";
var app, async = module.parent.parent.require('async'),
db = module.parent.parent.require('./database'),
translator = module.parent.parent.require('../public/src/translator'),
SocketAdmin = module.parent.parent.require('./socket.io/admin').plugins,
config = require('./plugin.json'),
	path = require('path'),
	fs = require('fs');
(function (module) {
	var Plugin = {};
	var context = {};

	function renderAdmin(req, res, next) {
		db.getObject(config.id+':settings',function(err,data){
			if(data){
				data.headers = JSON.parse(data.headers);
			}
			res.render('admin/plugins/portalheader',  data || {});
		})
	}

	function saveSettings(socket, data, callback) {
		if (!data) {
			return callback(new Error('[[error:invalid-data]]'));
		}
		db.setObject(config.id+':settings',data,function(err){
			callback(err);
		})
	}

	Plugin.init = function (params, callback) {
		var middleware = params.middleware,
			controllers = params.controllers;
		app = params.app;
		context.templates = context.templates || {};

		params.router.get('/admin/plugins/portalheader', middleware.admin.buildHeader, renderAdmin);
		params.router.get('/api/admin/plugins/portalheader', renderAdmin);


		SocketAdmin['portalheader'] = {
			saveSettings:saveSettings
		}

		var templatesToLoad = [
			"admin/plugins/widgets/usercpanel.tpl"
		];

		function loadTemplate(template, next) {
			fs.readFile(path.resolve(__dirname, './static/templates/' + template), function (err, data) {
				if (err) {
					console.log(err.message);
					return next(err);
				}
				context.templates[template] = data.toString();
				next(null);
			});
		}
		async.each(templatesToLoad, loadTemplate);
		callback();
	};

	Plugin.getWidgets = function (widgets, callback) {
		widgets = widgets.concat([{
			widget: "userCPanel",
			name: "User CPanel",
			description: "List the fourm menus and define custom menus into CPanel",
			content: context.templates['admin/plugins/widgets/usercpanel.tpl']
		}]);
		callback(null, widgets);
	};

	Plugin.renderUserCPanel = function (widget, callback) {
		app.render('partials/usercpanel', {

		}, function (err, html) {
			translator.translate(html, function (translatedHTML) {
				callback(err, translatedHTML);
			});
		});
	};

	Plugin.buildAdminHeader = function (header, callback) {
		header.plugins.push({
			"name": "Portal Mark Header",
			"class": "",
			"route": "/plugins/portalheader"
		});
		callback(null, header);
	};
	Plugin.buildHeader = function (header, callback) {
		db.getObject(config.id+':settings',function(err,data){
			if(data){
				data.headers = JSON.parse(data.headers);
				header.navigation = header.navigation.concat(data.headers);
			}
			callback(false, header);
		})
	};

	module.exports = Plugin;
}(module));
