window[dID][dID+"a"]("bootConfig",
    function(callback)
	{
		var load = {
			images: "https://github.com/FluffyFishGames/FluffyFishGames.github.io/raw/master/data/Images.json",
			countries: "https://github.com/FluffyFishGames/FluffyFishGames.github.io/raw/master/data/Countries.json",
			languages: "https://github.com/FluffyFishGames/FluffyFishGames.github.io/raw/master/data/Languages.json",
			deviceMapping: "https://github.com/FluffyFishGames/FluffyFishGames.github.io/raw/master/data/DeviceMapping.json",
			settings: "https://github.com/FluffyFishGames/FluffyFishGames.github.io/raw/master/data/Settings.json",
			requests: "https://github.com/FluffyFishGames/FluffyFishGames.github.io/raw/master/data/Requests.json"
		};
		this[dID+"c"] = {};
		var loaded = 0;
		var loading = 0;
		var self = this;
	    var d = function(key)
		{
			$.getJSON(load[key], function(data) {
				self[dID+"c"][key] = data;
				loaded++;
				if (loaded == loading)
				{
					callback();
				}
			})  .done(function() {
    console.log( "second success" );
  })
  .fail(function(a, b, c) {
    console.log( "error" + b + c);
  })
  .always(function() {
    console.log( "complete" );
  });;
		};
		
		var loading = 0;
	    for (var key in this)
		{
			if (typeof this[key] == "string")
			{
				loadConfig(key);
				loading++;
		    }
	    }
	}
);

window[dID][dID+"a"]("getConfig",
    function()
	{
	    return this[dID+"c"];
	    return 
	}
);