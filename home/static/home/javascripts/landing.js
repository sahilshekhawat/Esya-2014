$(function () {
	var counter = {
		start : function () {
			var launch = new Date(2014, 04 - 1, 30, 12);
			$('#counter').countdown({ until : launch });
		}
	}

	function getFlashMovieObject(movieName) {
		if (window.document[movieName]) {
			return window.document[movieName];
		}

		if (navigator.appName.indexOf('Microsoft Internet')==-1) {
			if (document.embeds && document.embeds[movieName])
				return document.embeds[movieName]; 
		} else {
			return document.getElementById(movieName);
		}
	};

	var ambient = {
		container : $('#ambient'),
		bvs : new Array(),
		append : function () {
			var $videos = $('.bv');

			$.each($videos, function (i, elm) {
				ambient.bvs[i] = new $.BigVideo({
					useFlashForFirefox: false,
					container: $(elm),
					id: i
				});
				ambient.bvs[i].init();
				ambient.bvs[i].show($(elm).data('video'), {
					ambient: true
				});
			});
		},
		remove : function () {
			ambient.container.addClass('hide');
			ambient.mute();
		},
		mute : function () {
			var volume = 1;
			
			var fadeout = setInterval( function() {
				if (volume > 0) {
					volume -= 0.03;
					ambient.player.getPlayer().volume(volume);
				} else {
					clearInterval(fadeout);
				}
			}, 3);
		}
	}
	var sound = {
		append : function () {
			params = {
				allowScriptAccess : 'always',
				trustedDomains : location.hostname
			};
			var attributes = {
				id : 'background-sound'
			};
			swfobject.embedSWF('/s/sounds/ambient.swf', 'background-sound', '1', '1', '9.0.0', 'expressInstall.swf', null, params, attributes);
		},
		mute : function () {
			$(this).toggleClass('active');
			$('body').toggleClass('silence');

			var flash = getFlashMovieObject('background-sound'),
				that = $(this);

			if (that.hasClass('active')) {
				flash.stop();
				ambient.bvs[0].getPlayer().volume(0);
			} else {
				flash.play();
				ambient.bvs[0].getPlayer().volume(1);
			}

			return false;
		}
	}

	var logo = {
		motio : null,
		start : function () {
			logo.motio = new Motio(document.getElementById('logo'), {
				fps : 16,
				frames : 16
			});

			logo.play();
		},
		play : function () {
			logo.motio.play();

			var currentFrame = 1;

			logo.motio.on('frame', function () {
				if (currentFrame == logo.motio.frames) {
					logo.pause();
				}

				currentFrame++;
			});
		},
		pause : function () {
			logo.motio.toStart(true);

			setTimeout( function() {
				logo.play();
			}, 5000);
		}
	}

	var wtf = {
	open : function () {
		$('#wtf').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#wtf').removeClass('open');
		$('.button').show();
		return false;	
	}
}

var video = {
	open : function () {
		$('#video').addClass('open');
		$('.button').hide();
		playVideo();
		return false;
	},
	close : function () {
		$('#video').removeClass('open');
		$('.button').show();
		player.pauseVideo();
		wtf.close();
		return false;	
	}
}

	$(window).on('load', function () {
		$('.facebook').on('click', function () {
			elem = $(this);
			postToFeed(elem.data('title'), elem.data('desc'), elem.prop('href'), elem.data('image'));

			return false;
		});
		
		$.ionSound({
			sounds: [
				"gui_2_2",
				"button_click"
			],
			path: "sounds/",
			multiPlay: true,
			volume: ".5"
		});

		counter.start();
		ambient.append();
		sound.append();
		logo.start();

		$('.button.one').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
		$('.watch').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
		$('.close').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
		
		$('.close, .button').on('mouseenter click', function (event) {
			if (event.type == 'mouseenter')
				$.ionSound.play("button_click");
			else if (event.type == 'click') {
				$.ionSound.play("gui_2_2");
			}
		});

		$('.close').on('click', function () {
			video.close();
		});

		$('.button.wtf').on('click', function () {
			wtf.open();
		});

		$('.button.watch').on('click', function () {
			video.open();
		});

		$('.toggle-sound').on('click', sound.mute);	
	});
});

$('#wtf ul li a').on('click', function () {
	$('.wtf-content p').hide().eq($(this).parent().index()).show();
	return false;
});

$(window).on('blur focus', function (e) {
	if (e.type == 'blur') {
		if ($('.toggle-sound').hasClass('active') == false) {
			$('.toggle-sound').click();
		}
	} else {
		$('.toggle-sound').click();
	}
});