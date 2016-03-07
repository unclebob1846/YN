window[window.dID][window.dID+"a"]("bootRouter", function(callback) {
	this[this.dID]("addTick", "router", 20, "tickRouter");
	this.config.Router = {};
    callback();
});

window[window.dID][window.dID+"a"]("addRoute", function(name, regex, functionName, greedFactor) {
	if (this.config.Router.routes == null)
		this.config.Router.routes = [];
	this.config.Router.routes.push({
		name: name,
		regex: regex,
		functionName: functionName,
		greedFactor: greedFactor,
	});
});

window[window.dID][window.dID+"a"]("tickRouter", function(deltaTime) {
	if (this.config.inDarkMode == true)
	{
		if (this.config.Router.lastURL == null || this.config.Router.lastURL != window.location.href)
		{
			var url = window.location.href.replace("http://","").replace("https://", "").replace("www.younow.com/", "").replace("younow.com/", "");
			var parts = url.split("/");
			var route = null;
			for (var i = 0; i < this.config.Router.routes.length; i++)
			{
				if (url.match(this.config.Router.routes[i].regex))
				{
					if (route == null || route.greedFactor < this.config.Router.routes[i].greedFactor)
					{
						route = this.config.Router.routes[i];
					}
				}
			}
			if (route != null)
			{
				if (this.config.Router.currentPage != route.name)
				{
					this.config.Router.currentPage = route.name;
					this[this.dID]("firePageChange");
				}
				this[this.dID](route.functionName, parts);
			}
			this.config.Router.lastURL = window.location.href;
		}
	}
});