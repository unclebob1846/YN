window[window.dID][window.dID+"a"]("sendRequest", function(type, data, callback) {
	var request = {
		url: "",
		method: "GET",
		requestBy: false,
		pusherSocket: false,
		multipart: false,
		addIdentification: false,
		data: {},
		headers: {},
		accept: 'application/json, text/plain',
	};
	var url = "";
	var XRequestBy = false;
	var myData = {
		"$USERID": this.youNow.session.user.userId,
		"$BASE": "https://www.younow.com",
		"$CDNBASE": "https://cdn2.younow.com",
		"$PEOPLESEARCHINDEX": this.youNow.config.settings.PeopleSearchIndex,
	};

	if (this.config.Request[type] != null) {
		var r = JSON.parse(JSON.stringify(this.config.Request[type]));
		for (var key in r) {
			request[key] = r[key];
		}
		if (typeof request.data == 'object') {
			for (var key in request.data) {
				if (myData[request.data[key]] != null)
					request.data[key] = myData[request.data[key]];
				else if (request.data[key].charAt(0) == "%")
					request.data[key] = data[request.data[key].substring(1)];
			}
			for (var key in myData) {
				request.url = request.url.replace(key, myData[key]);
			}
			for (var key in data) {
				request.url = request.url.replace("%" + key, data[key]);
			}
		} else {
			for (var key in myData) {
				request.data = request.data.replace(key, myData[key]);
				request.url = request.url.replace(key, myData[key]);
			}
			for (var key in data) {
				request.data = request.data.replace("%" + key, data[key]);
				request.url = request.url.replace("%" + key, data[key]);
			}
		}
	}

	request.url = request.url.replace("http://", "https://");
	// prepare request
	if (request.requestBy) {
		request.headers["x-requested-by"] = this.youNow.session.user.requestBy;
	}
	if (request.pusherSocket) {
		request.data.socket_id = this.youNow.pusher.SDK.connection.socket_id;
	}
	if (request.addIdentification) {
		request.data.tsi = this.config.tsi;
		request.data.tdi = this.config.tdi;
	}
	if (request.addAlgolia) {
		request.headers["X-Algolia-API-Key"] = this.youNow.config.settings.PeopleSearchApiKey;
		request.headers["X-Algolia-Application-Id"] = this.youNow.config.settings.PeopleSearchAppId;
		request.headers["X-Algolia-TagFilters"] = this.youNow.config.settings.PeopleSearchSecurityTags;
	}
	// send request :)

	if (request.multipart) {
		var newData = new FormData();
		for (var key in request.data)
			newData.append(key, request.data[key]);
		request.data = newData;
	}

	var ajaxRequest = {
		url: request.url,
		headers: request.headers,
		method: request.method,
		data: request.data,
		xhr: function() {
			var xhr = jQuery.ajaxSettings.xhr();
			var setRequestHeader = xhr.setRequestHeader;
			xhr.setRequestHeader = function(name, value) {
				if (name == 'X-Requested-With') return;
				setRequestHeader.call(this, name, value);
			}
			return xhr;
		},
		success: function(json, b, c) {
			callback(json, true);
		},
		failed: function(a, b, c) {
			callback({
				errorCode: 31337
			}, false);
		},
	};
	
	if (request.dataType != null)
		ajaxRequest.dataType = request.dataType;

	if (request.addAlgolia) 
	{
		ajaxRequest.processData = false;
		ajaxRequest.contentType = "application/json;charset=utf-8";
	}
	if (request.multipart) {
		ajaxRequest.contentType = false;
		ajaxRequest.processData = false;
	}

	$.ajax(ajaxRequest);
});