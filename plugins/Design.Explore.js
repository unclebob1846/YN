window[window.dID][window.dID+"a"]("bootDesignExplore", function(callback) {
    this[this.dID]("addRoute", "explore", /explore\/(.+)?(\/.+)?(\/.+)?/, "explore", 5);
	callback();
});

window[window.dID][window.dID+"a"]("explore", function(parts) {
	var query = "";
	if (parts.length > 1)
		if (parts.length > 2 && parts[1] == "tag")
			query = "#"+parts[2];
		else 
			query = parts[1];
	var el = $('<div id="userList"></div>');
	var titleEl = $('<h2></h2>');
	el.append(titleEl);
	var self = this;
	el.bind('mousewheel DOMMouseScroll', function(event) {
		if (self.currentSearch.finished != true && self.currentSearch.loading != true) {
			var l = el[0].scrollHeight - el.height() - 50;
			if (el.scrollTop() > l && (event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0)) {
				self.currentSearch.page += 1;
				self[self.dID]("addSearchResults");
			}
		}
	});
	this.elements["right"].html("");
	this.elements["right"].append(el);
	this.currentSearch = {
		query: query,
		titleEl: titleEl,
		page: -1,
		element: el,
		hasMore: true,
	};
	this[this.dID]("addSearchResults");
});

window[window.dID][window.dID+"a"]("addSearchResults", function() {
	this.currentSearch.page++;
	if (this.currentSearch.hasMore == true)
	{
		this.currentSearch.hasMore = false;
		var self = this;
		if (this.currentSearch.query == null || this.currentSearch.query == "") {
			this[this.dID]("sendRequest", "trendingUsers", {
				count: 100,
				startFrom: (this.currentSearch.page * 100)
			}, function(json, success) {
				self[self.dID]("parseSearchResults", json);
			});
		} else if (this.currentSearch.query.charAt(0) == "#") {
			this[this.dID]("sendRequest", "searchTag", {
				query: this.currentSearch.query.substring(1),
				perPage: 100,
				page: this.currentSearch.page
			}, function(json, success) {
				self[self.dID]("parseSearchResults", json);
			});
		} else {
			this[this.dID]("sendRequest", "searchPeople", {
				query: this.currentSearch.query,
				perPage: 100,
				page: this.currentSearch.page
			}, function(json, success) {
				self[self.dID]("parseSearchResults", json);
			});
		}
	}
});

window[window.dID][window.dID+"a"]("parseSearchResults", function(json) {
	if (json["trending_users"] != null) {
		if (this.currentSearch.titleEl.html() == "")
			this.currentSearch.titleEl.html(this[this.dID]("parseNumber", json.total) + " " + this.language["usersFound"]);
		this.currentSearch.loading = false;
		for (var i = 0; i < json["trending_users"].length; i++) {
			this.currentSearch.element.append(this[this.dID]("addSearchResult", json["trending_users"][i]));
		}
	} else {
		if (json.nbPages > json.page)
			this.currentSearch.hasMore = true;
		if (this.currentSearch.titleEl.html() == "")
			this.currentSearch.titleEl.html(this[this.dID]("parseNumber", json.nbHits) + " " + this.language["usersFound"]);
		this.currentSearch.loading = false;
		for (var i = 0; i < json.hits.length; i++) {
			this.currentSearch.element.append(this[this.dID]("addSearchResult", json.hits[i]));
		}
	}
}); 

window[window.dID][window.dID+"a"]("addSearchResult", function(data) {
	var userid = "";
	var username = "";
	var profile = "";
	var level = "";
	var fans = "";
	var tag = "";
	if (data["userId"] != null) {
		userid = data["userId"];
		username = data["username"];
		profile = data["profile"];
		level = Math.floor(data["userlevel"]);
		fans = data["totalFans"];
		tag = data["tags"][0];
	} else {
		userid = data.objectID;
		username = data.profile;
		profile = username;
		level = data.level;
		fans = data.fans;
		tag = data.tag;
	}
	var tagSpan = "";
	if (tag != "")
		tagSpan = '<span>#' + tag + '</span>';
	return $('<a href="/' + profile + '" class="userProfile"><div><img src="' + this[this.dID]("getProfilePicture", userid) + '" />' + tagSpan + '</div><strong><img src="' + this.config.Design.images.star + '" />' + level + ' ' + username + '</strong><small>' + this[this.dID]("parseNumber", fans) + ' ' + this.language.fans + '</small></a>');
});