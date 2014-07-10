var VIDEO_ID = "30qXgZKKwQU", player, i, position = 0;
paused = true;

function onYouTubePlayerAPIReady () {
	player = new YT.Player("yt", {
		width: "100%", height: "100%",
		videoId: VIDEO_ID,
		events: {
			"onStateChange": onPlayerStateChange
		}
	});
};

function playVideo (event) {
	player.playVideo();
	paused = false;
	/* -- PLAY */

	player.d = player.getDuration();
	i = setInterval(checkPlayer, 1000);
};

function onplayerReset () {
	clearInterval(i);
};

function checkPlayer () {
	var p = player.getCurrentTime();
	var d = player.d;
	var c = p/d*100;
	c = Math.round(c);

	if(player.isReset) { c = 0; }
	player.c = c;

	if(!player.completed && !paused) {
		console.log(paused);
		if ($('.toggle-sound').hasClass('active') == false) {
			$('.toggle-sound').click();
		}
		if (c >= 25 && position == 0 && c < 50) {
			/* -- 25% */
			position = 1;
		} else if (c >= 50 && position == 1) {
			/* -- 50% */
			position = 2;
		}
	}
}

function onPlayerStateChange (event) {
	if(event.data === 0) {
		/* -- 100% */
	}
}