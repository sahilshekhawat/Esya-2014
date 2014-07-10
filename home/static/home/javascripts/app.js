var api = new FacePP('2476ffbd198aed30856dfd874ad6678a', '_uWnk_nVgy-fzyqyoDRxK-TB_RymaGEJ', { apiURL: '' });

function detect() {
	$('.button.scan').hide();
	$('.carregando').show();

	
	api.request('detection/detect', {
		url: img,
		attribute: 'glass,pose,gender,age,race,smiling'
	}, function(err, result) {
		if (err) {
			$('#response').text('Load failed.');
			return;
		}

		if (result.face.length == 0 || result.face[0].attribute.gender.value == "Male") {
			$('.facebook-error').text('Oops. Você está tentando trollar nossos cientistas? Esta imagem não está com uma boa resolução ou é uma foto de um macho barburdo. Escolha outra foto.').show();
			$('.carregando').hide();
			$('.button.scan').show();
		} else {
			$('.facebook-error').hide();
			var attribute = result.face[0].attribute,
				face_id = result.face[0].face_id,
				position = result.face[0].position,
				age = attribute.age.value,
				gender = attribute.gender.value == 'Female' ? 'Feminino' : 'Masculino',
				glasses = attribute.glass.value == 'None' ? 'Não usa óculos' : 'Usa óculos',
				race = attribute.race.value,
				eyes = position.eye_left.x.toFixed(2) + '% / ' + position.eye_right.x.toFixed(2) + '%',
				mouth = position.mouth_left.x.toFixed(2) + '% / ' + position.mouth_right.x.toFixed(2) + '%',
				nose = position.nose.x.toFixed(2) + '% / ' + position.nose.y.toFixed(2) + '%',
				smiling = attribute.smiling.value;
				smiling_text = smiling < 20 ? 'Não está sorrindo' : 'Está sorrindo';

			if (attribute.race.value == 'White') {
				var race = "Caucasiano";
			} else if (attribute.race.value == "Black") {
				var race = "Negro";
			} else {
				var race = "Asiático";
			}

			api.request('detection/landmark', {
				url: img,
				face_id : face_id
			}, function(err, result) {
				var obj = result.result[0].landmark;
				for(var mano in obj) {
					var currX = obj[mano].x;
					var currY = obj[mano].y;
					$('#result .photo').append('<div class="point" style="top: ' + currY + '%; left: ' + currX + '%;">')
				}
			});

			$('#upload .photo img').clone().appendTo('#result .photo');

			$('.age .data').text(age);
			$('.gender .data').text(gender);
			$('.eye-distance .data').text(eyes);
			$('.nose-position .data').text(nose);
			$('.glass span').text(glasses);
			$('.mouth-position .data').text(mouth);
			$('.race .data').text(race);
			$('.smile span').text(smiling_text);

			var randomNumber = Math.floor(Math.random()*2);

			var texts = new Array();

			if (age < 30)
				texts[0] = 'É sua mãe ou sua irmã?';
			else
				texts[0] = 'Uau, sua mãe tá superconservada!';

			randomNumber = Math.floor(Math.random()*4);

			if (randomNumber == 0) {
				texts[1] = 'A pele da sua mãe parece um pêssego.';
			} else if (randomNumber == 1) {
				texts[1] = 'Pele macia que parece de bebê.';
			} else if (randomNumber == 2 ) {
				texts[1] = 'Sua mãe saiu do salão agora?';
			} else {
				texts[1] = 'Sua mãe é garota propaganda de xampu?'
			}

			randomNumber = Math.floor(Math.random()*2);

			if (smiling > 20) {
				texts[2] = randomNumber == 1 ? 'Esse sorriso ilumina o dia!' : 'Olha aí a alegria da sua mãe esperando o presente.';
			} else {
				texts[2] = randomNumber == 1 ? 'Sua mãe não parece contente. Melhor acertar no presente.' : 'Vê se dá motivos para sua mãe sorrir.';
			}

			$('#loading-1 .text').text(texts[0]);
			$('#loading-2 .text').text(texts[1]);
			$('#loading-3 .text').text(texts[2]);

			var generic_keywords = new Array();
			generic_descs = new Array();

			var arr = [];
			while(arr.length < 6){
				var randomnumber=Math.ceil(Math.random()*61)
				var found=false;
				for(var i=0;i<arr.length;i++){
					if(arr[i]==randomnumber){found=true;break}
  				}
				if(!found)arr[arr.length]=randomnumber;
			}

			buscape.load(generic_keywords[arr[0]], arr[0]);
			buscape.load(generic_keywords[arr[1]], arr[1]);
			buscape.load(generic_keywords[arr[2]], arr[2]);
			buscape.load(generic_keywords[arr[3]], arr[3]);
			buscape.load(generic_keywords[arr[4]], arr[4]);
			buscape.load(generic_keywords[arr[5]], arr[5]);

	//		$('#loading-video').show();
		//	ambient.bvs[1].getPlayer().play();

			$('#upload').addClass('detect-is-done');
			$('.carregando').hide();
			loading.start();
		}
	
		console.log(result);
		//$('#response').text(JSON.stringify(result));
	});

	return false;
};

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

		//ambient.bvs[1].getPlayer().pause();
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
		} else {
			flash.play();
		}

		return false;
	}
}

var video = {
	open : function () {
		$('#video').addClass('open');
		$('.button').hide();
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();
		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		playVideo();
		
		return false;
	},
	close : function () {
		if (player) {
			player.pauseVideo();
			paused = true;
			if ($('#video').hasClass('open'))
				$('.toggle-sound').click();
		}
		$('#video').removeClass('open');
		$('.button').show();
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		
		login.close();
		register.close();
		
		$('.pop-up-container').removeClass('show');
		return false;	
	}
}

var section = {
	navigate : function () {
		var that = $(this),
			href = that.attr('href');

		if (that.parents('section').attr('id') == 'home') {
			if (that.parents('section').find('.checkbox').hasClass('active') === false) {
				that.parents('section').find('.error').addClass('show');

				return false;
			} else {
				that.parents('section').removeClass('current');
				$(href).addClass('current');

				if (href != '#home') {
					$('.small-logo').addClass('show');
				}
			}
		} else {
			that.parents('section').removeClass('current');
			$(href).addClass('current');

			if (href != '#home') {
				$('.small-logo').addClass('show');
			}
		}

		return false;
	}
}

var upload = {
	load : function () {
		var uploadContainer = $('#upload');

		$('#photo-upload').uploadify({
			'formData'     : {
				'timestamp' : uploadContainer.data('timestamp'),
				'token' : uploadContainer.data('token')
			},
			'fileSizeLimit' : '2024KB',
			'width' : 124,
			'height' : 124,
			'swf' : '/s/upload/uploadify.swf',
			'uploader' : '/s/upload/uploadify.php',
			'onUploadStart' : function () {
				$('.carregando').show();
				$('.button.scan').hide();
			},
			'onUploadSuccess' : function(file, data, response) {
				uploadContainer.removeClass('loaded scanning done');
				$('.facebook-error').hide();
				$('.carregando').hide();
				$('.button.scan').show();
				setTimeout(function () {
					upload.succes(data, uploadContainer);
				}, 1000);
			}
		});
	},
	succes : function (path, uploadContainer, fb) {
		if (fb) {
			var img = $('<img src="' + path +'">');
		} else {
			var img = $('<img src="images/uploads/' + path +'">');
		}

		var imgClass;
		uploadContainer.addClass('scanning');

		setTimeout(function () {
			$.ionSound.play("scan");
		}, 500);

		img.load(function () {

			uploadContainer.find('.photo img').remove();
			uploadContainer.find('.photo').append(img);

			if (img.width() > img.height()) {
				imgClass = 'fixed-height';
			} else {
				imgClass = 'fixed-width';
			}

			uploadContainer.find('.photo img').addClass(imgClass);
			
			if (img.width() > img.height()) {
				uploadContainer.find('.photo img').css({
					'margin-left' : (img.width() / 2) * -1,
					'left' : '50%'
				});
			} else {
				uploadContainer.find('.photo img').css({
					'margin-top' : (img.height() / 2) * -1,
					'top' : '50%'
				});
			}

			uploadContainer.addClass('loaded');

			setTimeout(function () {
				uploadContainer.addClass('done');
			}, 1000);
		})
	}
}

var face = {
	detect : function () {
		
	}
}

var buscape = {
	id : '6c4c4459554c64444578633d',
	source : '22677209',
	cont : 0,
	api : null,
	load : function (keyword, ind) {
		buscape.api = new BuscapeAPI(buscape.id, buscape.source);

		$.ajax({
			url : 'http://bws.buscape.com/service/findOfferList/6c4c4459554c64444578633d/BR/?keyword=' + keyword + '&sourceId=22677209&format=json',
			dataType : 'json',
			success : function (result) {
				var contain = $('.product-info').eq(buscape.cont);
				contain.find('h3').text(result.offer[0].offer.offershortname);
				contain.find('img').attr('src', result.offer[0].offer.thumbnail.url);
				contain.find('.link').attr('href', result.offer[0].offer.links[0].link.url);
				contain.find('p').text(generic_descs[ind]);

				buscape.cont++;
			}
		});
	}
}

var loading = {
	motio : new Array(),
	start : function () {
		$('.loaders').addClass('show');
		loading.motio[0] = new Motio(document.getElementById('loading-1'), {
			fps : 16,
			frames : 50
		});

		loading.motio[1] = new Motio(document.getElementById('loading-2'), {
			fps : 16,
			frames : 36
		});

		loading.motio[2] = new Motio(document.getElementById('loading-3'), {
			fps : 16,
			frames : 42
		});

		loading.play();
	},
	play : function () {
		loading.motio[0].play();

		var currentFrame = 2;

		loading.motio[0].on('frame', function () {
			if (currentFrame == loading.motio[0].frames) {
				loading.pause(0);
				$('#loading-1 .text').addClass('show');
			}

			currentFrame++;
		});

		setTimeout(function () {
			loading.motio[1].play();

			var currentFrame2 = 2;

			loading.motio[1].on('frame', function () {
				if (currentFrame2 == loading.motio[1].frames) {
					loading.pause(1);
					$('#loading-2 .text').addClass('show');
				}

				currentFrame2++;
			});
		}, 6000);

		setTimeout(function () {
			loading.motio[2].play();

			var currentFrame3 = 2;

			loading.motio[2].on('frame', function () {
				if (currentFrame3 == loading.motio[2].frames) {
					loading.pause(2);
					$('#loading-3 .text').addClass('show');
				}

				currentFrame3++;
			});
		}, 9000);

		setTimeout(function () {
			$('.scan-fake-button').click();
			//$('#loading-video').hide();
			//ambient.bvs[1].getPlayer().pause();
		}, 13000);
	},
	pause : function (anim) {
		loading.motio[anim].toEnd(true);
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

var face = {
	motio : null,
	start : function () {
		face.motio = new Motio(document.getElementById('face'), {
			fps : 17,
			frames : 17
		});

		face.play();
	},
	play : function () {
		face.motio.play();
	}
}

var checkbox = {
	toggle : function (event) {
		if( event.target.tagName === "LABEL" || event.target.tagName === "SPAN" || event.target.tagName === "DIV"  ) {
			$(this).toggleClass('active');
			if ($(this).hasClass('active')) {
				$(this).find('.error').removeClass('show');
			}
		}
	}
}


var wtf = {
	open : function () {
		$('#wtf').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#wtf').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
//======================

var events = {
	open : function () {
		$('#events').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		wtf.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#events').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
var techathlon = {
	open : function () {
		$('#techathlon').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		events.close();
		wtf.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#techathlon').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
var eceevents = {
	open : function () {
		$('#eceevents').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		events.close();
		techathlon.close();
		wtf.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#eceevents').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
var funevents = {
	open : function () {
		$('#funevents').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		events.close();
		techathlon.close();
		eceevents.close();
		wtf.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#funevents').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
var entertainment = {
	open : function () {
		$('#entertainment').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		wtf.close();
		flagship.close();
		updatess.close();
		unleash.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#entertainment').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
var flagship = {
	open : function () {
		$('#flagship').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		wtf.close();
		unleash.close();
		updatess.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#flagship').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}

var unleash = {
	open : function () {
		$('#unleash').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		wtf.close();
		rules.close();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#unleash').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}

var updatess = {
	open : function () {
		$('#updatess').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		wtf.close();
		rules.close();
		aboutesya.close();
		iot.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		unleash.close();
		
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#updatess').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
var sponsnew = {
	open : function () {
		$('#sponsnew').addClass('open');
		//$('.button').hide();
		$('#video').removeClass('open');
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		wtf.close();
		rules.close();
		aboutesya.close();
		iot.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		unleash.close();
		updatess.close();
		login.close();
		register.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#sponsnew').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
//==================
var rules = {
	open : function () {
		$('#rules').addClass('open');
		$('.button').hide();
		aboutesya.close();
		iot.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		spons.close();
		designed.close();
		reachus.close();
		login.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();
		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#rules').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}

//=================================================================================================================================
var ievent1 = {
	open : function () {
		$('#ievent1').addClass('open');
		//$('.button').hide();
		$('#wtf').hide();
		$('#flagship').hide();$('#unleash').hide();
		$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();
		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#ievent1').removeClass('open');
		$('.button').show();
		$('#wtf').show();
		$('#flagship').show();
		$('#unleash').show();
		$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}

		
var ievent2 = {open : function (){ $('#ievent2').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent2').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent3 = {open : function (){ $('#ievent3').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent3').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent4 = {open : function (){ $('#ievent4').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent4').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent5 = {open : function (){ $('#ievent5').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent5').removeClass('open');$('.button').show();$('#wtf').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent6 = {open : function (){ $('#ievent6').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent6').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent7 = {open : function (){ $('#ievent7').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent7').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent8 = {open : function (){ $('#ievent8').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent8').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent9 = {open : function (){ $('#ievent9').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent9').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent10 = {open : function (){ $('#ievent10').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent10').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent11 = {open : function (){ $('#ievent11').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent11').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent12 = {open : function (){ $('#ievent12').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent12').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent13 = {open : function (){ $('#ievent13').addClass('open');$('#wtf').hide();$('#flagship').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent13').removeClass('open');$('.button').show();$('#wtf').show();$('#flagship').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent14 = {open : function (){ $('#ievent14').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent14').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent15 = {open : function (){ $('#ievent15').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#flagship').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent15').removeClass('open');$('.button').show();$('#wtf').show();$('#flagship').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent16 = {open : function (){ $('#ievent16').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent16').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent17 = {open : function (){ $('#ievent17').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent17').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent18 = {open : function (){ $('#ievent18').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent18').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent19 = {open : function (){ $('#ievent19').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent19').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent20 = {open : function (){ $('#ievent20').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent20').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent21 = {open : function (){ $('#ievent21').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent21').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent22 = {open : function (){ $('#ievent22').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent22').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent23 = {open : function (){ $('#ievent23').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent23').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent24 = {open : function (){ $('#ievent24').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent24').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent25 = {open : function (){ $('#ievent25').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent25').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent26 = {open : function (){ $('#ievent26').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent26').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent27 = {open : function (){ $('#ievent27').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent27').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent28 = {open : function (){ $('#ievent28').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent28').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent29 = {open : function (){ $('#ievent29').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent29').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent30 = {open : function (){ $('#ievent30').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent30').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent31 = {open : function (){ $('#ievent31').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent31').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}
var ievent32 = {open : function (){ $('#ievent32').addClass('open');$('#wtf').hide();$('#flagship').hide();$('#unleash').hide();$('.imdate').hide();$('.slideshow-block').hide();$('#events').hide();$('#techathlon').hide();$('#eceevents').hide();$('#funevents').hide();$('#entertainment').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();return false;
	},close : function (){$('#ievent32').removeClass('open');$('.button').show();$('#wtf').show();$('#events').show();$('#techathlon').show();$('#eceevents').show();$('#funevents').show();$('#entertainment').show();$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();return false;}}

	
	//=========
var iot = {
	open : function () {
		$('#iot').addClass('open');
		//$('.button').hide();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		designed.close();
		reachus.close();
		spons.close();
		rules.close();
		login.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#iot').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}	
var aboutesya = {
	open : function () {
		$('#aboutesya').addClass('open');
		//$('.button').hide();
		iot.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		designed.close();
		reachus.close();
		spons.close();
		rules.close();
		login.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#aboutesya').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}

var aboutiiitd = {
	open : function () {
		$('#aboutiiitd').addClass('open');
		//$('.button').hide();
		iot.close();
		aboutesya.close();
		schedule.close();
		contactus.close();
		designed.close();
		reachus.close();
		spons.close();
		rules.close();
		login.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#aboutiiitd').removeClass('open');
		$('.button').show();
	$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();	
		return false;	
	}
}

var schedule = {
	open : function () {
		$('#schedule').addClass('open');
		//$('.button').hide();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		contactus.close();
		designed.close();
		reachus.close();
		spons.close();
		rules.close();
		login.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#schedule').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}

var reachus = {
	open : function () {
		$('#reachus').addClass('open');
		//$('.button').hide();
		aboutesya.close();
		iot.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		designed.close();
		spons.close();
		rules.close();
		login.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#reachus').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}

var contactus = {
	open : function () {
		$('#contactus').addClass('open');
		//$('.button').hide();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		designed.close();
		reachus.close();
		spons.close();
		rules.close();
		login.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#contactus').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
var spons = {
	open : function () {
		$('#spons').addClass('open');
		//$('.button').hide();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		designed.close();
		reachus.close();
		rules.close();
		login.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#spons').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}

var designed = {
	open : function () {
		$('#designed').addClass('open');
		//$('.button').hide();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		reachus.close();
		spons.close();
		rules.close();
		login.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#designed').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}
var login = {
	open : function () {
		$('#login').addClass('open');
		//$('.button').hide();
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		designed.close();
		reachus.close();
		spons.close();
		rules.close();
		register.close();
		$('#video').removeClass('open');
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updatess.close();
		location.hash='';
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();

		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#login').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		
		return false;	
	}
}

var register = {
	open : function () {
		$('#register').addClass('open');
		$('#video').removeClass('open');
		//$('.button').hide();
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();
		
		iot.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
		designed.close();
		reachus.close();
		spons.close();
		rules.close();
		login.close();
		wtf.close();
		events.close();
		techathlon.close();
		eceevents.close();
		funevents.close();
		entertainment.close();
		flagship.close();
		unleash.close();
		updates.close();
		location.hash='';
		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
		return false;
	},
	close : function () {
		$('#register').removeClass('open');
		$('.button').show();
		$('.imdate').show();
		$('.slideshow-block').show();
		$('#blkk1').show();
		$('#blkk2').show();
		$('#blkk3').show();
		$('#blkk4').show();
		return false;	
	}
}

//========
$(window).load(function () {
	
	
	$('#wtf ul li a').on('click', function () {
		$('.wtf-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	//==========
	$('#events ul li a').on('click', function () {
		$('.events-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	
	$('#techathlon ul li a').on('click', function () {
		$('.techathlon-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	
	$('#eceevents ul li a').on('click', function () {
		$('.eceevents-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	
	$('#funevents ul li a').on('click', function () {
		$('.funevents-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	
	$('#entertainment ul li a').on('click', function () {
		$('.entertainment-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	
	$('#flagship ul li a').on('click', function () {
		$('.flagship-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	
	$('#unleash ul li a').on('click', function () {
		$('.unleash-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	$('#updatess ul li a').on('click', function () {
		$('.updatess-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	$('#sponsnew ul li a').on('click', function () {
		$('.sponsnew-content p').hide().eq($(this).parent().index()).show();
		return false;
	});
	$('#login ul li a').on('click', function () {
		$('.login-content p').hide().eq($(this).parent().index()).show();
		return false;
	});

	$('#register ul li a').on('click', function () {
		$('.register-content p').hide().eq($(this).parent().index()).show();
		return false;
	});

	//=========
	var urlBuscape;
	$(document).on('click', '#result .product-info a', function () {
		urlBuscape = $(this).attr('href');
		$('.pop-up-container').addClass('show').find('.box-one').show().parent().find('.box-two').hide();

		return false;
	});

	$('.buscape-bt').on('click', function () {
		$('.box-one').hide();
		$('.box-two').show();

		setTimeout(function () {
			document.location.href = urlBuscape;
		}, 3000);

		return false;
	});

	
	$('#result .product-container .navigation a').on('click', function (e) {
		e.preventDefault();
		var active = $(this).parents('.product-container').find('.active');

		if ($(this).hasClass('up')) {
			if (active.index() == 1) {
				active.removeClass('active');
				$(this).parents('.product-container').find('.product-info').eq(2).addClass('active');
			} else {
				active.removeClass('active').prev().addClass('active');
			}
		} else {
			if (active.index() == 3) {
				active.removeClass('active');
				$(this).parents('.product-container').find('.product-info').eq(0).addClass('active');
			} else {
				active.removeClass('active').next().addClass('active');
			}
		}
	});

	$.ionSound({
		sounds: [
			"gui_2_2",
			"tranzistor_nav",
			"scan",
			"button_click"
			],
		path: "/s/sounds/",
		multiPlay: true,
		volume: ".5"
	});
	//==== changes====
	$.ionSound({
		sounds: [
			"button1"
		],
		path: "/s/sounds/",
		multiPlay: true,
		volume: ".2"
	});
	$.ionSound({
		sounds: [
			"scan1"
		],
		path: "/s/sounds/",
		multiPlay: true,
		volume: ".5"
	});
	// video.append();
	ambient.append();
	sound.append();
	var isChromium = window.chrome,
    vendorName = window.navigator.vendor;
if(isChromium !== null && vendorName === "Google Inc.") {
   // is Google chrome 
   //$('#logo').hide();
   //$('#ambient1').hide();
} else { 
	//logo.start();
	//$('#logo').hide();
	//$('#ambient').hide();
	
}
	face.start();
	upload.load();

	$('#teaser .button').on('click', video.remove);
	$('.button.navigate').on('click', section.navigate);

	//$('.participate').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.scan').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.button.share').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.button.again').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.close').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.watch-the-video').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.wtf').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.events').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.techathlon').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.eceevents').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.funevents').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.entertainment').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.flagship').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.unleash').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.updatess').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.sponsnew').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	
	$('.login1').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.register1').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	
	
	$('.buscape-bt').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.right .up').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.right .down').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.left .up').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.left .down').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});

	$('.facebook-button').on('click', fb_login);
	
	
	$('.button.wtf').on('click', function () {
		wtf.open();
	});
	//=====
	$('.button.events').on('click', function () {
		events.open();
	});
	$('.button.techathlon').on('click', function () {
		techathlon.open();
	});
	$('.button.eceevents').on('click', function () {
		eceevents.open();
	});
	$('.button.funevents').on('click', function () {
		funevents.open();
	});
	$('.button.entertainment').on('click', function () {
		entertainment.open();
	});
	$('.button.flagship').on('click', function () {
		flagship.open();
	});
	$('.button.unleash').on('click', function () {
		unleash.open();
	});
	$('.button.updatess').on('click', function () {
		updatess.open();
	});
	$('.button.sponsnew').on('click', function () {
		sponsnew.open();
	});
	$('.button.login1').on('click', function () {
		login.open();
	});
	
	$('.button.register1').on('click', function () {
		register.open();
	});
	$('.reg2').on('click', function () {
		register.open();
	});
	$('.log2').on('click', function () {
		login.open();
	});
	$('.ievent1').on('click', function () {
		ievent1.open();
	});
	$('.ievent2').on('click', function () { ievent2.open(); });
	$('.ievent3').on('click', function () { ievent3.open(); });
	$('.ievent4').on('click', function () { ievent4.open(); });
	$('.ievent5').on('click', function () { ievent5.open(); });
	$('.ievent6').on('click', function () { ievent6.open(); });
	$('.ievent7').on('click', function () { ievent7.open(); });
	$('.ievent8').on('click', function () { ievent8.open(); });
	$('.ievent9').on('click', function () { ievent9.open(); });
	$('.ievent10').on('click', function () { ievent10.open(); });
	$('.ievent11').on('click', function () { ievent11.open(); });
	$('.ievent12').on('click', function () { ievent12.open(); });
	$('.ievent13').on('click', function () { ievent13.open(); });
	$('.ievent14').on('click', function () { ievent14.open(); });
	$('.ievent15').on('click', function () { ievent15.open(); });
	$('.ievent16').on('click', function () { ievent16.open(); });
	$('.ievent17').on('click', function () { ievent17.open(); });
	$('.ievent18').on('click', function () { ievent18.open(); });
	$('.ievent19').on('click', function () { ievent19.open(); });
	$('.ievent20').on('click', function () { ievent20.open(); });
	$('.ievent21').on('click', function () { ievent21.open(); });
	$('.ievent22').on('click', function () { ievent22.open(); });
	$('.ievent23').on('click', function () { ievent23.open(); });
	$('.ievent24').on('click', function () { ievent24.open(); });
	$('.ievent25').on('click', function () { ievent25.open(); });
	$('.ievent26').on('click', function () { ievent26.open(); });
	$('.ievent27').on('click', function () { ievent27.open(); });
	$('.ievent28').on('click', function () { ievent28.open(); });
	$('.ievent29').on('click', function () { ievent29.open(); });
	$('.ievent30').on('click', function () { ievent30.open(); });
	$('.ievent31').on('click', function () { ievent31.open(); });
	$('.ievent32').on('click', function () { ievent32.open(); });
	
	$('.tc').on('click', function () {location.hash='';
		
		ievent1.close();
		ievent2.close();ievent3.close();ievent4.close();ievent5.close();ievent6.close();ievent7.close();ievent8.close();ievent9.close();ievent10.close();ievent11.close();ievent12.close();ievent13.close();ievent14.close();ievent15.close();ievent16.close();ievent17.close();ievent18.close();ievent19.close();ievent20.close();ievent21.close();ievent22.close();ievent23.close();
		ievent24.close();ievent25.close();ievent26.close();ievent27.close();ievent28.close();ievent29.close();ievent30.close();ievent31.close();ievent32.close();
		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
	});
	$('.exttc').on('click', function () {location.hash='';
		
		$('#sponsnew').removeClass('open');
		$('.imdate').hide();
		$('.slideshow-block').hide();
		$('#blkk1').hide();
		$('#blkk2').hide();
		$('#blkk3').hide();
		$('#blkk4').hide();
	});
	//=====
	//$('.participate, .button, .up, .down').on('mouseenter click', function (event)
	$('.button, .up, .down').on('mouseenter click', function (event) {
		if (!$('body').hasClass('silence')) {
			if (event.type == 'mouseenter')
				$.ionSound.play("button_click");
			else if (event.type == 'click') {
				$.ionSound.play("gui_2_2");
			}
		}
	});
	//================ changes==
	$('.fbtnsou').on('mouseenter click', function (event) {
		if (!$('body').hasClass('silence')) {
			if (event.type == 'mouseenter')
				$.ionSound.play("button1");
			else if (event.type == 'click') {
				$.ionSound.play("gui_2_2");
			}
		}
	});
	$('.blockev').on('mouseenter click', function (event) {
		if (!$('body').hasClass('silence')) {
			if (event.type == 'mouseenter')
				$.ionSound.play("scan1");
			else if (event.type == 'click') {
				$.ionSound.play("gui_2_2");
			}
		}
	});
	$('#ievent1, #ievent2, #ievent3, #ievent4, #ievent5, #ievent6, #ievent7, #ievent8, #ievent9, #ievent10, #ievent11, #ievent12, #ievent13, #ievent14, #ievent15, #ievent16, #ievent17, #ievent18, #ievent19, #ievent20, #ievent21, #ievent22, #ievent23, #ievent24, #ievent25, #ievent26, #ievent27, #ievent28, #ievent29, #ievent30, #ievent31, #ievent32').on('mouseenter click', function (event) {
		if (!$('body').hasClass('silence')) {
			if (event.type == 'mouseenter')
				$.ionSound.play("gui_2_2");
			else if (event.type == 'click') {
				$.ionSound.play("gui_2_2");
			}
		}
	});
	$('.close').on('click', video.close);
	$('.watch-the-video').on('click', video.open);
	

	$('.checkbox').on('click', checkbox.toggle);
	$('.toggle-sound').on('click', sound.mute);
	$('#footer ul li a').on('mouseenter click', function (event) {
		if (!$('body').hasClass('silence')) {
			if (event.type == 'mouseenter')
				$.ionSound.play("tranzistor_nav");
			else if (event.type == 'click') {
				$.ionSound.play("gui_2_2");
			}
		}
	});
	$('.designer').on('mouseenter click', function (event) {
		if (!$('body').hasClass('silence')) {
			if (event.type == 'mouseenter')
				$.ionSound.play("tranzistor_nav");
			else if (event.type == 'click') {
				$.ionSound.play("gui_2_2");
			}
		}
	});

	$('.button.scan').on('click', detect);
	$('.rules').on('click', rules.open);
	// =====
	$('.iot').on('click', iot.open);
	$('.aboutesya').on('click', aboutesya.open);
	$('.aboutiiitd').on('click', aboutiiitd.open);
	$('.schedule').on('click', schedule.open);
	$('.reachus').on('click', reachus.open);
	$('.contactus').on('click', contactus.open);
	$('.spons').on('click', spons.open);
	$('.designed').on('click', designed.open);
	
	//====
});

$(window).on('load', function (e) 
{
	if (e.type == 'load') 
	{
		if (location.hash == '#ievent1') {			
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent1').addClass('open');
			$('.tc').on('click', function () {location.hash='';location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent2') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent2').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});	
		}
		else if (location.hash == '#ievent3') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent3').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent4') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent4').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent5') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent5').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent6') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent6').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent7') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent7').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent8') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent8').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent9') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent9').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent10') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent10').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent11') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent11').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent12') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent12').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent13') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent13').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent14') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent14').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent15') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent15').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent16') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent16').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent17') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent17').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent18') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent18').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent19') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent19').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent20') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent20').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent21') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent21').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent22') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent22').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent23') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent23').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent24') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent24').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent25') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent25').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent26') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent26').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent27') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent27').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent28') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent28').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
		else if (location.hash == '#ievent29') {
			$('.imdate').hide();$('.slideshow-block').hide();$('#blkk1').hide();$('#blkk2').hide();$('#blkk3').hide();$('#blkk4').hide();
			$('#ievent29').addClass('open');
			$('.tc').on('click', function () {location.hash='';$('.imdate').show();$('.slideshow-block').show();$('#blkk1').show();$('#blkk2').show();$('#blkk3').show();$('#blkk4').show();});
		}
	} 
});
