window[window.dID][window.dID+"a"]("bootYouNow", function(callback) {
	function allServices(mod, r) {
		var inj = angular.element(document).injector().get;
		if (!r) r = {};
		angular.forEach(angular.module(mod).requires, function(m) {
			allServices(m, r)
		});
		angular.forEach(angular.module(mod)._invokeQueue, function(a) {
			try {
				r[a[2][0]] = inj(a[2][0]);
			} catch (e) {}
		});
		return r;
	}

	this.youNow = allServices('younow');
	
	if (this.config.inDarkMode == "1")
	{
		this.youNow["$urlRouter"].update = function(a) {
			return true;
		};
		this.youNow["$urlRouter"].sync = function() {};
		this.youNow["$urlRouter"].listen = function() {};
		this.youNow["$urlRouter"].href = function(c, d, e) {                                                                                                                                                                                                                                                                               
			return "";
		};
		this.youNow["$urlRouter"].push = function(c, d, e) {};

		this.youNow["$state"].get = function(a, b) {
			return true;
		};
		this.youNow["$state"].go = function(a, b, c) {
			return true;
		};
		this.youNow["$state"].href = function(a, b, c) {
			return "";
		};
		this.youNow["$state"].reload = function() {};
		this.youNow["$state"].transitionTo = function(a, b, c) {};
		this.youNow["$view"].load = function(c, d) {};
		this.youNow["swf"].newBroadcaster = function(a) {
			return false;
		};
		this.youNow["broadcasterService"].addBroadcast = function(a, b, c, d, e, f) {
			return false;
		};
		this.youNow["broadcasterService"].switchBroadcaster = function(a, b, c, d) {
			return false;
		};
		this.youNow["broadcasterService"].showBroadcaster = function(a) {
			return false;
		};
		this.youNow["broadcasterService"].switchToBroadcast = function(a) {
			return false;
		};
		this.youNow["broadcasterService"].trackBroadcaster = function() {
			return false; 
		};
		this.youNow["broadcasterService"].updateBroadcaster = function(a, b, d) {
			return false;     
		};
	}
	
	this.config.loggedIn = this.youNow.session.user != null && this.youNow.session.user.userId > 0 && $(".user-menu")!=null && $(".user-menu").length > 0;
	this.config.banned = this.youNow.session.user != null && this.youNow.session.user.banId > 0;
	callback();
});

window[window.dID][window.dID+"a"]("readyYouNow", function() {
	if (this.config.inDarkMode)
	{
		this[this.dID]("addTick", "checkUser", 100, "checkUser");	
		if (this.config.loggedIn)
			this[this.dID]("fireLogin");
		else 
			this[this.dID]("fireLogout");
		if (this.config.banned)
			this[this.dID]("fireBanned");
	}
});

window[window.dID][window.dID+"a"]("checkUser", function(callback) {
	var newBanned = this.youNow.session.user != null && this.youNow.session.user.banId > 0;
	if (newBanned != this.config.banned)
	{
		this.config.banned = newBanned;
		if (newBanned)
			this[this.dID]("fireBanned");
	}
	
	var newStatus = this.youNow.session.user != null && this.youNow.session.user.userId > 0 && $(".user-menu")!=null && $(".user-menu").length > 0;
	if (newStatus != this.config.loggedIn)
	{
		this.config.loggedIn = newStatus;
		if (this.config.loggedIn)
			this[this.dID]("fireLogin");
		else 
			this[this.dID]("fireLogout");
	}
});

window[window.dID][window.dID+"a"]("getBroadcastPicture", function(broadcastId) {
	return this.youNow.config.broadcasterThumb + broadcastId;
});

window[window.dID][window.dID+"a"]("getProfilePicture", function(userid){
	return 'https://cdn2.younow.com/php/api/channel/getImage/channelId=' + userid;
});

window[window.dID][window.dID+"a"]("loginTwitter", function(callback, connect){
	var self = this;
	if (this.youNow.twitterData != null)
	{
		self.youNow.session.login(this.youNow.twitterData, connect).then(function(data) {
			callback();
		});
	}
	else 
	{
		var url = this.youNow.config.settings.ServerHomeBaseUrl + 'twitterLogin.php';
		var loginWindow = window.open(url, 'Twitter Login', 'location=0, status=0, width=800, height=400, scrollbars=1');
		window.twitterPopup = loginWindow;

		window.twitterSuccessCallback = function(userInfo) {
			var relevant = {};
			var nameTokens = userInfo.name ? userInfo.name.split(' ') : [];
			relevant.twitterId = userInfo.id;
			relevant.firstName = nameTokens[0] || '';
			relevant.lastName = nameTokens[1] || '';
			relevant.nickname = userInfo.screen_name || '';
			relevant.thumb = userInfo.profile_image_url || '';
			relevant.description = userInfo.description || '';
			relevant.url = userInfo.screen_name ? 'http://www.twitter.com/' + userInfo.screen_name : '';
			relevant.connections = userInfo.followers_count;
			relevant.oauthToken = userInfo.oauth_token;
			relevant.oauthTokenSecret = userInfo.oauth_token_secret;
			relevant.location = userInfo.location;
			self.youNow.twitterData = relevant;
			self.youNow.session.login(self.youNow.twitterData, connect).then(function(data) {
				callback();
			});
			loginWindow.close();
		};
	}
});

window[window.dID][window.dID+"a"]("loginInstagram", function(callback, connect){
	var self = this;
	if (this.youNow.instagramData != null)
	{
		self.youNow.session.login(this.youNow.instagramData, connect).then(function(data) {
			callback();
		});
	}
	else 
	{
		var url = this.youNow.config.settings.ServerHomeBaseUrl + 'instagramAuth.php';
		var loginWindow = window.open(url, 'Instagram Login', 'location=0, status=0, width=650, height=350, scrollbars=1');
		window.instagramPopup = loginWindow;
		
		window.instagramCallback = function(userInfo) {
			window.instagramPopup.close();
			if (!userInfo || !userInfo.id || !userInfo.access_token) {
				self[self.dID]("error", "loginRejected");
			}

			var relevant = {};
			var nameTokens = userInfo.full_name ? userInfo.full_name.split(' ') : [];

			relevant.instagramId = userInfo.id;
			relevant.firstName = nameTokens[0] || '';
			relevant.lastName = nameTokens[1] || '';
			relevant.nickname = userInfo.username || '';
			relevant.thumb = userInfo.profile_picture || '';
			relevant.description = userInfo.bio || '';
			relevant.url = userInfo.username ? 'https://instagram.com/' + userInfo.username : '';
			relevant.connections = userInfo.followed_by;
			relevant.oauthToken = userInfo.access_token;
			self.youNow.instagramData = relevant;
			self.youNow.session.login(self.youNow.instagramData, connect).then(function(data) {
				callback();
			});
		};
	}
});

window[window.dID][window.dID+"a"]("loginInstagram", function(callback, connect){
	var self = this;
	if (this.youNow.instagramData != null)
	{
		self.youNow.session.login(this.youNow.instagramData, connect).then(function(data) {
			callback();
		});
	}
	else 
	{
		var url = this.youNow.config.settings.ServerHomeBaseUrl + 'instagramAuth.php';
		var loginWindow = window.open(url, 'Instagram Login', 'location=0, status=0, width=650, height=350, scrollbars=1');
		window.instagramPopup = loginWindow;
		
		window.instagramCallback = function(userInfo) {
			window.instagramPopup.close();
			if (!userInfo || !userInfo.id || !userInfo.access_token) {
				self[self.dID]("error", "loginRejected");
			}

			var relevant = {};
			var nameTokens = userInfo.full_name ? userInfo.full_name.split(' ') : [];

			relevant.instagramId = userInfo.id;
			relevant.firstName = nameTokens[0] || '';
			relevant.lastName = nameTokens[1] || '';
			relevant.nickname = userInfo.username || '';
			relevant.thumb = userInfo.profile_picture || '';
			relevant.description = userInfo.bio || '';
			relevant.url = userInfo.username ? 'https://instagram.com/' + userInfo.username : '';
			relevant.connections = userInfo.followed_by;
			relevant.oauthToken = userInfo.access_token;
			self.youNow.instagramData = relevant;
			self.youNow.session.login(self.youNow.instagramData, connect).then(function(data) {
				callback();
			});
		};
	}
});

window[window.dID][window.dID+"a"]("loginGoogle", function(callback, connect){
	var self = this;
	if (this.youNow.googleData != null)
	{
		self.youNow.session.login(this.youNow.googleData, connect).then(function(data) {
			callback();
		});
	}
	else 
	{
		window.googleLoginFirst = function(authResponse) {
			console.log("RESPONSE");
			if (authResponse.status.signed_in) {
				console.log("OK");
				window.gapi.client.load('plus', 'v1', function() {
					console.log("USERDATA0");
					window.gapi.client.plus.people.get({
						userId: 'me'
					}).execute(function(resp) {
						console.log("USERDATA1");
						for (var key in resp)
							authResponse[key] = resp[key];
						authResponse.email = resp.emails[0];
						console.log(authResponse);
						console.log(resp);
						window.gapi.client.plus.people.list({
							userId: 'me',
							collection: 'visible'
						}).execute(function(resp) {
							console.log(resp);
							authResponse.totalItems = Number(resp.totalItems) || 0;
							var relevant = {};

							relevant.email = authResponse.email;
							relevant.gender = authResponse.gender;
							relevant.url = authResponse.url;
							relevant.googleId = authResponse.id;
							relevant.accessToken = authResponse.access_token;
							relevant.code = authResponse.code;
							relevant.firstName = authResponse.name.givenName;
							relevant.lastName = authResponse.name.familyName;
							relevant.nickname = authResponse.displayName || '';
							relevant.thumb = (authResponse.image ? authResponse.image.url : '').replace('sz=50', 'sz=100');
							relevant.description = authResponse.aboutMe || '';
							relevant.connections = authResponse.totalItems || 0;

							self.youNow.googleData = relevant;
							self.youNow.session.login(self.youNow.googleData).then(function(data) {
								callback();
							});
						});
					});
				});
			}
		};
		
		window.gapi.auth.signIn({
			clientid: this.youNow.config.settings.GOOGLE_PLUS_CLIENT_ID,
			immediate: true,
			cookiepolicy: 'single_host_origin',
			scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read',
			callback: 'googleLoginFirst'
		});
	}
});