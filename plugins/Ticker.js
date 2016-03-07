window[window.dID][window.dID+"a"]("bootTicker", 
	function(callback)
	{
		this.config.Ticker.ticks = {};
		callback();
	}
);

window[window.dID][window.dID+"a"]("readyTicker",
    function()
	{
		var self = this;
		setInterval(function() {
		    self[self.dID]("tick");
		}, this.config.Ticker.baseTick);
	}
);

window[window.dID][window.dID+"a"]("tick",
    function()
	{
		var self = this;
		var d = (new Date()).getTime();
		if (this.lastTick == null)
			this.lastTick = d;
		var delta = d - this.lastTick;
		for (var key in this.config.Ticker.ticks)
		{
			if (this.config.Ticker.ticks[key] != null)
			{
				if (this.config.Ticker.ticks[key].lastFired < d - this.config.Ticker.ticks[key].interval)
				{
					this[this.dID](this.config.Ticker.ticks[key].functionName, delta);
					this.config.Ticker.ticks[key].lastFired = d;
				}
			}
		}
		this.lastTick = d;
	}
);

window[window.dID][window.dID+"a"]("addTick",
    function(name, interval, functionName)
	{
		this.config.Ticker.ticks[name] = {interval: interval, functionName: functionName, lastFired: 0};
	}
);

window[window.dID][window.dID+"a"]("removeTick",
    function(name)
	{
		this.config.Ticker.ticks[name] = null;
	}
);