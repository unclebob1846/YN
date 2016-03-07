window[window.dID][window.dID+"a"]("readyInit", function() {
	var b = window.localStorage.getItem(this[this.dID]("name", "browse"));
	if (b != null && b != "") {
		window.history.pushState({ 
			"html": "",
			"pageTitle": ""
		}, "", "https://www.younow.com/" + b);
		window.localStorage.setItem(this[this.dID]("name", "browse"), "");
	}
});