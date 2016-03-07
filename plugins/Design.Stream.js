window[window.dID][window.dID+"a"]("bootDesignStream", function(callback) {
	var self = this;
	this[this.dID]("addLanguageTable", "Design.Stream", "https://fluffyfishgames.github.io/"+this.baseFolder+"language/Design.Stream.json");
    this[this.dID]("addIDs", ["streamBar", "streamView", "streamBar", "streamInfo", "stream", "likeImage", "likeCount", 
							  "shareCount", "time", "chatMessages", "viewerCount", "chatTab", "audienceTab", "infoTab", 
							  "infoList", "viewerList", "chatOptions", "writeInChat", "writeInTrending", "writeInTag", 
							  "intoTag", "chatMessage", "trendingList", "chat", "streamInfoAge", "streamInfoBarsEarned", 
							  "streamInfoCoins", "streamInfoMaxLikes", "streamInfoCountry", "streamInfoFans", 
							  "streamInfoPartner", "streamInfoLevel", "streamInfoPoints", "streamInfoDevice", 
							  "streamInfoBrowser", "streamInfoConnection", "streamInfoOSVersion", "streamInfoProvider", 
							  "streamInfoStreamURL", "streamInfoDisplayViewers", "streamInfoMobileViewers", 
							  "streamInfoMaxViewers", "streamInfoTag", "streamInfoPosition", "streamInfoReconnects", 
							  "streamInfoFeaturedTime", "streamInfoGiftsValue", "streamInfoNewFans", "streamInfoBitrate", 
							  "streamInfoFPS", "newChatMessages"]);
    this[this.dID]("addRoute", "stream", /[a-zA-Z0-9_\.]+/, "openStream", 1);
	this[this.dID]("addLibrary", "https://fluffyfishgames.github.io/libs/flowplayer.js");
	this[this.dID]("addLibrary", "https://fluffyfishgames.github.io/libs/uaparser.js");
	this.config.Design.Stream = {};
	this[this.dID]("onPageChange", function(){
		if (self.config.Router.currentPage != "stream")
		{
			self.config.Design.Stream.lastName = null;
			if (self.config.Design.Stream.pusher != null)
			{
				self.config.Design.Stream.pusher.disconnect();
				self.config.Design.Stream.pusher = null;
			}
			self[self.dID]("removeTick", "updateStream");
			self[self.dID]("removeTick", "updateStreamInfo");
			self[self.dID]("removeTick", "updateStreamViewer");
		}
	});
	callback();
});

window[window.dID][window.dID+"a"]("updateStream", function(deltaTime) {
	var self = this;
	this[this.dID]("sendRequest", "getBroadcast", {
		username: this.config.Design.Stream.name
	}, function(json, success) {
		if (json.user != null && json.user.profileUrlString.toLowerCase() == self.config.Design.Stream.name.toLowerCase())
			self.config.Design.Stream.data = json;
		else 
		{
			window.history.pushState({ 
				"html": "",
				"pageTitle": ""
			}, "", "https://www.younow.com/" + self.config.Design.Stream.name + "/channel");
		}
	});
	this[this.dID]("updateStreamTrending");
});

window[window.dID][window.dID+"a"]("openStream", function(parts) {
	this.config.Design.Stream.data = null;
	this[this.dID]("removeTick", "updateStream");
	this[this.dID]("removeTick", "updateStreamInfo");
	this[this.dID]("removeTick", "updateStreamViewer");
	this.config.Design.Stream.name = parts[0];
	var self = this;
	
	this[this.dID]("sendRequest", "getBroadcast", {
		username: this.config.Design.Stream.name
	}, function(json, success) {
		if (json.user != null && json.user.profileUrlString.toLowerCase() == self.config.Design.Stream.name.toLowerCase())
		{
			self.config.Design.Stream.data = json;
			self[self.dID]("updateStreamInfo");
			self[self.dID]("updateStreamTrending");
			self[self.dID]("openChat");
		}
		else 
		{
			window.history.pushState({ 
				"html": "",
				"pageTitle": ""
			}, "", "https://www.younow.com/" + self.config.Design.Stream.name + "/channel");
		}
	});
});

window[window.dID][window.dID+"a"]("updateStreamTrending", function(parts) {
	if (this.config.Router.currentPage == 'stream' && this.config.Design.Stream.data != null) 
	{
		var self = this;
		this[this.dID]("sendRequest", "getPlayData", {
			playDataURL: this.config.Design.Stream.data.PlayDataBaseUrl,
			userID: this.config.Design.Stream.data.userId
		}, function(json, success) {
			self.elements["trendingList"].html("");
			for (var i = 0; i < json.onBroadcastPlay.queues[0].items.length; i++) {
				self[self.dID]("addStreamTrendingUser", json.onBroadcastPlay.queues[0].items[i]);
			}
		});
	}
});

window[window.dID][window.dID+"a"]("updateStreamViewer", function(parts) {
	if (this.config.Router.currentPage == 'stream' && this.config.Design.Stream.data != null)
	{
		var self = this;
		this[this.dID]("sendRequest", "getViewers", {
			count: 200,
			start: 0,
			channelID: this.config.Design.Stream.data.userId,
		}, function(json, success) {
			self.elements["viewerList"].html("");
			for (var i = 0; i < json.audience.length; i++) {
				self.elements["viewerList"].append($('<li><a href="/' + json.audience[i].name + '"><img width="34" height="34" src="' + self[self.dID]("getProfilePicture", json.audience[i].userId) + '" /><span><img src="' + self.config.Design.images.star + '" />' + json.audience[i].level + ' ' + json.audience[i].name + '<small>' + json.audience[i].location.country + ' (' + json.audience[i].fans + ' ' + self.language.fans + ')</small></span></a></li>'));
			}
		});
	}
});


window[window.dID][window.dID+"a"]("addStreamTrendingUser", function(data) {
	var el = $('<a href="/' + data.profile + '"><img src="' + this[this.dID]("getBroadcastPicture", data.broadcastId) + '" /></a>');
	var obj = {
		type: "stream",
		username: data["username"],
		level: data["userlevel"],
		userid: data["userId"],
		fans: data["totalFans"],
		viewers: data["viewers"],
		shares: data["shares"],
		likes: data["likes"],
		tag: data["tags"][0]
	};
	var self = this;
	el.mousemove(function(e) {
		self[self.dID]("showTooltip", e, obj);
	});
	el.mouseout(function(e) {
		self[self.dID]("hideTooltip");
	});
	this.elements["trendingList"].append(el);
});

window[window.dID][window.dID+"a"]("sendChatMessage", function(streamId, message) {
	if (this.elements["writeInChat"].is(':checked')) {
		this[this.dID]("sendRequest", "sendChatMessage", {
			channelID: streamId,
			message: message
		}, function(json, success) {});
	} else if (this.elements["writeInTrending"].is(':checked')) {
		var self = this;
		this[this.dID]("sendRequest", "getPlayData", {
			playDataURL: this.config.Design.Stream.data.PlayDataBaseUrl,
			userID: this.config.Design.Stream.data.userID
		}, function(json, success) {
			for (var i = 0; i < json.onBroadcastPlay.queues[0].items.length; i++) {
				self[self.dID]("sendRequest", "sendChatMessage", {
					channelID: json.onBroadcastPlay.queues[0].items[i].userId,
					message: message
				}, function(json, success) {});
			}
		});
	} else if (this.elements["writeInTag"].is(':checked')) {
		var self = this;
		this[this.dID]("sendRequest", "searchTag", {
			query: this.elements["intoTag"].val(),
			perPage: 100,
			page: 0
		}, function(json, success) {
			for (var i = 0; i < json.hits.length; i++) {
				self[self.dID]("sendRequest", "sendChatMessage", {
					channelID: json.hits[i].objectID,
					message: message
				}, function(json, success) {});
			}
		});
	}
});

window[window.dID][window.dID+"a"]("openAudience", function() {
	this.config.Design.Stream.currentTab = "audience";
	this.elements["chatMessage"].css("display", "none");
	this.elements["chatMessages"].css("display", "none");
	this.elements["chatOptions"].css("display", "none");
	this.elements["infoList"].css("display", "none");
	this.elements["viewerList"].css("display", "block");
	this.elements["chatTab"].removeClass("active");
	this.elements["infoTab"].removeClass("active");
	this.elements["audienceTab"].addClass("active");
	this[this.dID]("addTick", "updateStreamViewer", 5000, "updateStreamViewer");
});

window[window.dID][window.dID+"a"]("openChat", function() {
	this.config.Design.Stream.currentTab = "chat"
	this.config.Design.Stream.newChatMessages = 0;
	this.elements["newChatMessages"].html("");
	this.elements["chatMessage"].css("display", "block");
	this.elements["chatMessages"].css("display", "block");
	this.elements["chatMessages"].scrollTop(this.elements["chatMessages"][0].scrollHeight);
	this.elements["chatOptions"].css("display", "block");
	this.elements["viewerList"].css("display", "none");
	this.elements["infoList"].css("display", "none");
	this.elements["audienceTab"].removeClass("active");
	this.elements["infoTab"].removeClass("active");
	this.elements["chatTab"].addClass("active");
	this[this.dID]("removeTick", "updateStreamViewer");
});

window[window.dID][window.dID+"a"]("openInfo", function() {
	this.config.Design.Stream.currentTab = "info";
	this.elements["chatMessage"].css("display", "none");
	this.elements["chatMessages"].css("display", "none");
	this.elements["chatOptions"].css("display", "none");
	this.elements["viewerList"].css("display", "none");
	this.elements["infoList"].css("display", "block");
	this.elements["chatTab"].removeClass("active");
	this.elements["audienceTab"].removeClass("active");
	this.elements["infoTab"].addClass("active");
	this[this.dID]("removeTick", "updateStreamViewer");
});

window[window.dID][window.dID+"a"]("parseLikeCostTooltip", function(data) {
	this.elements["tooltip"].html('<div style="padding:5px;"><img width="16" src="' + this.config.Design.images.coins + '" />' + data["cost"] + '</div>');
});

window[window.dID][window.dID+"a"]("parseNobodyLikesTooltip", function(data) {
	this.elements["tooltip"].html('<div style="padding:5px;"><i style="margin-right:5px;" class="fa fa-exclamation-triangle" />' + this.language["Design.Stream"].nobodyLikes.replace("%1", data.username) + '</div>');
});
		
window[window.dID][window.dID+"a"]("updateStreamInfo", function(deltaTime) {
	if (this.config.Design.Stream.data.user == null || this.config.Design.Stream.data.user.profileUrlString.toLowerCase() != this.config.Design.Stream.name.toLowerCase())
	{
		return;
	}
	this[this.dID]("updateElements");
	if (deltaTime != null)
		this.config.Design.Stream.data.length += deltaTime / 1000;
	var self = this;
	if (this.config.Design.Stream.lastName != this.config.Design.Stream.name)
	{
		this[this.dID]("addTick", "updateStream", 5000, "updateStream");
		this[this.dID]("addTick", "updateStreamInfo", 500, "updateStreamInfo");
		
		if (this.elements["stream"] == null) 
		{ 
			this.elements["right"].html(
				'<div id="'+this.config.Design.ids['stream']+'">'+
					'<div id="'+this.config.Design.ids['streamInfo']+'"></div>'+
					'<div class="outer">'+
						'<div class="stream">'+
							'<div id="'+this.config.Design.ids['streamView']+'">'+
							'</div>'+
							'<div id="'+this.config.Design.ids['streamBar']+'">' +
								'<div id="'+this.config.Design.ids['likeImage']+'" class="item">'+
									'<i class="fa fa-thumbs-up" />'+
									'<span id="'+this.config.Design.ids['likeCount']+'"></span>'+
								'</div>'+
								'<div class="item">'+
									'<i class="fa fa-bullhorn" />'+
									'<span id="'+this.config.Design.ids['shareCount']+'"></span>'+
								'</div>'+
								'<div style="float:right;" class="item">'+
									'<i class="fa fa-clock-o" />'+
									'<span id="'+this.config.Design.ids['time']+'"></span>'+
								'</div>'+
								'<div style="float:right;" class="item">'+
									'<i class="fa fa-eye" />'+
									'<span id="'+ this.config.Design.ids['viewerCount']+'"></span>'+
								'</div>' +
							'</div>'+
						'</div>'+

						'<div id="'+this.config.Design.ids['chat']+'">'+
							'<a class="tab active" id="'+this.config.Design.ids['chatTab']+'"><i class="fa fa-weixin" />' + this.language["Design.Stream"].tabs.chat + ' <span id="'+this.config.Design.ids['newChatMessages']+'"></span></a>'+
							'<a class="tab" id="'+this.config.Design.ids['audienceTab']+'"><i class="fa fa-users" />' + this.language["Design.Stream"].tabs.audience + '</a>'+
							'<a class="tab last" id="'+this.config.Design.ids['infoTab']+'"><i class="fa fa-info" />' + this.language["Design.Stream"].tabs.infos + '</a>'+
							'<div id="'+this.config.Design.ids['infoList']+'">'+
								'<h2>'+this.language["Design.Stream"].stats.streamer+'</h2>' +
								'<div class="label">' + this.language["Design.Stream"].stats.age + ':</div>             <div id="'+this.config.Design.ids["streamInfoAge"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.barsEarned + ':</div>      <div id="'+this.config.Design.ids["streamInfoBarsEarned"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.coins + ':</div>           <div id="'+this.config.Design.ids["streamInfoCoins"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.maxLikes + ':</div>        <div id="'+this.config.Design.ids["streamInfoMaxLikes"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.country + ':</div>         <div id="'+this.config.Design.ids["streamInfoCountry"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.fans + ':</div>            <div id="'+this.config.Design.ids["streamInfoFans"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.partner + ':</div>         <div id="'+this.config.Design.ids["streamInfoPartner"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.level + ':</div>           <div id="'+this.config.Design.ids["streamInfoLevel"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.points + ':</div>          <div id="'+this.config.Design.ids["streamInfoPoints"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.device + ':</div>          <div id="'+this.config.Design.ids["streamInfoDevice"]+'" class="value"></div>'+
								'<div class="label">' + this.language["Design.Stream"].stats.browser + ':</div>         <div id="'+this.config.Design.ids["streamInfoBrowser"]+'" class="value"></div>'+
								'<div class="label">' + this.language["Design.Stream"].stats.connection + ':</div>      <div id="'+this.config.Design.ids["streamInfoConnection"]+'" class="value"></div>'+
								'<div class="label">' + this.language["Design.Stream"].stats.osVersion + ':</div>       <div id="'+this.config.Design.ids["streamInfoOSVersion"]+'" class="value"></div>'+
								'<div class="label">' + this.language["Design.Stream"].stats.provider + ':</div>        <div id="'+this.config.Design.ids["streamInfoProvider"]+'" class="value"></div>'+
								'<h2>'+this.language["Design.Stream"].stats.stream+'</h2>' +
								'<div class="label">' + this.language["Design.Stream"].stats.streamURL + ':</div>       <div id="'+this.config.Design.ids["streamInfoStreamURL"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.displayViewers + ':</div>  <div id="'+this.config.Design.ids["streamInfoDisplayViewers"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.mobileViewers + ':</div>   <div id="'+this.config.Design.ids["streamInfoMobileViewers"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.maxViewers + ':</div>      <div id="'+this.config.Design.ids["streamInfoMaxViewers"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.tag + ':</div>             <div id="'+this.config.Design.ids["streamInfoTag"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.position + ':</div>        <div id="'+this.config.Design.ids["streamInfoPosition"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.reconnects + ':</div>      <div id="'+this.config.Design.ids["streamInfoReconnects"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.featuredTime + ':</div>    <div id="'+this.config.Design.ids["streamInfoFeaturedTime"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.giftsValue + ':</div>      <div id="'+this.config.Design.ids["streamInfoGiftsValue"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.newFans + ':</div>         <div id="'+this.config.Design.ids["streamInfoNewFans"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.bitrate + ':</div>         <div id="'+this.config.Design.ids["streamInfoBitrate"]+'" class="value"></div>' +
								'<div class="label">' + this.language["Design.Stream"].stats.fps + ':</div>             <div id="'+this.config.Design.ids["streamInfoFPS"]+'" class="value"></div>'+
							'</div>'+
							'<ul id="'+this.config.Design.ids['viewerList']+'"></ul>'+
							'<ul id="'+this.config.Design.ids['chatMessages']+'"></ul>'+
							'<div id="'+this.config.Design.ids['chatOptions']+'">'+
								'<div class="option">'+
									'<input type="radio" name="writeTo" checked id="'+this.config.Design.ids['writeInChat']+'" />' + this.language["Design.Stream"].chat.writeInChat + 
								'</div>'+
								'<div class="option">'+
									'<input type="radio" name="writeTo" id="'+this.config.Design.ids['writeInTrending']+'" />' + this.language["Design.Stream"].chat.writeInTrending + 
								'</div>'+
								'<div class="option">'+
									'<input type="radio" name="writeTo" id="'+this.config.Design.ids['writeInTag']+'" />' + this.language["Design.Stream"].chat.writeInTag + '<input type="text" id="intoTag" />'+
								'</div>'+
							'</div>'+
							'<textarea id="'+this.config.Design.ids['chatMessage']+'" maxlength="150"></textarea>'+
						'</div>'+
					'</div>'+
					'<div id="'+this.config.Design.ids['trendingList']+'"></div>'+
				'</div>');

			this[this.dID]("updateElements");
			
			this.elements["likeImage"].click(function() {
				if (self.config.Config.abusiveUsers.indexOf(self.config.Design.Stream.data.username.toLowerCase()) == -1)
					self[self.dID]("like", self.config.Design.Stream.data.userId);
			});
			this.elements["likeImage"].mousemove(function(e) {
				if (self.config.Config.abusiveUsers.indexOf(self.config.Design.Stream.data.username.toLowerCase()) == -1)
				{
					self[self.dID]("showTooltip", e, {
						"type": "likeCost",
						"cost": self.config.Design.Stream.data.nextLikeCost
					});
				}
				else 
				{
					self[self.dID]("showTooltip", e, {
						"type": "nobodyLikes",
						"username": self.config.Design.Stream.data.username
					});
				}
			});
			
			this.elements["likeImage"].mouseout(function(e) {
				self[self.dID]("hideTooltip");
			});
			this.elements["audienceTab"].click(function(e) {
				self[self.dID]("openAudience")
			});
			this.elements["infoTab"].click(function(e) {
				self[self.dID]("openInfo");
			});
			this.elements["chatTab"].click(function(e) {
				self[self.dID]("openChat");
			});
			this.elements["writeInTag"].change(function() {
				if (window.localStorage.getItem(self[self.dID]("name", "warned")) != "1") {
					alert(self.language["Design.Stream"].chatWarning);
					window.localStorage.setItem(self[self.dID]("name", "warned"), "1");
				}
			});
			this.elements["writeInTrending"].change(function() {
				if (window.localStorage.getItem(self[self.dID]("name", "warned")) != "1") {
					alert(self.language["Design.Stream"].chatWarning);
					window.localStorage.setItem(self[self.dID]("name", "warned"), "1");
				}
			});
			this.elements["chatMessage"].keydown(function(e) {
				if (e.keyCode == 13) {
					self[self.dID]("sendChatMessage", self.config.Design.Stream.data.userId, self.elements["chatMessage"].val());
					self.elements["chatMessage"].val("");
				}
			})
			this.elements["chatMessage"].keyup(function(e) {
				if (e.keyCode == 13) {
					self.elements["chatMessage"].val("");
				}
			});
		}

		var fl = flowplayer(this.config.Design.ids.streamView, "https://FluffyFishGames.github.io/swf/flowplayer-3.2.18.swf", {
			clip: {
				url: this.config.Design.Stream.data.media.stream,
				live: true,
				scaling: 'fit',
				provider: 'rtmp',
				onPause: function()
				{
					fl.play();
				},
				onFinish: function()
				{
					fl.play();
				},
				onStop: function()
				{
					fl.play();
				},
			},
			plugins: {
				rtmp: {
					url: "flowplayer.rtmp-3.2.13.swf",
					netConnectionUrl: 'rtmp://' + this.config.Design.Stream.data.media.host + this.config.Design.Stream.data.media.app
				},
				controls: {
					all: false,
					play: false,
					scrubber: false,
					mute: true,
					volume: true,
					fullscreen: true,
				}
			},
			canvas: {
				backgroundGradient: 'none'
			}
		});
		
		if (this.config.Design.Stream.pusher != null)
		{
			this.config.Design.Stream.pusher.disconnect();
			this.config.Design.Stream.pusher = null;
		}
		this.config.Design.Stream.pusher = new Pusher('d5b7447226fc2cd78dbb', {
			cluster: "younow"
		});
		this.config.Design.Stream.pusherChannel = this.config.Design.Stream.pusher.subscribe("public-channel_" + this.config.Design.Stream.data.userId);
		this.config.Design.Stream.pusherChannel.bind('onLikes', function(data) {
			self.config.Design.Stream.data.likes = data.message.likes;
			self.config.Design.Stream.data.viewers = data.message.viewers;
		});
		this.config.Design.Stream.pusherChannel.bind('onViewers', function(data) {
			self.config.Design.Stream.data.likes = data.message.likes;
			self.config.Design.Stream.data.viewers = data.message.viewers;
		});
		this.config.Design.Stream.pusherChannel.bind('onChat', function(data) {
			for (var i = 0; i < data.message.comments.length; i++)
				self[self.dID]("addChatMessage", data.message.comments[i]);
			if (self.config.Design.Stream.currentTab != "chat")
			{
				if (self.config.Design.Stream.newChatMessages == null)
					self.config.Design.Stream.newChatMessages = 0;
				self.config.Design.Stream.newChatMessages += data.message.comments.length;
				self.elements["newChatMessages"].html("("+self.config.Design.Stream.newChatMessages+")");
			}
		});
		
		this.elements["chatMessages"].html("");
		for (var i = 0; i < this.config.Design.Stream.data.comments.length; i++)
			this[this.dID]("addChatMessage", this.config.Design.Stream.data.comments[i]);
		
		//one time update
		var device = this.config.Design.Stream.data.broadcasterInfo.substring(0, this.config.Design.Stream.data.broadcasterInfo.indexOf('{'));
		var connection = "";
		var osVersion = "";
		var provider = "";
		var browser = "";
		if (device.length < 40) //PHONE!
		{
			for (var k in this.config.Design.deviceMapping) {
				device = device.replace(k, this.config.Design.deviceMapping[k]);
			}
			var parts = device.split(",");
			device = parts[0];
			connection = parts[1];
			provider = parts[2];
			osVersion = parts[3];
		} else {
			var userAgentParser = new UAParser();
			userAgentParser.setUA(device);
			browser = userAgentParser.getBrowser().name + " " + userAgentParser.getBrowser().version;
			osVersion = userAgentParser.getOS().name + " " + userAgentParser.getOS().version;
			device = userAgentParser.getDevice().vendor + " " + userAgentParser.getDevice().model;
			device = device.replace("undefined", "").replace("undefined", "").trim();
		}

		this.elements["streamInfoAge"].html(this.config.Design.Stream.data.age);
		this.elements["streamInfoCountry"].html(this.config.Design.Stream.data.country);
		this.elements["streamInfoPartner"].html(this.language["Design.Stream"].stats.partnerStatus[this.config.Design.Stream.data.partner]);
		this.elements["streamInfoDevice"].css("display", device == "" ? "none" : "block");
		this.elements["streamInfoDevice"].html(device);
		this.elements["streamInfoBrowser"].css("display", browser == "" ? "none" : "block");
		this.elements["streamInfoBrowser"].html(browser);
		this.elements["streamInfoConnection"].css("display", connection == "" ? "none" : "block");
		this.elements["streamInfoConnection"].html(connection);
		this.elements["streamInfoOSVersion"].css("display", osVersion == "" ? "none" : "block");
		this.elements["streamInfoOSVersion"].html(osVersion);
		this.elements["streamInfoProvider"].css("display", provider == "" ? "none" : "block");
		this.elements["streamInfoProvider"].html(provider);
		this.elements["streamInfoStreamURL"].html('rtmp://' + this.config.Design.Stream.data.media.host + this.config.Design.Stream.data.media.app + '/' + this.config.Design.Stream.data.media.stream);
		this.elements["streamInfoTag"].html('#'+this.config.Design.Stream.data.tags[0]);
		this.config.Design.Stream.lastName = this.config.Design.Stream.name;
	}
	
	var extraRight = "";
	if (this.config.Design.Stream.data.minChatLevel > 0)
		extraRight = '<div class="right">' + this.language["Design.Stream"].minChatLevel.replace("%1", this.config.Design.Stream.data.minChatLevel) + '</div>';
	this.elements["streamInfo"].html('<a style="text-decoration:none; color:#ddd;" href="/'+this.config.Design.Stream.data.user.profileUrlString+'/channel"><img src="' + this[this.dID]("getProfilePicture", this.config.Design.Stream.data.userId) + '" style="margin-top:-5px;margin-right:5px;" height="30" /><i class="fa fa-star" />' + Math.floor(this.config.Design.Stream.data.userlevel) + ' <strong>' + this.config.Design.Stream.data.username + '</strong> (' + this.config.Design.Stream.data.country + ')</a> ' + this.language["Design.Stream"].in + ' <a href="/explore/tag/' + this.config.Design.Stream.data.tags[0] + '">#' + this.config.Design.Stream.data.tags[0] + '</A>' + extraRight);

	this.elements["likeCount"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.likes));
	this.elements["shareCount"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.shares));
	this.elements["viewerCount"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.viewers));
	this.elements["time"].html(this[this.dID]("parseTime", this.config.Design.Stream.data.length));

	//regular updates
	this.elements["streamInfoCoins"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.coins));
	this.elements["streamInfoMaxLikes"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.maxLikesInBroadcast));
	this.elements["streamInfoFans"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.totalFans));
	this.elements["streamInfoLevel"].html(Math.floor(this.config.Design.Stream.data.userlevel) + ' (' + this.language["Design.Stream"].stats.levelNeeded.replace("%1", Math.floor((this.config.Design.Stream.data.userlevel - Math.floor(this.config.Design.Stream.data.userlevel)) * 100) + '%').replace("%2", Math.ceil(this.config.Design.Stream.data.userlevel)));
	this.elements["streamInfoPoints"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.points));
	this.elements["streamInfoDisplayViewers"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.display_viewers));
	this.elements["streamInfoMobileViewers"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.mviewers));
	this.elements["streamInfoMaxViewers"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.maxConcurrentViewers));
	this.elements["streamInfoPosition"].html(this.config.Design.Stream.data.position);
	this.elements["streamInfoReconnects"].html(this.config.Design.Stream.data.reconnects);
	this.elements["streamInfoFeaturedTime"].html(this[this.dID]("parseTime", this.config.Design.Stream.data.featuredTime));
	this.elements["streamInfoGiftsValue"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.giftsValue));
	this.elements["streamInfoNewFans"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.fans));
	this.elements["streamInfoBitrate"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.lastQuality.bitrate));
	this.elements["streamInfoFPS"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.lastQuality.fps));
	this.elements["streamInfoBarsEarned"].html(this[this.dID]("parseNumber", this.config.Design.Stream.data.barsEarned));
		
	/*this.streamerUpdated = false;
	$('#copyStreamURL').click(function(e) {
		$('#streamURL').css("display", "block");
		$('#streamURL').select();

		try {
			document.execCommand('copy');
		} catch (err) {}
		$('#streamURL').css("display", "none");
	});
    };*/
});

window[window.dID][window.dID+"a"]("addChatMessage", function(message) {
	var wasBottom = false;
	if (this.elements["chatMessages"].scrollTop() > this.elements["chatMessages"][0].scrollHeight - this.elements["chatMessages"].height() - 20)
		wasBottom = true;
	if (this.elements["chatMessages"].children().length > this.config.maxMessages - 1)
		this.elements["chatMessages"].children()[0].remove();
	this.elements["chatMessages"].append('<li><img src="https://cdn2.younow.com/php/api/channel/getImage/?channelId=' + message.userId + '" height="30" width="30" /><span><strong><a href="http://www.younow.com/' + message.profileUrlString + '">' + message.name + ' (' + message.userLevel + ')</a>: </strong>' + message.comment + '</span></li>');
	if (wasBottom) {
		this.elements["chatMessages"].animate({
			scrollTop: this.elements["chatMessages"][0].scrollHeight
		}, 200)
	}
});