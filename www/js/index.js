var app = {
    init: function() {
		console.log("here");
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
    },
	bind_login: function() {
		$(".btn-login").on("click", function() {
			$.ajax({
				method: "POST",
				url: localStorage.server + "/api/method/login",
				data: {
					usr: $("#usr").val(),
					pwd: $("#pwd").val()
				}).success(function(data) {
					localStorage.user = $("#usr").val();
					localStorage.session_id = frappe.get_cookie("sid");
					app.start_desk();
				}).error(function() {
					frappe.msgprint("Invalid Login");
				}).always(function() {
					$("#usr").val("");
					$("#pwd").val("");
				});
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
	}
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
        return server.replace(/(http[s]?:\/\/[^/]*)(.*)/, "$1");
    },
    setup_login: function() {
        $(".div-select-server").addClass("hide");
        $(".div-login").removeClass("hide");
		if(localStorage.login_id && localStorage.session_id) {
			app.if_session_valid(app.start_desk);
		} else {

		}
    },
	if_session_valid: function(callback) {

	},
	start_desk: function() {

	},
    retry_server: function() {
        frappe.msgprint("Does not seem like a valid server address. Please try again.");
        $(".div-select-server").removeClass("hide");
        $(".div-login").addClass("hide");
        $("#server").val("");
    }
};

document.addEventListener('deviceready', app.init, false);
