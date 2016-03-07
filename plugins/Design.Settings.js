window[window.dID][window.dID+"a"]("bootDesignSettings", function(callback)
{
	this[this.dID]("addRoute", "settings", /settings/, "openSettings", 4);
	this[this.dID]("addIDs", ['settings', 'settingsContent']);
	this.config.Design.Settings = {tabs: {}};
	callback();
});

window[window.dID][window.dID+"a"]("addSettingsTab", function(label, func)
{
	this.config.Design.Settings.tabs[label] = func;
});

window[window.dID][window.dID+"a"]("openSettings", function(callback, page)
{
	this.elements["right"].html('<div id="'+this.config.Design.ids.settings+'"><ul class="tabBar"></ul><div id="'+this.config.Design.ids.settingsContent+'"></div></div>');
	var tabs = this.elements["right"].find(".tabBar").first();
	this[this.dID]("updateElements");
	this.config.Design.Settings.tabsElements = {};
	var c = 0;
	for (var key in this.config.Design.Settings.tabs)
		c++;
	var self = this;
	
	var addTab = function(key, func)
	{
		var li = $('<li style="width:'+(100/c)+'%">'+key+'</li>');
		li.click(function(){
			self.elements.settingsContent.html("");
			func();
			//self.elements.settingsContent.append(func());
			for (var k in self.config.Design.Settings.tabsElements)
				self.config.Design.Settings.tabsElements[k].removeClass("active");
			self.config.Design.Settings.tabsElements[key].addClass("active");
		});
		tabs.append(li);
		return li;
	};
	var first = true;
	for (var key in this.config.Design.Settings.tabs)
	{ 
		this.config.Design.Settings.tabsElements[key] = addTab(key, this.config.Design.Settings.tabs[key]);
		if (page == key || (page == null && first))
		{
			this.elements.settingsContent.html("");
			this.elements.settingsContent.append(this.config.Design.Settings.tabs[key]());
			this.config.Design.Settings.tabsElements[key].addClass("active");
		}
		first = false;
	}
});