


// function playerHtml(streamUrl) {
// 	return  '<embed ' +
// 			'	type="application/x-vlc-plugin" ' +
// 			'	pluginspage="http://www.videolan.org" ' +
// 			'	version="VideoLAN.VLCPlugin.2" ' +
// 			'	width="100%" ' +
// 			'	height="100%" ' +
// 			'	volume="100" ' +
// 			'	target="' + streamUrl + '" ' +
// 			'	id="vlc">' +
// 			'</embed>';
// }

function playerHtml(streamUrl) {
	var vlcPlayer = self.options.vlcPlayer;

	return vlcPlayer.replace(/{{streamUrl}}/gi, streamUrl);
}

self.port.on('find-player', function () {
	// console.log('find-player: ' + $('#player').length);

	// console.log('checking ... \n' + document.URL + '\n' + 'players: ' + $('#player').length);

	if ($('#player').length > 0) {
		self.port.emit('get-stream-url', document.URL);
	}
});

self.port.on('replace-player', function (streamUrl) {

	$("#player").html(playerHtml(streamUrl));

	// needsUpdate = false;
});

// keep track if we've already attached the observer
self.observed = false;

self.port.on('observe', function () {
	if (!self.observed) {
		// setInterval(function () {
		// 	let vlc = document.getElementById("vlc");
		// 	if (vlc)
		// 		self.port.emit('update-volume', vlc);
		// }, 2000)

		// select the target node
		var target = document.querySelector('body');

		// create an observer instance
		var observer = new MutationObserver(function(mutations) {
			let player = document.querySelector("#player");

			if (player && player.innerHTML.indexOf("flash-player") > -1) {
				// set the innerHTML to nothing temporarily, so that we don't trigger a ton of updates
				player.innerHTML = "";
				self.port.emit('get-stream-url', document.URL);
			}
		});

		// configuration of the observer:
		var config = { attributes: true, childList: true, characterData: true };

		// pass in the target node, as well as the observer options
		observer.observe(target, config);

		self.observed = true;
	}
});


// self.port.on('replace-player', function (streamUrl) {
// 	// console.log('replace-player: ' + streamUrl);

// 	justUpdated = true;
// 	$("#player").html(playerHtml(streamUrl));

// 	// needsUpdate = false;

// 	if (!observed) {
// 		// select the target node
// 		var target = document.querySelector('body');

// 		// create an observer instance
// 		var observer = new MutationObserver(function(mutations) {
// 			mutations.forEach(function (mutation) {

// 				console.log(document.querySelector("#player").innerHTML);

// 			});

// 			if (!justUpdated)
// 				self.port.emit('get-stream-url', document.URL);
// 			justUpdated = false;
// 		});

// 		// configuration of the observer:
// 		var config = { attributes: true, childList: true, characterData: true };

// 		// pass in the target node, as well as the observer options
// 		observer.observe(target, config);

// 		observed = true;
// 	}

// });
