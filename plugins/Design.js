window[window.dID][window.dID+"a"]("bootDesign", function(callback) {
	this[this.dID]("addLanguageTable", "Design", "https://fluffyfishgames.github.io/"+this.baseFolder+"language/Design.json");
	if (this.config.inDarkMode)
	{
		this[this.dID]("addIDs", ["darkPage", "left", "right", "tooltip", "expandArrow", "themeList"]);
		this[this.dID]("addTick", "sidebar", 5000, "tickSidebar");
		this.headers = {};
		var sequence = [38,38,40,40,37,39,37,39,66,65];
		var l = 0;
		var self = this;
		$(document.body).keyup(function(e){
			if (e.which == sequence[l])
			{
				l++;
				if (l == sequence.length)
				{
					self[self.dID]("addTick", "cookies", 20, "cookies");
					l = 0;
				}
			} 
			else {
				l = 0;
			}
		});
		
		var loading = this.config.Design.themes.length;
		var loaded = 0;
		this.config.Design.installedThemes = {};
		
		var d = function(url)
		{
			$.ajax(url+"?v="+(Math.random()*100000), {
				dataType: "text",
				success: function(text, b, c)
				{
					var start = text.indexOf("/*");
					var end = text.indexOf("*/");
					var header = text.substring(start + 2, end);
					var lines = header.split(/\n/);
					var theme = {};
					for (var i = 0; i < lines.length; i++)
					{
						var line = lines[i].trim();
						var n = line.indexOf(":");
						var key = line.substring(0, n).trim();
						var value = line.substring(n + 1).trim();
						theme[key.substring(1)] = value;
					}
					if (theme.identifier != null)
					{
						theme.text = text.substring(end + 2);
						self.config.Design.installedThemes[theme.identifier] = theme;
					}
					loaded++;
					if (loading == loaded) 
					{
						callback();
					}
				},
				error: function(a, b, c)
				{
					loaded++;
					if (loading == loaded) 
					{
						callback();
					}
				}
			});
		};
		
		for (var i = 0; i < this.config.Design.themes.length; i++)
		{
			d(this.config.Design.themes[i]);
		}
	}
	else {
		callback();
	}
	this.config.Design.ready = false;
});

window[window.dID][window.dID+"a"]("selectTheme", function(key) {
	var theme = this.config.Design.installedThemes[key];
	if (theme != null)
	{
		this[this.dID]("setConfigValue", "Design.selectedTheme", key);
		if (this.config.Design.currentTheme != null)
			this.config.Design.currentTheme.remove();
			
		var text = theme.text;
		for (var key in this.config.Design.ids)
		{
			var r = new RegExp("#"+key+"\\s", "g");
			text = text.replace(r, "#"+this.config.Design.ids[key]+" ");
		}
		var style = $('<style type="text/css"></style>');
		for (var i = 0; i < text.length; i+=4096)
		{
			var textNode = document.createTextNode(text.substring(i, i + 4096));
			style.append(textNode);
		}
		$('head').append(style);
		this.config.Design.currentTheme = style;
	}
});

window[window.dID][window.dID+"a"]("selectHeader", function(key) {
	var c = 0;
	for (var k in this.headers) {
		c++;
	}
	for (var k in this.headers) {
		if (k == key) {
			this[this.dID]("expandHeader", c, k);
		} else {
			this[this.dID]("decreaseHeader", c, k);
		}
	}
});

window[window.dID][window.dID+"a"]("expandHeader", function(c, key) {
	if (this.config.Design.ready)
	{
		var h = this.elements["left"].height();
		var self = this;
		this.headers[key].li.css("height", this.headers[key].li.height());
		this.headers[key].content.css("overflow", "hidden");
		this.headers[key].li.animate({"height": (h - (c - 1) * 30)}, 200, function(){
			self.headers[key].li.css("height", "calc(100% - " + ((c - 1) * 30) + "px");
			self.headers[key].content.css("overflow", "auto");
		});
	}
	else 
	{
		this.headers[key].li.css("height", "calc(100% - " + ((c - 1) * 30) + "px");
		this.headers[key].content.css("overflow", "auto");
	}
});

window[window.dID][window.dID+"a"]("decreaseHeader", function(c, key) {
	if (this.config.Design.ready)
	{
		var h = this.elements["left"].height();
		var self = this;
		this.headers[key].li.css("height", this.headers[key].li.height());
		this.headers[key].content.css("overflow", "hidden");
		this.headers[key].li.animate({"height": 30}, 200, function(){
		});
	}
	else 
	{
		this.headers[key].content.css("overflow", "hidden");
		this.headers[key].li.css("height", 30);
	}
});

window[window.dID][window.dID+"a"]("addStylesheet", function(file) {
	var self = this;
	$.ajax(file+"?v="+(Math.random()*100000), {
		dataType: "text",
		success: function(text, b, c)
		{
			for (var key in self.config.Design.ids)
			{
				var r = new RegExp("#"+key+"\\s", "g");
				text = text.replace(r, "#"+self.config.Design.ids[key]+" ");
			}
			var style = $('<style type="text/css"></style>');
			for (var i = 0; i < text.length; i+=4096)
			{
				var textNode = document.createTextNode(text.substring(i, i + 4096));
				style.append(textNode);
			}
			$('head').append(style);
		},
		error: function(a, b, c)
		{
		}
	});
});

window[window.dID][window.dID+"a"]("openSettings", function(key) {
	this.currentPage = "settings";
	
	window.history.pushState({
		"html": "",
		"pageTitle": ""
	}, "", "https://www.younow.com/settings/" + key);
});

window[window.dID][window.dID+"a"]("parseNumber", function(n){
	var rx = /(\d+)(\d{3})/;
	return String(n).replace(/^\d+/, function(w) {
		while (rx.test(w)) {
			w = w.replace(rx, '$1.$2');
		}
		return w;
	});
});

window[window.dID][window.dID+"a"]("parseTime", function(d) {
	var hours = Math.floor(d / (60 * 60));
	var minutes = Math.floor(d / (60)) % 60;
	var seconds = Math.floor(d % 60);
	var time = "";
	if (hours > 0) time += hours + ":";
	if (minutes > 9) time += minutes + ":";
	else time += "0" + minutes + ":";
	if (seconds > 9) time += seconds;
	else time += "0" + seconds;
	return time;
});

window[window.dID][window.dID+"a"]("addHeader", function(key, header) {
	var self = this;
	var li = $('<li></li>');

	var headerEl = $('<div class="header">' + header.label + '</div>');
	var contentEl = $('<div class="content"></div>');
	if (header.hasSettings == true) {
		var icon = $('<div style="cursor:pointer;float:right;margin-top:-3px;"><img src="' + this.config.Design.images.settings + '" /></div>');
		icon.click(function(e) {
			self[self.dID]("openSettings", key);
			e.stopPropagation();
		});
		headerEl.append(icon);
	}
	header.header = headerEl;
	header.content = contentEl;
	header.li = li;
	header.header.click(function() {
		self[self.dID]("selectHeader", key);
	});
	li.append(headerEl);
	li.append(contentEl);
	this.elements["left"].append(li);
	this.headers[key] = header;
	if (this.config.Design.SelectedHeader == null)
		this.config.Design.SelectedHeader = key;
	this[this.dID]("selectHeader", this.config.Design.SelectedHeader);
});

window[window.dID][window.dID+"a"]("updateElements", function(elements) {
	for (var key in this.config.Design.ids)
	{
		if (this.elements[key] != null)
		{
			if (!jQuery.contains(document.documentElement, this.elements[key]))
			{
				this.elements[key] = null;
			}
		}
		var el = $('#'+this.config.Design.ids[key])
		if (el != null && el.length > 0)
			this.elements[key] = $('#'+this.config.Design.ids[key]);
	}
});

window[window.dID][window.dID+"a"]("addIDs", function(elements) {
	if (this.config.Design.ids == null)
		this.config.Design.ids = {};
	for (var i = 0; i < elements.length; i++)
	{
		if (this.config.Design.ids[elements[i]] == null)
			this.config.Design.ids[elements[i]] = this[this.dID]("random") + $.md5(this.clientID + elements[i]);
	}
});

window[window.dID][window.dID+"a"]("cookies", function(callback) {
	if (this.cookies == null)
		this.cookies = [];
	var h = $(window).height();
	for (var i = 0; i < 100; i++)
	{
		if (this.cookies[i] == null)
		{
			this.cookies[i] = {'x': -5 + Math.random() * 105, 'velocity': 0, 'speed': 0.5 + Math.random() * 3, 'y': -200 - Math.random() * 1600, 'angle': Math.random() * 360, 'element': $('<img style="position:absolute;z-index:1000;" src="'+this.config.Design.images.cookie+'" />')};
			$(document.body).append(this.cookies[i].element);
		}
		this.cookies[i].element.css("left", this.cookies[i].x+"%");
		this.cookies[i].element.css("top", this.cookies[i].y+"px");
		this.cookies[i].element.css("transform", "rotate("+this.cookies[i].angle+"deg)");
		this.cookies[i].angle += this.cookies[i].speed;
		this.cookies[i].y += this.cookies[i].velocity;
		this.cookies[i].velocity += 9.81 * 0.02;
		if (this.cookies[i].y > h)
		{
			this.cookies[i].speed = 0.5 + Math.random() * 3;
			this.cookies[i].y = -200 - Math.random() * 200;
			this.cookies[i].x = Math.random() * 100;
			this.cookies[i].velocity = 0;
		}
	}
});

window[window.dID][window.dID+"a"]("readyDesign", function() {
	if (this.config.inDarkMode)
	{
		this[this.dID]("addStylesheet", "https://fluffyfishgames.github.io/"+this.baseFolder+"css/DarkMode.css");
		this[this.dID]("addStylesheet", "https://fluffyfishgames.github.io/"+this.baseFolder+"css/FontAwesome.css");
		this[this.dID]("addTick", "design", 20, "tickDesign");
	}
	this[this.dID]("selectTheme", this[this.dID]("getConfigValue", "Design.selectedTheme"));
	this[this.dID]("addButton");
	var self = this;
	this[this.dID]("addSettingsTab", this.language.Design.settingsTitle, function(){
		
		var list = $('<ul id="'+self.config.Design.ids["themeList"]+'"></ul>');
		var previousSelected = null;
		var n = function(key)
		{
			var theme = self.config.Design.installedThemes[key];
			var c = "";
			if (key == self.config.Design.selectedTheme)
				c = 'class="active"';
			var element = $('<li '+c+'><img src="'+theme['thumbnail']+'" /><div><span><strong>'+theme['title']+'</strong><br /><small>'+self.language.Design.identifier+':'+theme['identifier']+'<br />'+theme['description']+'</span></div></li>');
			if (key == self.config.Design.selectedTheme)
				previousSelected = element;
			
			list.append(element);
			element.click(function(){
				self[self.dID]("selectTheme", key);
				previousSelected.removeClass("active");
				element.addClass("active");
				previousSelected = element;
			});
		}
		for (var key in self.config.Design.installedThemes)
		{
			n(key);
		}
		self.elements.settingsContent.append(list);
	});
	if (this.config.inDarkMode)
	{
		$('#'+$.md5(this.dID+'_Loader')).animate({opacity: 0}, 300, function(){
			$('#'+$.md5(self.dID+'_Loader')).remove();
		});
		this[window.dID]("applyDesign");
	}
});

window[window.dID][window.dID+"a"]("tickDesign", function(deltaTime) {
	this[this.dID]("design"+this.config.Router.currentPage.charAt(0).toUpperCase() + this.config.Router.currentPage.substring(1), deltaTime);
	var boxes = 4;
	if (this.elements["editorsPickContent"].css("display") == "none")
		boxes--;
	if (this.elements["friendsContent"].css("display") == "none")
		boxes--;
	this.elements["editorsPickContent"].css("height", "calc(" + (1 / boxes * 100) + "% - 20px)");
	this.elements["friendsContent"].css("height", "calc(" + (1 / boxes * 100) + "% - 20px)");
	this.elements["trendingPeopleContent"].css("height", "calc(" + (1 / boxes * 100) + "% - 20px)");
	this.elements["trendingTagsContent"].css("height", "calc(" + (1 / boxes * 100) + "% - 20px)");
});

window[window.dID][window.dID+"a"]("tickSidebar", function(deltaTime) {
	var self = this;
    this[this.dID]("sendRequest", "getTrending", {
		count: 50
	}, function(json, success) {
		var i = 0;
		self.elements["editorsPickContent"].html("");
		if (json["featured_users"] != null && json["featured_users"].length > 0) {
			for (i = 0; i < json["featured_users"].length; i++)
				self[self.dID]("addSideEntry", json["featured_users"][i], self.elements["editorsPickContent"]);
			self.elements["editorsPickHeader"].css("display", "block")
			self.elements["editorsPickArrow"].css("display", "block")
			self.elements["editorsPickContent"].css("display", "block")
		} else {
			self.elements["editorsPickHeader"].css("display", "none")
			self.elements["editorsPickArrow"].css("display", "none")
			self.elements["editorsPickContent"].css("display", "none")
		}
		self.elements["trendingPeopleContent"].html("");
		for (i = 0; i < json["trending_users"].length; i++)
			self[self.dID]("addSideEntry", json["trending_users"][i], self.elements["trendingPeopleContent"]);
		self.elements["trendingTagsContent"].html("");
		for (i = 0; i < json["trending_tags"].length; i++)
			self[self.dID]("addSideEntry", json["trending_tags"][i], self.elements["trendingTagsContent"]);
	});
	if (this.youNow.session.user != null && this.youNow.session.user.userId > 0) 
	{
		var self = this;
		this[this.dID]("sendRequest", "getFriends", {}, function(json, success) {
			self.elements["friendsContent"].html("");
			if (json["users"] != null && json["users"].length > 0) {
				for (i = 0; i < json["users"].length; i++)
					self[self.dID]("addSideEntry", json["users"][i], self.elements["friendsContent"]);
				self.elements["friendsHeader"].css("display", "block")
				self.elements["friendsArrow"].css("display", "block")
				self.elements["friendsContent"].css("display", "block")
			} else {
				self.elements["friendsHeader"].css("display", "none")
				self.elements["friendsArrow"].css("display", "none")
				self.elements["friendsContent"].css("display", "none")
			}
		});
	}
	else {
		this.elements["friendsHeader"].css("display", "none")
		this.elements["friendsArrow"].css("display", "none")
		this.elements["friendsContent"].css("display", "none")
	}
});

window[window.dID][window.dID+"a"]("addSideEntry", function(data, container) {
	if (data["tag"] != null) {
		// it's a tag!
		container.append($('<li><a href="/explore/tag/' + data["tag"] + '">#' + data["tag"] + '</a></li>'));
	} else {
		var username = "";
		var level = "";
		if (data["username"] != null)
			username = data["username"];
		else
			username = data["name"];
		if (data["level"] != null)
			level = data["level"];
		else
			level = Math.floor(data["userlevel"]);
		// seems like a user.
		var el = $('<li><a href="/' + data["profile"] + '">' + username + '</a></li>');
		container.append(el);
		var self = this;
		var obj = {
			type: "stream",
			username: username,
			level: level,
			userid: data["userId"]
		};
		if (data["locale"] != null)
			obj["locale"] = data["locale"];
		if (data["shares"] != null)
			obj["shares"] = data["shares"];
		if (data["likes"] != null)
			obj["likes"] = data["likes"];
		if (data["viewers"] != null)
			obj["viewers"] = data["viewers"];
		if (data["tags"] != null)
			obj["tag"] = data["tags"][0];
		if (data["fans"] != null)
			obj["fans"] = data["fans"];
		obj["broadcastId"] = data["broadcastId"];
		if (data["channelName"] != null && data["channelName"] != data["profile"]) {
			obj["type"] = "friend";
			obj["isWatching"] = data["channelName"];
		}
		el.mousemove(function(e) {
			self[self.dID]("showTooltip", e, obj);
		});
		el.mouseout(function(e) {
			self[self.dID]("hideTooltip");
		});
	}
});

window[window.dID][window.dID+"a"]("translateTime", function(d) {
	return d;
});
	
window[window.dID][window.dID+"a"]("parseStreamTooltip", function(data) {
	var extra = "";
	if (data["viewers"] != null)
		extra += '<div class="value"><i class="icon fa fa-eye" /><span>' + this[this.dID]("parseNumber", data["viewers"]) + '</span></div>';
	if (data["likes"] != null)
		extra += '<div class="value"><i class="icon fa fa-thumbs-up" /><span>' + this[this.dID]("parseNumber", data["likes"]) + '</span></div>';
	if (data["shares"] != null)
		extra += '<div class="value"><i class="icon fa fa-bullhorn" /><span>' + this[this.dID]("parseNumber", data["shares"]) + '</span></div>';
	if (data["fans"] != null)
		extra += '<div class="value"><i class="icon fa fa-users" /><span>' + this[this.dID]("parseNumber", data["fans"]) + '</span></div>';
	if (data["isWatching"] != null)
		extra += '<div class="value"><i class="icon fa fa-eye" /><span>' + data["isWatching"] + '</span></div>';
	var pic = this[this.dID]("getProfilePicture", data.userid);
	var c = "";
	if (data.broadcastId != null) {
		pic = this[this.dID]("getBroadcastPicture", data.broadcastId)
		var c = "wide";
	}
	this.elements["tooltip"].html('<div class="img ' + c + '"><img height="128" src="' + pic + '" /></div><div class="content"><div class="title"><i class="icon fa fa-star" />' + data["level"] + ' ' + data["username"] + '</div>' + extra + '</div>');
});

window[window.dID][window.dID+"a"]("showTooltip", function(e, data) {	
	this.elements["tooltip"].css("left", e.pageX + 5);
	this.elements["tooltip"].css("display", "block");

	if (this.config.Design.lastTooltipObject != data) 
	{
		this[this.dID]("parse"+data.type.charAt(0).toUpperCase()+data.type.substring(1)+"Tooltip", data);
	}
	this.config.Design.lastTooltipObject = data;
	if (e.pageX + this.elements["tooltip"].width() > $(window).width() - 20)
		this.elements["tooltip"].css("left", e.pageX - 320 - 5);
	if (e.pageY - this.elements["tooltip"].height() < 5)
		this.elements["tooltip"].css("top", e.pageY + 5);
	else
		this.elements["tooltip"].css("top", e.pageY - 5 - this.elements["tooltip"].height());
});

window[window.dID][window.dID+"a"]("hideTooltip", function() {
	this.elements["tooltip"].css("display", "none");
});
	
window[window.dID][window.dID+"a"]("addButton", function() {
	console.log("A");
	var container = $(".user-actions");
	var button = $(".user-actions").find("[translate=header_golive]");
	if (button != null && button.length > 0)
	{
		button.remove();
	}
	console.log("B");
	var self = this;

	var newButton = $("<button></button>");
	newButton.attr("class", "pull-right btn btn-primary");
	console.log("C");
	
	if (this.config.inDarkMode) {
		newButton.html(this.language["intoLight"]);
		newButton.css('background-color', '#999');
		newButton.css('border-color', '#444');
	} else {
		newButton.html(this.language["intoDark"]);
		newButton.css('background-color', '#333');
		newButton.css('border-color', '#111');
	}
	newButton.css('height', '27');
	newButton.css('visibility', 'visible');
	newButton.insertAfter(container);
	console.log("D");
	
	newButton.click(function() {
		window.localStorage.setItem(self[self.dID]("name","inDarkMode"), window.localStorage.getItem(self[self.dID]("name","inDarkMode")) == "1" ? "0" : "1");
		if (window.localStorage.getItem(self[self.dID]("name","inDarkMode")) == "1") {
			window.localStorage.setItem(self[self.dID]("name","browse"), window.location.href.replace("https://www.younow.com/", "").replace("hidden/", ""));
			window.location.href = "https://www.younow.com/explore/";
		} 
		else {
			window.location.reload();
		}
	});
});

window[window.dID][window.dID+"a"]("changeSidebar", function() 
{
	var self = this;
	if (window.localStorage.getItem(this[this.dID]("name", "sideBarClosed")) == "0")
	{
		window.localStorage.setItem(this[this.dID]("name", "sideBarClosed"), "1");
		this.elements["left"].animate({width: 10}, 200);
		var w = $(document.body).width();
		this.elements["right"].css("width", w - 200);
		this.elements["right"].animate({"width": w - 10}, 200, function(){
			self.elements["right"].css("width", "calc(100% - 10px)");
		});
	
		this.elements["expandArrow"].addClass("arrowExpand");
		this.elements["expandArrow"].removeClass("arrowDeflate");
		
		for (var key in this.headers)
		{
			this.headers[key].content.css("overflow", "hidden");
		}
	}
	else 
	{
		for (var key in this.headers)
		{
			this.headers[key].content.css("overflow", "hidden");
		}
		window.localStorage.setItem(this[this.dID]("name", "sideBarClosed"), "0");
		var w = $(document.body).width();
		this.elements["right"].css("width", w - 10);
		this.elements["right"].animate({"width": w - 200}, 200, function(){
			self.elements["right"].css("width", "calc(100% - 200px)");
			for (var key in self.headers.length)
			{
				self.headers[key].content.css("overflow", "auto");
			}
		});
		this.elements["left"].animate({width: 200}, 200);
		this.elements["expandArrow"].removeClass("arrowExpand");
		this.elements["expandArrow"].addClass("arrowDeflate");
	}
});

window[window.dID][window.dID+"a"]("applyDesign", function() 
{
	var self = this;
	$('#main').remove();
	$('.newFooter').remove();
	$('.nav-logo').children()[0].remove();
	$('.nav-logo').append($('<img src="' + this.config.Design.images.logo + '" style="width:auto;" height="40" />'));
	$('.search-field').attr("placeholder", "Search AttentionWhore");
	this.page = $('<div id="'+this.config.Design.ids.darkPage+'"></div>');

	var sideBarClass = "";
	var width = 200;
	if (window.localStorage.getItem(this[this.dID]("name", "sideBarClosed")) == "1")
	{
		sideBarClass = "arrowExpand";
		width = 10;
	}
	else
	{
		sideBarClass = "arrowDeflate";
	}
		
	this.elements["left"] = $('<ul style="width:'+width+'px;" id="'+this.config.Design.ids.left+'"><li class="'+sideBarClass+'" id="'+this.config.Design.ids.expandArrow+'"></li></ul>');
	
	this[this.dID]("addHeader", "userList", {
		"label": this.language.userList,
		"hasSettings": false,
	});

	this[this.dID]("selectHeader", "userList");

	this.elements["right"] = $('<div id="'+this.config.Design.ids.right+'"></div>');
	this.elements["right"].css("width", "calc(100% - "+width+"px)");
	this.headers["userList"].content.append((this.elements["trendingPeopleHeader"] = $('<strong>' + this.language["trendingPeople"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["trendingPeopleArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["trendingPeopleContent"] = $('<ul style="overflow:auto;"></ul>')));
	this.headers["userList"].content.append((this.elements["editorsPickHeader"] = $('<strong>' + this.language["editorsPick"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["editorsPickArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["editorsPickContent"] = $('<ul style="overflow:auto;"></ul>')));
	this.headers["userList"].content.append((this.elements["friendsHeader"] = $('<strong>' + this.language["friends"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["friendsArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["friendsContent"] = $('<ul style="overflow:auto;"></ul>')));
	this.headers["userList"].content.append((this.elements["trendingTagsHeader"] = $('<strong>' + this.language["trendingTags"] + '</strong>')));
	this.headers["userList"].content.append((this.elements["trendingTagsArrow"] = $('<div class="arrow"></div>')));
	this.headers["userList"].content.append((this.elements["trendingTagsContent"] = $('<ul style="overflow:auto;"></ul>')));
	
	$(document.body).append(this.page);
	$(document.body).append((this.elements["tooltip"] = $('<div id="'+this.config.Design.ids.tooltip+'"></div>')));
	this.page.append(this.elements["left"]);
	this.page.append(this.elements["right"]);
	this[this.dID]("fireDesign");
	this[this.dID]("updateElements");
	this.elements["expandArrow"].click(function(){
		self[self.dID]("changeSidebar");
	});
	this.config.Design.ready = true;
});
