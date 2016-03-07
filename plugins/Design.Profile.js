window[window.dID][window.dID+"a"]("bootDesignProfile", function(callback)
{
	this[this.dID]("addLanguageTable", "Design.Profile", "https://fluffyfishgames.github.io/language/Design.Profile.json");
	this[this.dID]("addRoute", "profile", /[a-zA-Z0-9_\.]+\/channel/, "openProfile", 4);
	this[this.dID]("addRoute", "previousBroadcast", /[a-zA-Z0-9_\.]+\/channel\/[0-9]+/, "openPreviousBroadcast", 5);
	this.config.Design.Profile = {};
	this[this.dID]("addIDs", ['dashboardComments', 'writeComment', 'postComment', 'dashboardTab', 'previousBroadcastsTab', 'fansTab', 'fanOfTab', 'profile', 'profileHeader', 'profileBottom', 'profileContent', 'profilePage', 'toLive', 'fanButton', 'previousStream', 'previousStreamView', 'rtmpDumpInfo', 'rtmpDump']);
	this[this.dID]("onPageChange", function(){
		if (this.config.Router.currentPage != "profile")
		{
			this[this.dID]("removeTick", "updateProfileStream");
		}
	});
	callback();
});

window[window.dID][window.dID+"a"]("openPreviousBroadcast", function(parts) {
	if (this.config.Design.Profile.broadcasts != null && this.config.Design.Profile.broadcasts[parts[2]] != null)
	{
		this.config.Design.Profile.lookForBroadcast = null;
        this.elements["right"].html('<div id="'+this.config.Design.ids.previousStream+'" style="width:100%; height:100%;">'+
		'<div class="header"><a href="/'+this.config.Design.Profile.data.profile+'/channel">'+this.language["Design.Profile"].previousBroadcast.backToProfile+'</a>'+
		'</div><div id="'+this.config.Design.ids.previousStreamView+'"></div></div>');
        var self = this;
        this[this.dID]("sendRequest", "getVideoPath", {broadcastID: this.config.Design.Profile.broadcasts[parts[2]].media.broadcast.broadcastId}, function(json, success) {
			var command = 'rtmpdump -r '+json.server+' -y '+json.stream+'?sessionId='+self.youNow.session.user.session+' -p https://www.younow.com/'+self.config.Design.Profile.data.profile+'/channel -o "'+self.config.Design.Profile.data.profile+'_'+self.config.Design.Profile.broadcasts[parts[2]].media.broadcast.dateAired.replace(new RegExp(':', 'g'),"-")+'.mp4"';
			self.elements["right"].html('<div id="'+self.config.Design.ids.previousStream+'" style="width:100%; height:100%;"><div class="header"><a href="/'+self.config.Design.Profile.data.profile+'/channel">'+self.language["Design.Profile"].previousBroadcast.backToProfile+'</a><span id="'+self.config.Design.ids.rtmpDump+'">'+self.language["Design.Profile"].previousBroadcast.rtmpDump+'</span><div id="'+self.config.Design.ids.rtmpDumpInfo+'">'+command+'</div></div><div id="'+self.config.Design.ids.previousStreamView+'"></div></div>');
			self[self.dID]("updateElements");
            self.elements['rtmpDump'].click(function(){
				if (self.elements['rtmpDumpInfo'].css("display") == "block")
					self.elements['rtmpDumpInfo'].css("display", "none");
				else
					self.elements['rtmpDumpInfo'].css("display", "block");
			});
			flowplayer(self.config.Design.ids.previousStreamView, "https://FluffyFishGames.github.io/swf/flowplayer-3.2.18.swf", {
				clip: {
					url: json.stream+"?sessionId="+self.youNow.session.user.session,
					scaling: 'fit',
					provider: 'rtmp'
				},
				plugins: {
					rtmp: {
						url: "flowplayer.rtmp-3.2.13.swf",
						netConnectionUrl: json.server,
					},
					controls: {
						all: true,
					}
				},
				canvas: {
					backgroundGradient: 'none'
				}
			});
        });
	}
	else 
	{
		this.config.Design.Profile.lookForBroadcast = parts[2];
		this[this.dID]("openProfile", parts);
	}
});

window[window.dID][window.dID+"a"]("updateProfileStream", function(message, objectId, type) {
	
	var self = this;
	this[this.dID]("sendRequest", "getBroadcast", {
		username: this.config.Design.Profile.username
	}, function(json, success) {
		self.config.Design.Profile.streamData = json;
		self[self.dID]("updateProfilePage");
	});
});

window[window.dID][window.dID+"a"]("writePost", function(message, objectId, type) {
	if (objectId == null)
		objectId = 0;
	var self = this;
	this[this.dID]("sendRequest", "createPost", {
		channelID: this.config.Design.Profile.data.channelId,
		parentID: objectId,
		post: message
	}, function(json, success) {
		if (json["errorCode"] > 0) {} else {
			var post = {
				'post': message,
				'id': json["id"],
				'user': self.youNow.session.user,
				'isReplyable': true,
				'timeAgo': self[self.dID]("translateTime", "Just now"),
			};
			post.user.profileUrlString = post.user.profile;
			if (objectId > 0) {
				self.config.Design.Profile.posts[objectId].element.find(".comment").before(self[self.dID]("parseProfilePost", post, true));
			} else {
				self.elements["dashboardComments"].prepend(self[self.dID]("parseProfilePost", post, false));
			}
		}
	});
});

window[window.dID][window.dID+"a"]("openProfileTab", function(page) 
{
	this.elements["profileContent"].html("");
	this[this.dID]("updateElement");
	this.config.Design.Profile.currentPage = page;
	this.elements["dashboardTab"].removeClass("active");
	this.elements["previousBroadcastsTab"].removeClass("active");
	this.elements["fansTab"].removeClass("active");
	this.elements["fanOfTab"].removeClass("active");
	this.config.Design.Profile.posts = {};
	
	if (this.config.Design.Profile.currentPage == "dashboard")
	{
		this.elements["dashboardTab"].addClass("active");
		this.config.Design.Profile.dashboardPage = -1;
		this.elements["profileContent"].html('<textarea style="width:100%;height:60px;clear:both;float:left;" id="'+this.config.Design.ids["writeComment"]+'"></textarea><button style="display: block; clear:both;float:right;margin-top:5px;" id="'+this.config.Design.ids['postComment']+'" class="btn btn-confirm"><i class="icon fa fa-commenting" />' + this.language["Design.Profile"].dashboard.post + '</button><div id="'+this.config.Design.ids['dashboardComments']+'" style="clear:both;float:left;margin-top:10px;"></div>');
		this[this.dID]("updateElements");
		
		var self = this;
		this.elements["writeComment"].on('keyup', function(e) {
			if (e.which == 13) {
				self[self.dID]("writePost", self.elements["writeComment"].val(), 0, "post");
				self.elements["writeComment"].val("");
			}
		});
		this.elements["postComment"].on('click', function(e) {
			self[self.dID]("writePost", self.elements["writeComment"].val(), 0, "post");
			self.elements["writeComment"].val("");
		});

		this.elements["dashboardComments"] = $('#'+this.config.Design.ids.dashboardComments);
		this.config.Design.Profile.hasMorePages = true;
		this[this.dID]("addProfilePage");
	}
	else if (this.config.Design.Profile.currentPage == "previousBroadcasts")
	{
        this.elements["previousBroadcastsTab"].addClass("active");
        this.config.Design.Profile.dashboardPage = -1;
        this.elements["profileContent"].html('<div id="'+this.config.Design.ids.dashboardComments+'" style="clear:both;float:left;margin-top:10px;"></div>');
		this[this.dID]("updateElements");
		
        this.config.Design.Profile.hasMorePages = true;
		this[this.dID]("addProfilePage");
	}
	else if (this.config.Design.Profile.currentPage == "fans")
	{
        this.elements["fansTab"].addClass("active");
        this.config.Design.Profile.dashboardPage = -1;
        this.elements["profileContent"].html('<div id="'+this.config.Design.ids.dashboardComments+'" style="clear:both;float:left;margin-top:10px;"></div>');
		this[this.dID]("updateElements");
		
        this.config.Design.Profile.hasMorePages = true;
		this[this.dID]("addProfilePage");
    }
	else if (this.config.Design.Profile.currentPage == "fanOf")
	{
        this.profilePage = "fanOf";
        this.elements["fanOfTab"].addClass("active");
        this.config.Design.Profile.dashboardPage = -1;
        this.elements["profileContent"].html('<div id="'+this.config.Design.ids.dashboardComments+'" style="clear:both;float:left;margin-top:10px;"></div>');
		this[this.dID]("updateElements");
		
        this.config.Design.Profile.hasMorePages = true;
		this[this.dID]("addProfilePage");
    }
});

window[window.dID][window.dID+"a"]("addProfilePage", function() 
{
	if (this.config.Design.Profile.hasMorePages == true) 
	{
		this.config.Design.Profile.dashboardPage++;
		this.config.Design.Profile.hasMorePages = false;
		var self = this;
		if (this.config.Design.Profile.currentPage == "dashboard") 
		{
			this[this.dID]("sendRequest", "getPosts", {
				channelID: this.config.Design.Profile.data.channelId,
				startFrom: (this.config.Design.Profile.dashboardPage * 10)
			}, function(json, sucess) {
				for (var i = 0; i < json.posts.length; i++) {
					self.elements["dashboardComments"].append(self[self.dID]("parseProfilePost", json.posts[i]));
				}
				self.config.Design.Profile.hasMorePages = json.hasMore;
			});
		}
		if (this.config.Design.Profile.currentPage == "previousBroadcasts") {
			this[this.dID]("sendRequest", "getPreviousBroadcasts", {
				channelID: this.config.Design.Profile.data.channelId,
				startFrom: (this.config.Design.Profile.dashboardPage * 10)
			}, function(json, sucess) {
				if (self.config.Design.Profile.broadcasts == null)
					self.config.Design.Profile.broadcasts = {};
				for (var i = 0; i < json.posts.length; i++) {
					self.config.Design.Profile.broadcasts[json.posts[i].media.broadcast.broadcastId] = json.posts[i];
					self.elements["dashboardComments"].append(self[self.dID]("parseProfilePost", json.posts[i]));
				}
				
				self.config.Design.Profile.hasMorePages = json.hasMore;
				if (self.config.Design.Profile.lookForBroadcast != null)
				{
					if (self.config.Design.Profile.broadcasts[self.config.Design.Profile.lookForBroadcast] == null)
					{
						self[self.dID]("addProfilePage");
					}
					else 
					{
						self[self.dID]("openPreviousBroadcast", ["","",self.config.Design.Profile.lookForBroadcast]);
					}
				}
			});
		}
		if (this.config.Design.Profile.currentPage == "fans") {
			this[this.dID]("sendRequest", "getFans", {
				channelID: this.config.Design.Profile.data.channelId,
				startFrom: (this.config.Design.Profile.dashboardPage * 10)
			}, function(json, sucess) {
				for (var i = 0; i < json.fans.length; i++) {
					self.elements["dashboardComments"].append(self[self.dID]("parseProfilePost", json.fans[i]));
				}
				self.config.Design.Profile.hasMorePages = json.hasNext == '1';
			});
		}
		if (this.config.Design.Profile.currentPage == "fanOf") {
			this[this.dID]("sendRequest", "getFansOf", {
				channelID: this.config.Design.Profile.data.channelId,
				startFrom: (this.config.Design.Profile.dashboardPage * 10)
			}, function(json, sucess) {
				for (var i = 0; i < json.fans.length; i++) {
					self.elements["dashboardComments"].append(self[self.dID]("parseProfilePost", json.fans[i]));
				}
				self.config.Design.Profile.hasMorePages = json.hasNext == '1';
			});
		}
	}
});

window[window.dID][window.dID+"a"]("showPostOptions", function(postId, isComment) 
{
	var elx = $('<ul class="optionsMenu"><li>' + this.language["Design.Profile"].dashboard.remove + '</li></ul>');
	this.config.Design.Profile.posts[postId].element.find(".options").first().append(elx);
	var self = this;
	
	var ignoreFirst = true;
	var c = function() {
		if (ignoreFirst)
			ignoreFirst = false;
		else {
			elx.remove();
			$(document.body).unbind("click", c);
		}
	};
	$(document.body).click(c);
	elx.find("li").first().click(function() {
		self.config.Design.Profile.posts[postId].element.remove();
		self[self.dID]("sendRequest", "deletePost", {
			isComment: isComment ? '1' : '0',
			channelID: self.config.Design.Profile.data.channelId,
			postID: postId
		}, function(json, success) {});
	});
});

window[window.dID][window.dID+"a"]("checkComment", function(event, postId) 
{
	var element = this.config.Design.Profile.posts[postId].element.find(".comment").first().find("input").first();
    if (event.which == 13) {
        this[this.dID]("writePost", element.val(), postId, "post");
        element.val("");
    }
});    

window[window.dID][window.dID+"a"]("changePostLike", function(postId, isComment) 
{
	if (this.config.Design.Profile.posts[postId] != null)
	{
		if (this.config.Design.Profile.posts[postId].liked)
		{
			this.config.Design.Profile.posts[postId].liked = false;
			this.config.Design.Profile.posts[postId].likes--;
			this.config.Design.Profile.posts[postId].element.find(".like").first().html('<i class="icon fa fa-thumbs-up" /><strong>'+this.language["Design.Profile"].dashboard.like+'</strong> '+(this.config.Design.Profile.posts[postId].likes > 0 ? this.language["Design.Profile"].dashboard.otherLikes.replace('%1', this.config.Design.Profile.posts[postId].likes): ""));
			this[this.dID]("sendRequest", "unlikeObject", {channelID: this.config.Design.Profile.data.channelId, objectID: postId, isComment: isComment?"1":"0"}, function(json, success){});
		}
		else 
		{
			this.config.Design.Profile.posts[postId].liked = true;
			this.config.Design.Profile.posts[postId].likes++;
			this.config.Design.Profile.posts[postId].element.find(".like").first().html('<i class="icon fa fa-thumbs-down" /><strong>'+this.language["Design.Profile"].dashboard.unlike+'</strong> '+(this.config.Design.Profile.posts[postId].likes > 1 ? this.language["Design.Profile"].dashboard.otherLikes.replace('%1', this.config.Design.Profile.posts[postId].likes - 1): ""));
			this[this.dID]("sendRequest", "likeObject", {channelID: this.config.Design.Profile.data.channelId, objectID: postId, isComment: isComment?"1":"0"}, function(json, success){});
		}
	}
});

window[window.dID][window.dID+"a"]("parseProfilePost", function(post, sub) 
{
	if (post.userId != null) {
		return $('<div class="userEntry entry"><a href="/' + post.profileUrlString + '" class="header"><img src="' + this[this.dID]("getProfilePicture", post.userId) + '"><div><strong>' + post.firstName + ' ' + post.lastName + '</strong><small>' + post.description + '</small></div></a></div>');
	} else {
		var self = this;
		var content = "";
		var replies = "";
		if (post.post != null && post.post != "")
			content += '<div class="text">' + post.post + '</div>';
		if (post.media != null) {
			if (post.media.ext != null)
				content += '<div class="image"><img src="https://cdn2.younow.com/php/api/post/getMedia/channelId=' + this.config.Design.Profile.data.channelId + '/id=' + post.id + '/ext=' + post.media.ext + '" /></div>';
			else if (post.media.snapshot != null)
				content += '<div class="image"><img src="https://cdn2.younow.com/php/api/getSnapshot/id=' + post.media.snapshot.snapshotId + '" /></div>';
			else if (post.media.broadcast != null) {
				var d = new Date(post.media.broadcast.dateAired);
				var gifts = '';
				for (var i in post.media.broadcast.gifts) {
					gifts += '<img src="https://cdn2.younow.com/images/profile/new/gifts/' + post.media.broadcast.gifts[i].giftSKU + '_pro.png" />';
				}
				content += '<div class="stream">' +
					'<img src="' + post.media.broadcast.broadcastThumbnail + '" />' +
					(post.media.broadcast.videoAvailable == 1 ? '<img onclick="window.history.pushState({\'html\':\'\',\'pageTitle\':\'\'},\'\', \'https://www.younow.com/'+this.config.Design.Profile.data.profile+'/channel/'+post.media.broadcast.broadcastId+'\');" class="play" src="' + this.config.Design.images.play + '" />' : '') +
					'<div>' +
					'<div style="float:left; width: 200px;">' +
					'<strong>' + d.toLocaleDateString(this.language.langCode) + ' ' + d.toLocaleTimeString(this.language.langCode) + '</strong>' +
					'<small style="clear:both;" class="label">#' + this[this.dID]("parseNumber", post.media.broadcast.tags) + '</small>' +
					'<i class="icon fa fa-clock-o" /><small class="label">' + this[this.dID]("parseTime", post.media.broadcast.broadcastLength) + '</small>' +
					'<i class="icon fa fa-eye" /><small class="label">' + this[this.dID]("parseNumber", post.media.broadcast.totalViewers) + '</small>' +
					'<i class="icon fa fa-thumbs-up" /><small class="label">' + this[this.dID]("parseNumber", post.media.broadcast.totalLikes) + '</small>' +
					'<i class="icon fa fa-bullhorn" /><small class="label">' + this[this.dID]("parseNumber", post.media.broadcast.shares) + '</small>' +
					'</div>' +
					'<div style="float:right; width: calc(100% - 210px);">' +
					gifts +
					'</div>' +
					'</div>' +
					'</div>';
			}
		}
		var comment = "";
		if (post.isReplyable)
			comment = '<div class="comment"><img src="' + this[this.dID]("getProfilePicture", this.youNow.session.user.userId) + '" /><input type="text" /></div>';

		var options = "";
		if (post.user.userId == this.youNow.session.user.userId || this.config.Design.Profile.data.userId == this.youNow.session.user.userId)
			options = '<div class="options"><i class="icon fa fa-arrow-circle-down" /></div>';
		
		var like = "";		
		this.config.Design.Profile.posts[post.id] = {};
		this.config.Design.Profile.posts[post.id].likes = parseInt(post.likesCount);
		if (post.like != null && post.like.user.userId == this.youNow.session.user.userId)
		{
			like = '<div class="like"><i class="icon fa fa-thumbs-down" /><strong>'+this.language["Design.Profile"].dashboard.unlike+'</strong> '+(this.config.Design.Profile.posts[post.id].likes > 1 ? this.language["Design.Profile"].dashboard.otherLikes.replace('%1', this.config.Design.Profile.posts[post.id].likes - 1): "")+'</div>';
			this.config.Design.Profile.posts[post.id].liked = true;
		}
		else 
		{
			like = '<div class="like"><i class="icon fa fa-thumbs-up" /><strong>'+this.language["Design.Profile"].dashboard.like+'</strong> '+(this.config.Design.Profile.posts[post.id].likes > 0 ? this.language["Design.Profile"].dashboard.otherLikes.replace('%1', this.config.Design.Profile.posts[post.id].likes): "")+'</div>';
			this.config.Design.Profile.posts[post.id].liked = false;
		}
		var el = null;
		if (sub == true)
			el = $('<div class="reply"><a class="header" href="/' + post.user.profileUrlString + '"><img src="' + this[this.dID]("getProfilePicture", post.user.userId) + '"/><div><strong><i class="icon fa fa-star" /><span>' + post.user.level + '</span> ' + post.user.firstName + ' ' + post.user.lastName + '</strong><small>' + this[this.dID]("translateTime", post.timeAgo) + '</small></div></a>' + options + '<div class="content">' + content + '</div>' + like);
		else
			el = $('<div class="entry"><a class="header" href="/' + post.user.profileUrlString + '"><img src="' + this[this.dID]("getProfilePicture", post.user.userId) + '"/><div><strong><i class="icon fa fa-star" /><span>' + post.user.level + '</span> ' + post.user.firstName + ' ' + post.user.lastName + '</strong><small>' + this[this.dID]("translateTime", post.timeAgo) + '</small></div></a>' + options + '<div class="content">' + content + '</div>' + like + comment + '</div>');
			
		if (post.replies != null) {
			for (var j = 0; j < post.replies.length; j++) {
				el.find(".comment").first().before(this[this.dID]("parseProfilePost", post.replies[j], true));
			}
		}
		if (post.user.userId == this.youNow.session.user.userId || this.config.Design.Profile.data.userId == this.youNow.session.user.userId)
			el.find(".options").first().click(function(){ 
				self[self.dID]("showPostOptions", post.id, sub);
			});
		
		el.find(".like").first().click(function(){
			self[self.dID]("changePostLike", post.id, post.isComment);
		});
		if (post.isReplyable)
			el.find(".comment").first().find("input").keyup(function(e) {self[self.dID]("checkComment", e, post.id);});
		this.config.Design.Profile.posts[post.id].element = el;
		return el;
	}
});


window[window.dID][window.dID+"a"]("openProfile", function(parts) 
{    
	this[this.dID]("addTick", "updateProfileStream", 5000, "updateProfileStream");
	var username = parts[0];
	this.config.Design.Profile.username = username;
	this[this.dID]("updateElements");
	this.elements["right"].html('<div id="'+this.config.Design.ids['profile']+'">'+
	'<div id="'+this.config.Design.ids['profileHeader']+'"></div>'+
	'<div id="'+this.config.Design.ids['profileBottom']+'">'+
	'<div class="fade">'+
	'<a class="active" id="'+this.config.Design.ids['dashboardTab']+'"><i class="icon fa fa-commenting" />' + this.language["Design.Profile"].tabs.dashboard + '</a>'+
	'<a id="'+this.config.Design.ids['previousBroadcastsTab']+'"><i class="icon fa fa-play-circle" />' + this.language["Design.Profile"].tabs.previousBroadcasts + '</a>'+
	'<a id="'+this.config.Design.ids['fansTab']+'"><i class="icon fa fa-users" />' + this.language["Design.Profile"].tabs.fans.replace("%1", "0") + '</a>'+
	'<a id="'+this.config.Design.ids['fanOfTab']+'"><i class="icon fa fa-user-secret" />' + this.language["Design.Profile"].tabs.fansOf.replace("%1", "0") + '</a>'+
	'</div>'+
	'<div id="'+this.config.Design.ids['profileContent']+'"></div>'+
	'</div>'+
	'</div>');
	
	this[this.dID]("updateElements");
	var self = this;
	this.elements["profileContent"].bind('mousewheel DOMMouseScroll', function(event) {
		if (self.config.Design.Profile.hasMorePages) {
	//		if (self.elements["profileContent"].scrollTop() > 0)
				//self.animations.hideProfileHeader = true;
			//else
				//self.animations.hideProfileHeader = false;
			var l = self.elements["profileContent"][0].scrollHeight - self.elements["profileContent"].height() - 50;
			if (self.elements["profileContent"].scrollTop() > l && (event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0)) {
				self[self.dID]("addProfilePage");
			}
		}
	});
	this.elements["dashboardTab"].click(function() {
		self[self.dID]("openProfileTab", "dashboard");
	});
	this.elements["previousBroadcastsTab"].click(function() {
		self[self.dID]("openProfileTab", "previousBroadcasts");
	});
	this.elements["fansTab"].click(function() {
		self[self.dID]("openProfileTab", "fans");
	});
	this.elements["fanOfTab"].click(function() {
		self[self.dID]("openProfileTab", "fanOf");
	});
	this[this.dID]("sendRequest", "getBroadcast", {
		username: username
	}, function(json, success) {
		self.config.Design.Profile.streamData = json;
		self[self.dID]("sendRequest", "getProfile", {
			channelID: self.config.Design.Profile.streamData.userId
		}, function(json, success) {
			self.config.Design.Profile.data = json;
			if (self.youNow.session.user.userId > 0) {
				self[self.dID]("sendRequest", "isFan", {
					userID: self.config.Design.Profile.streamData.userId
				}, function(json, success) {
					self.config.Design.Profile.isFan = json["fanOf"][self.config.Design.Profile.streamData.userId] == "fan";
					self[self.dID]("updateProfilePage");
				});
			} else {
				self[self.dID]("updateProfilePage");
			}
		});
	});
});

window[window.dID][window.dID+"a"]("likePost", function(objectID, channelID, isComment) 
{
	this[this.dID]("sendRequest", "likeObject", {
		objectID: objectID,
		channelID: channelID,
		isComment: isComment
	}, function(json, success) {
	});
});

window[window.dID][window.dID+"a"]("unlikePost", function(objectID, channelID, isComment) 
{
	this[this.dID]("sendRequest", "unlikeObject", {
		objectID: objectID,
		channelID: channelID,
		isComment: isComment
	}, function(json, success) {
	});
});

window[window.dID][window.dID+"a"]("updateProfilePage", function()
{
	var location = "";
	if (this.config.Design.Profile.data.country != null && this.config.Design.Profile.data.country != "")
		location += this.config.Design.Profile.data.country;
	if (this.config.Design.Profile.data.city != null && this.config.Design.Profile.data.city != "")
		location += ", " + this.config.Design.Profile.data.city;
	var created = new Date(this.config.Design.Profile.data.dateCreated);
	var createdString = created.toLocaleDateString(this.language.langCode) + ' ' + created.toLocaleTimeString(this.language.langCode);
	var fanButton = "";
	var socialButtons = "";
	this.elements["fansTab"].html('<i class="icon fa fa-users" />'+this.language["Design.Profile"].tabs.fans.replace("%1", this[this.dID]("parseNumber", this.config.Design.Profile.data.totalFans)));
	this.elements["fanOfTab"].html('<i class="icon fa fa-user-secret" />'+this.language["Design.Profile"].tabs.fansOf.replace("%1", this[this.dID]("parseNumber", this.config.Design.Profile.data.totalFansOf)));
	if (this.config.Design.Profile.data.facebookId != null && this.config.Design.Profile.data.facebookId > 0)
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.facebook.com/' + this.config.Design.Profile.data.facebookId + '"><img src="' + this.config.Design.images.facebook + '" /></a>';
	if (this.config.Design.Profile.data.fbfn != null && this.config.Design.Profile.data.fbfn != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.facebook.com/' + this.config.Design.Profile.data.fbfn + '"><img src="' + this.config.Design.images.facebook + '" /></a>';
	if (this.config.Design.Profile.data.googleId != null && this.config.Design.Profile.data.googleId != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://plus.google.com/' + this.config.Design.Profile.data.googleId + '"><img src="' + this.config.Design.images.googleplus + '" /></a>';
	if (this.config.Design.Profile.data.twitterHandle != null && this.config.Design.Profile.data.twitterHandle != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.twitter.com/' + this.config.Design.Profile.data.twitterHandle + '"><img src="' + this.config.Design.images.twitter + '" /></a>';
	if (this.config.Design.Profile.data.instagramHandle != null && this.config.Design.Profile.data.instagramHandle != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.instagram.com/' + this.config.Design.Profile.data.instagramHandle + '"><img src="' + this.config.Design.images.instagram + '" /></a>';
	if (this.config.Design.Profile.data.youTubeUserName != null && this.config.Design.Profile.data.youTubeUserName != "")
		socialButtons += '<a style="margin-left: 5px; float: left;" href="http://www.youtube.com/' + this.config.Design.Profile.data.youTubeUserName + '"><img src="' + this.config.Design.images.youtube + '" /></a>';
	if (this.youNow.session.user.userId > 0) {
		if (this.config.Design.Profile.isFan)
			fanButton = '<button style="height:32px; margin-left: 5px; cursor:pointer;float: left;" id="'+this.config.Design.ids.fanButton+'" class="btn btn-confirm"><i class="icon fa fa-user-times" />' + this.language["Design.Profile"].unfan + '</button>';
		else
			fanButton = '<button style="height:32px; margin-left: 5px; cursor:pointer;float:left;" id="'+this.config.Design.ids.fanButton+'" class="btn btn-primary"><i class="icon fa fa-user-plus" />' + this.language["Design.Profile"].fan + '</button>';
	}
	this.elements["profileHeader"].html('<div class="header">' +
		'<img src="https://cdn2.younow.com/php/api/channel/getCover/channelId=' + this.config.Design.Profile.data.userId + '" />' +
		'</div>' +
		'<div class="userBox">' +
		'<div class="userBar">' +
		'<div class="profilePicture">' +
		'<img style="height: 200px;" src="https://cdn2.younow.com/php/api/channel/getImage/channelId=' + this.config.Design.Profile.data.userId + '" />' +
		'<div style="'+(this.config.Design.Profile.streamData.state == 'onBroadcastPlay'?'display:block;':'display:none;')+'" class="live" id="isLive"><img src="'+this.config.Design.images.live+'" /></div>'+
		'<div class="info">' +
		'<strong><i class="icon fa fa-star" /><span>' + this.config.Design.Profile.data.level + '</span> ' + this.config.Design.Profile.data.profile + '</strong><br />' +
		this.config.Design.Profile.data.description + '<br />' +
		'<div style="float:left; clear: both; margin-top:5px;">' +
		'<div style="float: left;clear:both;width:120px;font-weight:bold;">' + this.language["Design.Profile"].location + ':</div>' +
		'<div style="float:left; width:150px;">' + location + '</div>' +
		'<div style="float: left;clear:both;width:120px;font-weight:bold;">' + this.language["Design.Profile"].broadcastsCount + ':</div>' +
		'<div style="float:left; width:150px;">' + this[this.dID]("parseNumber", this.config.Design.Profile.data.broadcastsCount) + '</div>' +
		'<div style="float: left;clear:both;width:120px;font-weight:bold;">' + this.language["Design.Profile"].dateCreated + ':</div>' +
		'<div style="float:left; width:150px;">' + createdString + '</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div class="buttons">' +
		socialButtons + fanButton + '<button id="'+this.config.Design.ids.toLive+'" style="float:left;height:32px;line-height:12px;font-weight:bold;margin-left:5px;'+(this.config.Design.Profile.streamData.state == 'onBroadcastPlay'?'display:block;':'display:none;')+'" class="btn btn-primary"><i class="icon fa fa-arrow-right" />'+this.language["Design.Profile"].toLive+'</button>'+
		'</div>' +
		'</div>'
	);
	this[this.dID]("updateElements");
	var self = this;
	this.elements["toLive"].click(function(){
		window.history.pushState({"html":"","pageTitle":""},"", "https://www.younow.com/"+self.config.Design.Profile.data.profile);
	});
	var self = this;
	if (fanButton != "") {
		this.elements["fanButton"].click(function() {
			if (self.config.Design.Profile.isFan) {
				self[self.dID]("sendRequest", "unfan", {
					channelID: self.config.Design.Profile.data.channelId
				}, function(json, success) {});
			} else {
				self[self.dID]("sendRequest", "fan", {
					channelID: self.config.Design.Profile.data.channelId
				}, function(json, success) {});
			}
			self.config.Design.Profile.isFan = !self.config.Design.Profile.isFan;
			self[self.dID]("updateProfilePage");
		});
	}
	if (this.config.Design.Profile.username != this.config.Design.Profile.lastUsername)
	{
		if (this.config.Design.Profile.lookForBroadcast != null)
		{
			this[this.dID]("openProfileTab", "previousBroadcasts");
		}
		else 
		{
			this[this.dID]("openProfileTab", "dashboard");
		}
	}
	this.config.Design.Profile.lastUsername = this.config.Design.Profile.username;
});