window[window.dID][window.dID+"a"]("bootLanguage", function(callback) {
	var loading = 0;
	for (var key in this.config.languageTables)
	{
		loading++;
	}
	var loaded = 0;
	var self = this;
    var d = function(dkey, url)
	{
		$.ajax(url+"?v="+(Math.random() * 100000), {
			dataType: "json",
			success: function(json, b, c)
			{
				for (var k in json)
				{
					console.log(k + " _ " + dkey + " = ");
					console.log(json[k]);
					self.config.Language[k][dkey] = json[k];
				}
				loaded++;
				if (loaded == loading)
				{
					self.language = self.config.Language["de-DE"];
					callback();
				}
			},
			error: function(a, b, c)
			{
				loaded++;
				if (loaded == loading)
				{
					self.language = self.config.Language["de-DE"];
					callback();
				}
			}
		});
	};
	
	for (var key in this.config.languageTables)
	{
		d(key, this.config.languageTables[key]);
	}
});

window[window.dID][window.dID+"a"]("addLanguageTable", function(name, url) {
	if (this.config.languageTables == null)
		this.config.languageTables = {};
	this.config.languageTables[name] = url;
});