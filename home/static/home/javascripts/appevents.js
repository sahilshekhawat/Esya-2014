var api = new FacePP('2476ffbd198aed30856dfd874ad6678a', '_uWnk_nVgy-fzyqyoDRxK-TB_RymaGEJ', { apiURL: 'http://apius.faceplusplus.com/' });

function detect() {
	$('.button.scan').hide();
	$('.carregando').show();

	var img = $('#upload .photo img').attr('src');
	// var img = 'http://i.imgur.com/kc3u30A.jpg';
	// var img = 'http://i.imgur.com/w10VH9l.jpg'; //homem

	if (img.indexOf('http') == -1) {
		img = document.location.href + img;
	}

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

			generic_keywords[0] = 'pó facial';
			generic_keywords[1] = 'base';
			generic_keywords[2] = 'blush';
			generic_keywords[3] = 'bb cream';
			generic_keywords[4] = 'iluminador facial';
			generic_keywords[5] = 'gloss 3d';
			generic_keywords[6] = 'sombra';
			generic_keywords[7] = 'batom';
			generic_keywords[8] = 'lápis de olho';
			generic_keywords[9] = 'rímel';
			generic_keywords[10] = 'delineador';
			generic_keywords[11] = 'lenço de pescoço';
			generic_keywords[12] = 'touca';
			generic_keywords[13] = 'brinco';
			generic_keywords[14] = 'colar';
			generic_keywords[15] = 'tônico facial';
			generic_keywords[16] = 'creme de rosto';
			generic_keywords[17] = 'creme esfoliante facial';
			generic_keywords[18] = 'óculos';
            generic_keywords[19] = 'Pó Bronzeador';
            generic_keywords[20] = 'Pó facial compacto';
            generic_keywords[21] = 'Pó facial Solto';
            generic_keywords[22] = 'Pó facial Translúcido';
            generic_keywords[23] = 'Pó facial Mineral';
            generic_keywords[24] = 'Base em bastão';
            generic_keywords[25] = 'Base cremosa';
            generic_keywords[26] = 'Base em mousse';
            generic_keywords[27] = 'Base compacta';
            generic_keywords[28] = 'Base líquida';
            generic_keywords[29] = 'Blush em pó';
            generic_keywords[30] = 'Blush em mousse';
            generic_keywords[31] = 'Blush mineral';
            generic_keywords[32] = 'Blush em bastão';
            generic_keywords[33] = 'Sombra em pó';
            generic_keywords[34] = 'Sombra em creme';
            generic_keywords[35] = 'Sombra lápis';
            generic_keywords[36] = 'Sombra bastão';
            generic_keywords[37] = 'Batom cintilante';
            generic_keywords[38] = 'Batom cremoso';
            generic_keywords[39] = 'Batom matte';
            generic_keywords[40] = 'Lápis para olhos marrom';
            generic_keywords[41] = 'Rímel volume';
            generic_keywords[42] = 'Rímel à prova d’água';
            generic_keywords[43] = 'Caneta delineadora';
            generic_keywords[44] = 'Cachecol feminino seda';
            generic_keywords[45] = 'Cachecol feminino lã';
            generic_keywords[46] = 'Cachecol pashmina';
            generic_keywords[47] = 'Brinco flor';
            generic_keywords[48] = 'Brinco pedra';
            generic_keywords[49] = 'Brinco argola';
            generic_keywords[50] = 'Brinco pérola';
            generic_keywords[51] = 'Maxi brinco';
            generic_keywords[52] = 'Maxi Colar';
            generic_keywords[53] = 'Colar de pérolas';
            generic_keywords[54] = 'Colar com nome';
            generic_keywords[55] = 'Gargantilha';
            generic_keywords[56] = 'Tônico facial';
            generic_keywords[57] = 'Creme de rosto';
            generic_keywords[58] = 'Creme esfoliante facial';
            generic_keywords[59] = 'Óculos de sol feminino aviador';
            generic_keywords[60] = 'Óculos de sol feminino cor';
            generic_keywords[61] = 'Óculos de sol feminino cat';

			generic_descs[0] = 'Este pó facial é perfeito para o tom de pele de sua mãe. Ela vai adorar.';
			generic_descs[1] = 'Esta base é perfeita para a pele da sua mãe e deixa um visual muito mais natural.';
			generic_descs[2] = 'O blush certo vai realçar a beleza e a pele da sua mãe. Este é perfeito.';
			generic_descs[3] = 'Este BB Cream tem o tom da pele da sua mãe e cobre imperfeições sem deixar o make pesado.';
			generic_descs[4] = 'A pele da sua mãe precisa de brilho. Invista neste iluminador facial.';
			generic_descs[5] = 'Este gloss dá acabamento ao batom e combina com o sorriso da sua mãe.';
			generic_descs[6] = 'A cor da sombra precisa casar com o tom da pele. Esta aqui é a perfeita para o rosto da sua mãe.';
			generic_descs[7] = 'O tom da pele da sua mãe pede um batom como este.';
			generic_descs[8] = 'Os olhos da sua mãe são marcantes. Imagine com esse lápis delineador.';
			generic_descs[9] = 'O olhar da sua mãe diz muito e ficará lindo com esse rímel.';
			generic_descs[10] = 'Aproveite, este delineador vai destacar o formato dos olhos da sua mãe.';
			generic_descs[11] = 'Sua mãe vai ficar muito charmosa com esse lenço.';
			generic_descs[12] = 'Esta touca combina com o formato de rosto da sua mãe. Aposte.';
			generic_descs[13] = 'Estes brincos são perfeitos para o rosto da sua mãe.';
			generic_descs[14] = 'Este colar combina com o formato de rosto da sua mãe.';
			generic_descs[15] = 'Certamente sua mãe usa um desses para deixar a pele tão linda.';
			generic_descs[16] = 'Este creme é especial para a pele da sua mãe ficar mais linda.';
			generic_descs[17] = 'Com este esfoliante sua mãe vai deixar a pele ainda mais macia.';
			generic_descs[18] = 'Óculos completam o visual da sua mãe. Aposte em um destes para ela.';
            generic_descs[19] = 'Sua mãe está muito branquinha. Aposte no pó bronzeador.';
            generic_descs[20] = 'Este pó é perfeito para o tom de pele da sua mãe. Ela vai adorar.';
            generic_descs[21] = 'Este pó é perfeito para o tom de pele da sua mãe. Ela vai adorar.';
            generic_descs[22] = 'Este pó é perfeito para o tom de pele da sua mãe. Ela vai adorar.';
            generic_descs[23] = 'Este pó é perfeito para o tom de pele da sua mãe. Ela vai adorar.';
            generic_descs[24] = 'Esta base é perfeita para a pele da sua mãe e deixa um visual muito mais natural.';
            generic_descs[25] = 'Esta base é perfeita para a pele da sua mãe e deixa um visual muito mais natural.';
            generic_descs[26] = 'Esta base é perfeita para a pele da sua mãe e deixa um visual muito mais natural.';
            generic_descs[27] = 'Esta base é perfeita para a pele da sua mãe e deixa um visual muito mais natural.';
            generic_descs[28] = 'Esta base é perfeita para a pele da sua mãe e deixa um visual muito mais natural.';
            generic_descs[29] = 'O blush certo vai realçar a beleza e a pele da sua mãe. Este é perfeito.';
            generic_descs[30] = 'O blush certo vai realçar a beleza e a pele da sua mãe. Este é perfeito.';
            generic_descs[31] = 'O blush certo vai realçar a beleza e a pele da sua mãe. Este é perfeito.';
            generic_descs[32] = 'O blush certo vai realçar a beleza e a pele da sua mãe. Este é perfeito.';
            generic_descs[33] = 'A cor da sombra precisa casar com o tom da pele. Esta aqui é perfeita para o rosto da sua mãe.';
            generic_descs[34] = 'A cor da sombra precisa casar com o tom da pele. Esta aqui é perfeita para o rosto da sua mãe.';
            generic_descs[35] = 'A cor da sombra precisa casar com o tom da pele. Esta aqui é perfeita para o rosto da sua mãe.';
            generic_descs[36] = 'A cor da sombra precisa casar com o tom da pele. Esta aqui é perfeita para o rosto da sua mãe.';
            generic_descs[37] = 'Este batom tem a cor perfeita para os lábios da sua mãe.';
            generic_descs[38] = 'O tom de pele da sua mãe pede um batom como este.';
            generic_descs[39] = 'O tom de pele da sua mãe pede um batom como este.';
            generic_descs[40] = 'Os olhos da sua mãe são marcantes. Imagine com esse lápis.';
            generic_descs[41] = 'O olhar da sua mãe diz muito e ficará lindo com este rímel.';
            generic_descs[42] = 'O olhar da sua mãe diz muito e ficará lindo com este rímel.';
            generic_descs[43] = 'Aproveite, este delineador vai destacar o formato dos olhos da sua mãe.';
            generic_descs[44] = 'Sua mãe vai ficar muito charmosa com este cachecol.';
            generic_descs[45] = 'Sua mãe vai ficar muito charmosa com este cachecol.';
            generic_descs[46] = 'Sua mãe vai ficar muito charmosa com este cachecol.';
            generic_descs[47] = 'Estes brincos são perfeitos para o rosto da sua mãe.';
            generic_descs[48] = 'Estes brincos são perfeitos para o rosto da sua mãe.';
            generic_descs[49] = 'Estes brincos são perfeitos para o rosto da sua mãe.';
            generic_descs[50] = 'Estes brincos são perfeitos para o rosto da sua mãe.';
            generic_descs[51] = 'Estes brincos são perfeitos para o rosto da sua mãe.';
            generic_descs[52] = 'Este colar combina com o formato de rosto da sua mãe.';
            generic_descs[53] = 'Este colar combina com o formato de rosto da sua mãe.';
            generic_descs[54] = 'Este colar combina com o formato de rosto da sua mãe.';
            generic_descs[55] = 'Este colar combina com o formato de rosto da sua mãe.';
            generic_descs[56] = 'Certamente sua mãe usa um destes para deixar a pele tão linda.';
            generic_descs[57] = 'Este creme é especial para a pele da sua mãe ficar mais linda.';
            generic_descs[58] = 'Com este esfoliante, sua mãe vai deixar a pele ainda mais macia.';
            generic_descs[59] = 'Sua mãe ficaria muito bem de óculos. Que tal esse aqui ao lado?';
            generic_descs[60] = 'Óculos completam o visual da sua mãe. Aposte em um destes para ela.';
            generic_descs[61] = 'Os olhos da sua mãe pedem óculos como estes.';

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
		//wtf.close();
		//events.close();
		//techathlon.close();
		//eceevents.close();
		//funevents.close();
		//entertainment.close();
		//flagship.close();
		//unleash.close();
		rules.close();
		aboutesya.close();
		aboutiiitd.close();
		schedule.close();
		contactus.close();
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
			'swf' : 'upload/uploadify.swf',
			'uploader' : 'upload/uploadify.php',
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
/*
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
}*/
//======================
/*
var events = {
	open : function () {
		$('#events').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#events').removeClass('open');
		$('.button').show();
		return false;	
	}
}
var techathlon = {
	open : function () {
		$('#techathlon').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#techathlon').removeClass('open');
		$('.button').show();
		return false;	
	}
}
var eceevents = {
	open : function () {
		$('#eceevents').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#eceevents').removeClass('open');
		$('.button').show();
		return false;	
	}
}
var funevents = {
	open : function () {
		$('#funevents').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#funevents').removeClass('open');
		$('.button').show();
		return false;	
	}
}
var entertainment = {
	open : function () {
		$('#entertainment').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#entertainment').removeClass('open');
		$('.button').show();
		return false;	
	}
}
var flagship = {
	open : function () {
		$('#flagship').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#flagship').removeClass('open');
		$('.button').show();
		return false;	
	}
}
var unleash = {
	open : function () {
		$('#unleash').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#unleash').removeClass('open');
		$('.button').show();
		return false;	
	}
}*/
//==================
var rules = {
	open : function () {
		$('#rules').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#rules').removeClass('open');
		$('.button').show();
		return false;	
	}
}

//=========

var aboutesya = {
	open : function () {
		$('#aboutesya').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#aboutesya').removeClass('open');
		$('.button').show();
		return false;	
	}
}

var aboutiiitd = {
	open : function () {
		$('#aboutiiitd').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#aboutiiitd').removeClass('open');
		$('.button').show();
		return false;	
	}
}

var schedule = {
	open : function () {
		$('#schedule').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#schedule').removeClass('open');
		$('.button').show();
		return false;	
	}
}

var reachus = {
	open : function () {
		$('#reachus').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#reachus').removeClass('open');
		$('.button').show();
		return false;	
	}
}

var contactus = {
	open : function () {
		$('#contactus').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#contactus').removeClass('open');
		$('.button').show();
		return false;	
	}
}


var login = {
	open : function () {
		$('#login').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#login').removeClass('open');
		$('.button').show();
		return false;	
	}
}

var register = {
	open : function () {
		$('#register').addClass('open');
		$('.button').hide();
		return false;
	},
	close : function () {
		$('#register').removeClass('open');
		$('.button').show();
		return false;	
	}
}

//========
$(window).load(function () {
	/*$('#wtf ul li a').on('click', function () {
		$('.wtf-content p').hide().eq($(this).parent().index()).show();
		return false;
	});*/
	//==========
	/*$('#events ul li a').on('click', function () {
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
	});*/
	
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

	$('.facebook').on('click', function () {
		elem = $(this);
		postToFeed(elem.data('title'), elem.data('desc'), document.location.href, elem.data('image'));

		return false;
	});

	$('.twitter').on('click', function () {
		window.open('https://twitter.com/intent/tweet?text=FaceMother.co - Descubra o presente que tem a cara da sua mãe.');
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
	/*changes */
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
	logo.start();
	face.start();
	upload.load();

	$('#teaser .button').on('click', video.remove);
	$('.button.navigate').on('click', section.navigate);

	//$('.participate').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.scan').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.button.share').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.button.again').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.close').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	//$('.watch-the-video').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	//$('.wtf').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	//$('.events').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	//$('.techathlon').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	//$('.eceevents').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	//$('.funevents').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	//$('.entertainment').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	//$('.flagship').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	//$('.unleash').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	
	$('.login1').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.register1').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.buscape-bt').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.right .up').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.right .down').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.left .up').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});
	$('.left .down').spriteOnHover({fps:40, orientation:"horizontal", rewind: 'unanimate', loop: false, autostart: false, repeat:true});

	$('.facebook-button').on('click', fb_login);

	/*$('.button.wtf').on('click', function () {
		wtf.open();
	});*/
	//=====
	/*$('.button.events').on('click', function () {
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
	});*/
	
	$('.button.login1').on('click', function () {
		login.open();
	});
	
	$('.button.register1').on('click', function () {
		register.open();
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
	/* changes */
	$('.blockev').on('mouseenter click', function (event) {
		if (!$('body').hasClass('silence')) {
			if (event.type == 'mouseenter')
				$.ionSound.play("scan1");
			else if (event.type == 'click') {
				$.ionSound.play("gui_2_2");
			}
		}
	});
	$('.close').on('click', video.close);
	//$('.watch-the-video').on('click', video.open);

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

	$('.button.scan').on('click', detect);
	$('.rules').on('click', rules.open);
	// =====
	$('.aboutesya').on('click', aboutesya.open);
	$('.aboutiiitd').on('click', aboutiiitd.open);
	$('.schedule').on('click', schedule.open);
	$('.reachus').on('click', reachus.open);
	$('.contactus').on('click', contactus.open);
	//====
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