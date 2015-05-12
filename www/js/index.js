var app = {
    init: function() {
		alert(window.location.href);
        if(localStorage.server) {
            app.setup_login();
        } else {
            $(".div-select-server").removeClass("hide");
        }
        app.bind_events();
    },
    bind_events: function() {
		app.bind_select_server();
		app.bind_login();
		app.bind_change_server();
    },
	bind_login: function() {
		$(".btn-login").on("click", function() {
			$.ajax({
				method: "POST",
				url: localStorage.server + "/api/method/login",
				data: {
					usr: $("#usr").val(),
					pwd: $("#pwd").val()
				}
			}).success(function(data, status, xhr) {
				localStorage.user = $("#usr").val();
				var cookie_source = xhr.getResponseHeader('Set-Cookie');
				localStorage.session_id = frappe.get_cookie("sid", cookie_source);
				app.start_desk();
			}).error(function() {
				frappe.msgprint("Invalid Login");
			}).always(function() {
				$("#usr").val("");
				$("#pwd").val("");
			});
			return false;
		});
	},
	bind_select_server: function() {
        $(".btn-select-server").on("click", function() {
            // check if erpnext / frappe server
            var server = app.get_server_value();

            if(server) {
                $.ajax(server + "/api/method/version")
                    .success(function(data) {
                        if(data.message) {
                            localStorage.server = server;
                            app.setup_login();
                        } else {
                            app.retry_server();
                        }
                    })
                    .error(function() {
                        app.retry_server();
                    });
            }
            return false;
        });
	},
	bind_change_server: function() {
		$(".change-server").on("click", function() {
			localStorage.server = null;
			app.show_server();
			return false;
		});
	},
    get_server_value: function() {
        var server = $("#server").val();
        if(!server) {
            app.retry_server();
            return false;
        }

        if(server.substr(0, 7)!== "http://" && server.substr(0, 7)!== "https://") {
            server = "https://" + server;
        }

        // remove trailing slashes
        return server.replace(/(http[s]?:\/\/[^\/]*)(.*)/, "$1");
    },
    setup_login: function() {
		if(localStorage.server && localStorage.session_id) {
			app.if_session_valid(app.start_desk, app.show_login);
		} else {
			app.show_login();
		}
    },
	show_login: function() {
        $(".div-select-server").addClass("hide");
        $(".div-login").removeClass("hide");
	},
	if_session_valid: function(if_yes, if_no) {
		app.set_sid_cookie();
		$.ajax({
			method: "GET",
			crossDomain: true,
			url: localStorage.server + "/api/method/ping",
		}).success(function(data) {
			if(data.message === "pong") {
				if_yes();
			} else {
				if_no();
			}
		}).error(function() {
			if_no();
		});
	},
	set_sid_cookie: function() {
		document.cookie = "sid=" + localStorage.session_id +
			"; expires=Fri, 31 Dec 9999 23:59:59 GMT";
	},
	start_desk: function() {
		window.location.href = localStorage.server + "/desk";
	},
    retry_server: function() {
        frappe.msgprint("Does not seem like a valid server address. Please try again.");
		app.show_server();
    },
	show_server: function() {
        $(".div-select-server").removeClass("hide");
        $(".div-login").addClass("hide");
        $("#server").val("");
	}
};

document.addEventListener('deviceready', app.init, false);
