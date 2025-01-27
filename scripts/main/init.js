/**
 * @description This module is used for bindings.
 */

$(document).ready(function () {
	$("#sensitive_warning").hide();

	// Event Name
	const eventName = lychee.getEventName();

	// Set API error handler
	api.onError = lychee.handleAPIError;

	$("html").css("visibility", "visible");

	// Multiselect
	multiselect.bind();

	// Header
	header.bind();

	// Image View
	lychee.imageview
		.on(eventName, ".arrow_wrapper--previous", () => photo.previous(false))
		.on(eventName, ".arrow_wrapper--next", () => photo.next(false))
		.on(eventName, "img, #livephoto", () => photo.cycle_display_overlay());

	// Keyboard
	Mousetrap.addKeycodes({
		18: "ContextMenu",
		179: "play_pause",
		227: "rewind",
		228: "forward",
	});

	Mousetrap.bind(["l"], function () {
		lychee.loginDialog();
		return false;
	})
		.bind(["k"], function () {
			u2f.login();
			return false;
		})
		.bind(["left"], function () {
			if (
				visible.photo() &&
				(!visible.header() || $("img#image").is(":focus") || $("img#livephoto").is(":focus") || $(":focus").length === 0)
			) {
				$("#imageview a#previous").click();
				return false;
			}
			return true;
		})
		.bind(["right"], function () {
			if (
				visible.photo() &&
				(!visible.header() || $("img#image").is(":focus") || $("img#livephoto").is(":focus") || $(":focus").length === 0)
			) {
				$("#imageview a#next").click();
				return false;
			}
			return true;
		})
		.bind(["u"], function () {
			if (!visible.photo() && album.isUploadable() && !album.isTagAlbum()) {
				$("#upload_files").click();
				return false;
			}
		})
		.bind(["n"], function () {
			if (!visible.photo() && album.isUploadable()) {
				album.add();
				return false;
			}
		})
		.bind(["s"], function () {
			if (visible.photo() && album.isUploadable()) {
				header.dom("#button_star").click();
				return false;
			} else if (visible.albums()) {
				header.dom(".header__search").focus();
				return false;
			}
		})
		.bind(["r"], function () {
			if (album.isUploadable()) {
				if (visible.album()) {
					album.setTitle([album.getID()]);
					return false;
				} else if (visible.photo()) {
					photo.setTitle([photo.getID()]);
					return false;
				}
			}
		})
		.bind(["h"], function () {
			lychee.nsfw_visible = !lychee.nsfw_visible;
			album.apply_nsfw_filter();
			return false;
		})
		.bind(["d"], function () {
			if (album.isUploadable()) {
				if (visible.photo()) {
					photo.setDescription(photo.getID());
					return false;
				} else if (visible.album()) {
					album.setDescription(album.getID());
					return false;
				}
			}
		})
		.bind(["t"], function () {
			if (visible.photo() && album.isUploadable()) {
				photo.editTags([photo.getID()]);
				return false;
			}
		})
		.bind(["i", "ContextMenu"], function () {
			if (!visible.multiselect()) {
				sidebar.toggle(true);
				return false;
			}
		})
		.bind(["command+backspace", "ctrl+backspace"], function () {
			if (album.isUploadable()) {
				if (visible.photo() && basicModal.visible() === false) {
					photo.delete([photo.getID()]);
					return false;
				} else if (visible.album() && basicModal.visible() === false) {
					album.delete([album.getID()]);
					return false;
				}
			}
		})
		.bind(["command+a", "ctrl+a"], function () {
			if (visible.album() && basicModal.visible() === false) {
				multiselect.selectAll();
				return false;
			} else if (visible.albums() && basicModal.visible() === false) {
				multiselect.selectAll();
				return false;
			}
		})
		.bind(["o"], function () {
			if (visible.photo()) {
				photo.cycle_display_overlay();
				return false;
			}
		})
		.bind(["f"], function () {
			if (visible.album() || visible.photo()) {
				lychee.fullscreenToggle();
				return false;
			}
		});

	Mousetrap.bind(["play_pause"], function () {
		// If it's a video, we toggle play/pause
		let video = $("video");

		if (video.length !== 0) {
			if (video[0].paused) {
				video[0].play();
			} else {
				video[0].pause();
			}
		}
	});

	Mousetrap.bindGlobal("enter", function () {
		if (basicModal.visible() === true) {
			// check if any of the input fields is focussed
			// apply action, other do nothing
			if ($(".basicModal__content input").is(":focus")) {
				basicModal.action();
				return false;
			}
		} else if (
			visible.photo() &&
			!lychee.header_auto_hide &&
			($("img#image").is(":focus") || $("img#livephoto").is(":focus") || $(":focus").length === 0)
		) {
			if (visible.header()) {
				header.hide();
			} else {
				header.show();
			}
			return false;
		}
		let clicked = false;
		$(":focus").each(function () {
			if (!$(this).is("input") && !$(this).is("textarea")) {
				$(this).click();
				clicked = true;
			}
		});
		if (clicked) {
			return false;
		}
	});

	// Prevent 'esc keyup' event to trigger 'go back in history'
	// and 'alt keyup' to show a webapp context menu for Fire TV
	Mousetrap.bindGlobal(
		["esc", "ContextMenu"],
		function () {
			return false;
		},
		"keyup"
	);

	Mousetrap.bindGlobal(["esc", "command+up"], function () {
		if (basicModal.visible() === true) basicModal.cancel();
		else if (visible.config() || visible.leftMenu()) leftMenu.close();
		else if (visible.contextMenu()) contextMenu.close();
		else if (visible.photo()) lychee.goto(album.getID());
		else if (visible.album() && !album.json.parent_id) lychee.goto();
		else if (visible.album()) lychee.goto(album.getParentID());
		else if (visible.albums() && search.json !== null) search.reset();
		else if (visible.mapview()) mapview.close();
		else if (visible.albums() && lychee.enable_close_tab_on_esc) {
			window.open("", "_self").close();
		}
		return false;
	});

	$(document)
		// Fullscreen on mobile
		.on("touchend", "#imageview #image", function () {
			// prevent triggering event 'mousemove'
			// why? this also prevents 'click' from firing which results in unexpected behaviour
			// unable to reproduce problems arising from 'mousemove' on iOS devices
			//			e.preventDefault();

			if (typeof swipe.obj === null || (Math.abs(swipe.offsetX) <= 5 && Math.abs(swipe.offsetY) <= 5)) {
				// Toggle header only if we're not moving to next/previous photo;
				// In this case, swipe.preventNextHeaderToggle is set to true
				if (!swipe.preventNextHeaderToggle) {
					if (visible.header()) {
						header.hide();
					} else {
						header.show();
					}
				}

				// For next 'touchend', behave again as normal and toggle header
				swipe.preventNextHeaderToggle = false;
			}
		});
	$("#imageview")
		// Swipe on mobile
		.swipe()
		.on("swipeStart", function () {
			if (visible.photo()) swipe.start($("#imageview #image, #imageview #livephoto"));
		})
		.swipe()
		.on(
			"swipeMove",
			/** @param {jQuery.Event} e */ function (e) {
				if (visible.photo()) swipe.move(e.swipe);
			}
		)
		.swipe()
		.on(
			"swipeEnd",
			/** @param {jQuery.Event} e */ function (e) {
				if (visible.photo()) swipe.stop(e.swipe, photo.previous, photo.next);
			}
		);

	// Document
	$(document)
		// Navigation
		.on(
			"click",
			".album",
			/** @param {jQuery.Event} e */ function (e) {
				multiselect.albumClick(e, $(this));
			}
		)
		.on(
			"click",
			".photo",
			/** @param {jQuery.Event} e */ function (e) {
				multiselect.photoClick(e, $(this));
			}
		)
		// Context Menu
		.on(
			"contextmenu",
			".photo",
			/** @param {jQuery.Event} e */ function (e) {
				multiselect.photoContextMenu(e, $(this));
			}
		)
		.on(
			"contextmenu",
			".album",
			/** @param {jQuery.Event} e */ function (e) {
				multiselect.albumContextMenu(e, $(this));
			}
		)
		// Upload
		.on("change", "#upload_files", function () {
			basicModal.close();
			upload.start.local(this.files);
		})
		.on("change", "#upload_track_file", function () {
			basicModal.close();
			upload.uploadTrack(this.files);
		})
		// Drag and Drop upload
		.on(
			"dragover",
			function () {
				return false;
			},
			false
		)
		.on(
			"drop",
			/** @param {jQuery.Event} e */ function (e) {
				if (
					album.isUploadable() &&
					!visible.contextMenu() &&
					!basicModal.visible() &&
					!visible.leftMenu() &&
					!visible.config() &&
					(visible.album() || visible.albums())
				) {
					// Detect if dropped item is a file or a link
					if (e.originalEvent.dataTransfer.files.length > 0) {
						upload.start.local(e.originalEvent.dataTransfer.files);
					} else if (
						e.originalEvent.dataTransfer.getData("Text").length > 3 &&
						!e.originalEvent.dataTransfer.getData("Text").startsWith("photo-") && // block drag and drop from albums/photos in web UI
						!e.originalEvent.dataTransfer.getData("Text").startsWith("album-")
					) {
						upload.start.url(e.originalEvent.dataTransfer.getData("Text"));
					}
				}

				return false;
			}
		)
		// click on thumbnail on map
		.on("click", ".image-leaflet-popup", function () {
			mapview.goto($(this));
		})
		// Paste upload
		.on(
			"paste",
			/** @param {jQuery.Event} e */ function (e) {
				if (e.originalEvent.clipboardData.items) {
					const items = e.originalEvent.clipboardData.items;
					let filesToUpload = [];

					// Search clipboard items for an image
					for (let i = 0; i < items.length; i++) {
						if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("video") !== -1) {
							filesToUpload.push(items[i].getAsFile());
						}
					}

					// We perform the check so deep because we don't want to
					// prevent the paste from working in text input fields, etc.
					if (
						filesToUpload.length > 0 &&
						album.isUploadable() &&
						!visible.contextMenu() &&
						!basicModal.visible() &&
						!visible.leftMenu() &&
						!visible.config() &&
						(visible.album() || visible.albums())
					) {
						upload.start.local(filesToUpload);

						return false;
					} else {
						return true;
					}
				}
			}
		);

	// Fullscreen
	if (lychee.fullscreenAvailable())
		$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange", lychee.fullscreenUpdate);

	$("#sensitive_warning").on("click", view.album.nsfw_warning.next);

	/**
	 * @param {number} scrollPos
	 * @returns {void}
	 */
	const rememberScrollPage = function (scrollPos) {
		if ((visible.albums() && !visible.search()) || visible.album()) {
			let urls = JSON.parse(localStorage.getItem("scroll"));
			if (urls == null || urls.length < 1) {
				urls = {};
			}

			let urlWindow = window.location.href;
			let urlScroll = scrollPos;

			urls[urlWindow] = urlScroll;

			if (urlScroll < 1) {
				delete urls[urlWindow];
			}

			localStorage.setItem("scroll", JSON.stringify(urls));
		}
	};

	$(window)
		// resize
		.on("resize", function () {
			if (visible.album()) view.album.content.justify(album.json ? album.json.photos : []);
			if (visible.search()) view.album.content.justify(search.json.photos);
			if (visible.photo()) view.photo.onresize();
		})
		// remember scroll positions
		.on("scroll", function () {
			let topScroll = $(window).scrollTop();
			rememberScrollPage(topScroll);
		});

	// Init
	lychee.init();
});
