window[window.dID][window.dID+"a"]("bootAccountRecreator", function(callback) {
	this[this.dID]("addLanguageTable", "AccountRecreator", "https://fluffyfishgames.github.io/language/AccountRecreator.json");
	callback();
});

window[window.dID][window.dID+"a"]("readyAccountRecreator", function() {
	var self = this;
	this[this.dID]("addUserMenuItem", this.language["AccountRecreator"]["menuTitle"], "refresh", function() {
		var login = "";
        if (self.youNow.session.user.twitterAuth == 1)
            login = "twitter";
        else if (self.youNow.session.user.googleAuth == 1)
            login = "google";
        else if (self.youNow.session.user.instagramAuth == 1)
            login = "instagram";
        else if (self.youNow.session.user.facebookAuth == 1)
            login = "facebook";

        self.config.AccountRecreator = {
            'renameOnLogin': self.youNow.session.user.profile,
            'task': 'remove',
            'login': login,
        };
		self[self.dID]("addTick", "recreateAccount", 50, "tickRecreateAccount");
	});
});

window[window.dID][window.dID+"a"]("tickRecreateAccount", function() {
	if (this.config.AccountRecreator.task == 'remove') {
		var self = this;
		$.ajax({
			xhr: function() {
				var xhr = jQuery.ajaxSettings.xhr();
				var setRequestHeader = xhr.setRequestHeader;
				xhr.setRequestHeader = function(name, value) {
					if (name == 'X-Requested-With') return;
					setRequestHeader.call(this, name, value);
				}
				return xhr;
			},
			url: 'https://www.younow.com/php/api/channel/updateSettings',
			method: "POST",
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'X-Requested-By': this.youNow.session.user.requestBy,
			},
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			data: {
				"tsi": this.config.tsi,
				"tdi": this.config.tdi,
				"userId": this.youNow.session.user.userId,
				"channelId": this.youNow.session.user.userId,
				"deactivation": 1
			},
			success: function(json, b, c) {
				self.youNow.session.logout();
				self.config.AccountRecreator.task = 'waitForLogout';
			},
			error: function(a, b, c) {}
		});
		this.config.AccountRecreator.task = 'waiting';
	} else if (this.config.AccountRecreator.task == 'waitForLogout') {
		if (this.youNow.session.user.userId == 0) {
			this.config.AccountRecreator.task = 'login';
		}
	} else if (this.config.AccountRecreator.task == 'login') {
		this.youNow.session.auth(this.config.AccountRecreator.login);
		this.config.AccountRecreator.task = 'waitForLogin';
	} else if (this.config.AccountRecreator.task == 'waitForLogin') {
		if (this.youNow.session.user.userId > 0) {
			this.config.AccountRecreator.task = 'restoreAccount';
		}
	} else if (this.config.AccountRecreator.task == 'restoreAccount') {
		var self = this;
		$.ajax({
			xhr: function() {
				var xhr = jQuery.ajaxSettings.xhr();
				var setRequestHeader = xhr.setRequestHeader;
				xhr.setRequestHeader = function(name, value) {
					if (name == 'X-Requested-With') return;
					setRequestHeader.call(this, name, value);
				}
				return xhr;
			},
			url: 'https://www.younow.com/php/api/channel/updateSettings',
			method: "POST",
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'X-Requested-By': this.youNow.session.user.requestBy,
			},
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			data: {
				"tsi": this.config.tsi,
				"tdi": this.config.tdi,
				"userId": this.youNow.session.user.userId,
				"channelId": this.youNow.session.user.userId,
				"profileUrlString": this.config.AccountRecreator.renameOnLogin
			},
			success: function(json, b, c) {
				self.youNow.session.getSession();
			},
			error: function(a, b, c) {}
		});

		this.config.AccountRecreator.task = 'finished';

		self[self.dID]("removeTick", "recreateAccount");
	}
});