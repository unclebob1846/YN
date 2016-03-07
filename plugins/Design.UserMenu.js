window[window.dID][window.dID+"a"]("bootDesignUserMenu", function(callback) {
	var self = this;
	this[this.dID]("addLanguageTable", "Design.UserMenu", "https://fluffyfishgames.github.io/"+this.baseFolder+"language/Design.UserMenu.json");
	this.config.Design.UserMenu = {
		buttons: {},
	};
	this[this.dID]("onLogin", function(){
		this.elements["userMenu"] = $(".user-menu");
		this.elements["userMenuList"] = self.elements["userMenu"].find("ul");
		this.elements["userMenuPanel"] = self.elements["userMenuList"].find(".user");
		this.elements["userMenuProgressText"] = self.elements["userMenuPanel"].find(".user-progress-text");
		this.elements["userMenu"].find("[translate=header_profile]").html(this.language["Design.UserMenu"].profile);
		this.elements["userMenu"].find("[translate=header_settings]").html(this.language["Design.UserMenu"].settings);
		this.elements["userMenu"].find("[translate=header_invite_friends]").html(this.language["Design.UserMenu"].inviteFriends);
		this.elements["userMenu"].find("[translate=header_logout]").html(this.language["Design.UserMenu"].logout);
		this[self.dID]("addTick", "userMenu", 2000, "tickUserMenu");
		for (var key in this.config.Design.UserMenu.buttons)
		{
			this[this.dID]("addUserMenuItemElement", key);
		}
	});
	this[this.dID]("onLogout", function(){
		this[this.dID]("removeTick", "userMenu");	
	});
	callback();
});

window[window.dID][window.dID+"a"]("readyDesignUserMenu", function() {
	
});

window[window.dID][window.dID+"a"]("addUserMenuItem", function(name, icon, callback) {
	this.config.Design.UserMenu.buttons[name] = {icon: icon, callback: callback};
	
	if (this.config.loggedIn)
	{
		this[this.dID]("addUserMenuItemElement", name);
	}
});

window[window.dID][window.dID+"a"]("addUserMenuItemElement", function(name) {
	if (this.config.loggedIn)
	{
		var liElement = $('<li><a href><i style="font-size:22px;vertical-align:middle;padding:0px 18px 0px 7px;line-height:25px;" class="icon fa fa-'+this.config.Design.UserMenu.buttons[name].icon+'"></i><span>'+name+'</span></a></li>');
		var self = this;
		liElement.click(function(){
			self.config.Design.UserMenu.buttons[name].callback();
			return false;
		});
		this.elements["userMenuList"].append(liElement);
	}
});

window[window.dID][window.dID+"a"]("tickUserMenu", function(deltaTime) {
	if (this.youNow.session.user != null && this.youNow.session.user.userId > 0)
	{
		this.elements["userMenuProgressText"].html(this.language["Design.UserMenu"].userProgress.replace("%1", this.youNow.session.user.progress).replace("%2", Math.floor(this.youNow.session.user.realLevel)+1));
	}
});