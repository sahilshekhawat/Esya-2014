/*
	BigVideo - The jQuery Plugin for Big Background Video (and Images)
	by John Polacek (@johnpolacek)

	Dual licensed under MIT and GPL.

	Dependencies: jQuery, jQuery UI (Slider), Video.js, ImagesLoaded
*/

(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// Register as an anonymous AMD module:
		define([
			'jquery',
			'videojs',
			'imagesloaded',
			'jquery-ui'
		], factory);
	} else {
		factory(jQuery, videojs);
	}
})(function($, videojs) {

	$.BigVideo = function(options) {

		var defaults = {
			// If you want to use a single mp4 source, set as true
			useFlashForFirefox:true,
			// If you are doing a playlist, the video won't play the first time
			// on a touchscreen unless the play event is attached to a user click
			forceAutoplay:false,
			controls:false,
			doLoop:false,
			container:$('body'),
			shrinkable:false,
			id: 0
		};

		var settings = $.extend({}, defaults, options);

		var BigVideo = this,
			player,
			vidEl = '.big-video-vid',
			wrap = $('<div class="big-video-wrap"></div>'),
			video = $(''),
			mediaAspect = 16/9,
			vidDur = 0,
			defaultVolume = 0.8,
			isInitialized = false,
			isSeeking = false,
			isPlaying = false,
			isQueued = false,
			isAmbient = false,
			playlist = [],
			currMediaIndex,
			currMediaType;

		function updateSize() {
			var self = settings.container;
			var windowW = self.width();
			var windowH = self.height();
			var windowAspect = windowW/windowH;

			var vid = self.find(vidEl);

			if (windowAspect < mediaAspect) {
				// taller
				if (currMediaType === 'video') {
					player
						.width(windowH*mediaAspect)
						.height(windowH);
					if (settings.shrinkable == false) {
						vid
							.css('top',0)
							.css('left',-(windowH*mediaAspect-windowW)/2)
							.css('height',windowH);
					} else {
						vid
							.css('top',-(windowW/mediaAspect-windowH)/2)
							.css('left',0)
							.css('height',windowW/mediaAspect);
					};

					vid.find('video').css('width',windowH*mediaAspect);

					vid.find(vidEl + ' object, ' + vidEl + ' embed')
						.css('width',windowH*mediaAspect)
						.css('height',windowH);

				} else {
					// is image
					self.find(vidEl+'-image')
						.css({
							width: '100%',
							height: windowH,
							top:0,
							left:-(windowH*mediaAspect-windowW)/2
						});
				}
			} else {
				// wider
				if (currMediaType === 'video') {
					player
						.width(windowW)
						.height(windowW/mediaAspect);

					vid
						.css('top',-(windowW/mediaAspect-windowH)/2)
						.css('left',0)
						.css('height',windowW/mediaAspect);

					vid.find('video').css({
						width: vid.find('video').parent().width()
					});

					vid.find(vidEl + ' object, ' + vidEl + ' embed')
						.css('width',windowW)
						.css('height',windowW/mediaAspect);

				} else {
					// is image
					self.find(vidEl+'-image')
						.css({
							width: windowW,
							height: '100%',
							top:-(windowW/mediaAspect-windowH)/2,
							left:0
						});
				}
			}
		}

		function initPlayControl() {
			var self = settings.container;

			// create video controller
			var markup = [
				'<div class="big-video-control-container">',
					'<div class="big-video-control">',
						'<a href="#" class="big-video-control-play"></a>',
						'<div class="big-video-control-middle">',
							'<div class="big-video-control-bar">',
								'<div class="big-video-control-bound-left"></div>',
								'<div class="big-video-control-progress"></div>',
								'<div class="big-video-control-track"></div>',
								'<div class="big-video-control-bound-right"></div>',
							'</div>',
						'</div>',
						'<div class="big-video-control-timer"></div>',
					'</div>',
				'</div>'
			].join('');
			self.append(markup);

			// hide until playVideo
			self.find('.big-video-control-container').css('display','none');
			self.find('.big-video-control-timer').css('display','none');

			// add events
			self.find('.big-video-control-track').slider({
				animate: true,
				step: 0.01,
				slide: function(e,ui) {
					isSeeking = true;
					self.find('.big-video-control-progress').css('width',(ui.value-0.16)+'%');
					player.currentTime((ui.value/100)*player.duration());
				},
				stop:function(e,ui) {
					isSeeking = false;
					player.currentTime((ui.value/100)*player.duration());
				}
			});

			self.find('.big-video-control-bar').click(function(e) {
				player.currentTime((e.offsetX/$(this).width())*player.duration());
			});

			self.find('.big-video-control-play').click(function(e) {
				e.preventDefault();
				playControl('toggle');
			});

			player.on('timeupdate', function() {
				if (!isSeeking && (player.currentTime()/player.duration())) {
					var currTime = player.currentTime();
					var minutes = Math.floor(currTime/60);
					var seconds = Math.floor(currTime) - (60*minutes);
					if (seconds < 10) seconds='0'+seconds;
					var progress = player.currentTime()/player.duration()*100;
					self.find('.big-video-control-track').slider('value',progress);
					self.find('.big-video-control-progress').css('width',(progress-0.16)+'%');
					self.find('.big-video-control-timer').text(minutes+':'+seconds+'/'+vidDur);
				}
			});
		}

		function playControl(a) {
			var action = a || 'toggle';
			if (action === 'toggle') action = isPlaying ? 'pause' : 'play';
			if (action === 'pause') {
				player.pause();
				$('#big-video-control-play-'+settings.id).css('background-position','-16px');
				isPlaying = false;

			} else if (action === 'play') {
				player.play();
				$('#big-video-control-play-'+settings.id).css('background-position','0');
				isPlaying = true;
			}
		}

		function setUpAutoPlay() {
			player.play();
			settings.container.off('click',setUpAutoPlay);
		}

		function nextMedia() {
			currMediaIndex++;
			if (currMediaIndex === playlist.length) currMediaIndex=0;
			playVideo(playlist[currMediaIndex]);
		}

		function playVideo(source) {
			var self = settings.container;

			// clear image
			$(vidEl).css('display','block');
			currMediaType = 'video';
			player.src(source);
			isPlaying = true;
			if (isAmbient) {
				$('#big-video-control-container-'+settings.id).css('display','none');
				player.ready(function(){
					player.volume(defaultVolume);
				});
				doLoop = true;
			} else {
				$('#big-video-control-container-'+settings.id).css('display','block');
				player.ready(function(){
					player.volume(defaultVolume);
				});
				doLoop = false;
			}
			self.find(vidEl+'-image').css('display','none');
			$(vidEl).css('display','block');
		}

		function showPoster(source) {
			var self = settings.container;

			// remove old image
			self.find(vidEl+'-image').remove();

			// hide video
			player.pause();
			$(vidEl).css('display','none');
			$('#big-video-control-container-'+settings.id).css('display','none');

			// show image
			currMediaType = 'image';
			var bgImage = $('<img class="'+vidEl.substr(1)+'-image" src='+source+' />');
			wrap.append(bgImage);

			self.find(vidEl+'-image').imagesLoaded(function() {
				mediaAspect = self.find(vidEl+'-image').width() / self.find(vidEl+'-image').height();
				updateSize();
				self.fadeIn('slow');
			});
		}

		BigVideo.init = function() {
			var self = settings.container;

			if (!isInitialized) {
				// create player
				settings.container.prepend(wrap);
				var autoPlayString = settings.forceAutoplay ? 'autoplay' : '';
				player = $('<video class="video-js vjs-default-skin big-video-vid" preload="auto" data-setup="{}" '+autoPlayString+' webkit-playsinline></video>');
				player.css('position','absolute');
				wrap.append(player);

				var videoTechOrder = ['html5','flash'];
				// If only using mp4s and on firefox, use flash fallback
				var ua = navigator.userAgent.toLowerCase();
				var isFirefox = ua.indexOf('firefox') != -1;
				if (settings.useFlashForFirefox && (isFirefox)) {
					videoTechOrder = ['flash', 'html5'];
				}
				player = videojs(player[0], {
					controls:false,
					autoplay:true,
					preload:'auto',
					techOrder:videoTechOrder
				});

				// add controls
				if (settings.controls) initPlayControl();

				// set initial state
				updateSize();
				isInitialized = true;
				isPlaying = false;

				if (settings.forceAutoplay) {
					settings.container.on('click', setUpAutoPlay);
				}

				self.find(vidEl + ' object, ' + vidEl + ' embed')
					.attr('scale','noborder')
					.attr('width','100%')
					.attr('height','100%');

				// set events
				$(window).on('resize.bigvideo', function() {
					updateSize();
				});

				player.on('loadedmetadata', function(data) {
					var flash = self.find(vidEl + ' object, ' + vidEl + ' embed');
					var html5 = self.find(vidEl + ' video');
					if (flash.length > 0) {
						// use flash callback to get mediaAspect ratio
						mediaAspect = flash[0].vjs_getProperty('videoWidth') / flash[0].vjs_getProperty('videoHeight');
					} else {
						// use html5 player to get mediaAspect
						mediaAspect = html5.prop('videoWidth') / html5.prop('videoHeight');
					}
					updateSize();
					var dur = Math.round(player.duration());
					var durMinutes = Math.floor(dur/60);
					var durSeconds = dur - durMinutes*60;
					if (durSeconds < 10) durSeconds='0'+durSeconds;
					vidDur = durMinutes+':'+durSeconds;
				});

				player.on('ended', function() {
					if (settings.doLoop) {
						player.currentTime(0);
						player.play();
					}
					if (isQueued) {
						nextMedia();
					}
				});
			}
		};

		BigVideo.show = function(source,options) {
			if (options === undefined) options = {};
			isAmbient = options.ambient === true;
			if (isAmbient || options.doLoop) settings.doLoop = true;
			if (typeof(source) === 'string') {
				var ext = source.substring(source.lastIndexOf('.')+1);
				if (ext === 'jpg' || ext === 'gif' || ext === 'png') {
					showPoster(source);
				} else {
					if (options.altSource && navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
						source = options.altSource;
					}
					playVideo(source);
					options.onShown && options.onShown();
					isQueued = false;
				}
			} else {
				playlist = source;
				currMediaIndex = 0;
				playVideo(playlist[currMediaIndex]);
				options.onShown && options.onShown();
				isQueued = true;
			}
		};

		// Expose Video.js player
		BigVideo.getPlayer = function() {
			return player;
		};

		// Remove/dispose the player
		BigVideo.remove = BigVideo.dispose = function() {
			isInitialized = false;

			wrap.remove();
			$(window).off('resize.bigvideo');

			if(player) {
				player.off('loadedmetadata');
				player.off('ended');
				player.dispose();
			}
		};

		// Expose BigVideoJS player actions (like 'play', 'pause' and so on)
		BigVideo.triggerPlayer = function(action){
			playControl(action);
		};
	};

});