var buttons = require('sdk/ui/button/action');
var data = require('sdk/self').data;
var Request = require('sdk/request').Request;

var {Cc, Ci, Cu} = require("chrome");

var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include: /.*twitch\.tv\/.+/,
	contentScriptWhen: 'ready',
	contentScriptFile: [data.url('jquery-1.4.2.min.js'),
						data.url('replace-player.js')],
	attachTo: ['frame', 'existing', 'top'],
	onAttach: function (worker) {
		worker.port.emit('find-player');

		worker.port.on('get-stream-url', function (twitchUrl) {
			findStreamUrl(twitchUrl, function (streamUrl) {
				worker.port.emit('replace-player', streamUrl);
			});
		});

		worker.port.on('update-volume', function (newVolume) {
			console.log(newVolume);
		});
	}
});

// findStreamUrl('http://www.twitch.tv/leveluplive', function (streamUrl) { 
// 	console.log('stream-url: ' + streamUrl);
// });

function parseChannel(twitchUrl)
{
	return twitchUrl.substr(twitchUrl.lastIndexOf('/')+1);
}

function findStreamUrl(twitchUrl, callback) {

	var channel = parseChannel(twitchUrl);

	apiRequest(channel, function (apiResponse) {

		var token = apiResponse.json.token;
		var sig = apiResponse.json.sig;

		// console.log('token: ' + token);

		usherRequest(channel, sig, token, function (usherResponse) {

			let tokens = usherResponse.text.split('\n');

			for (let i = 0; i < tokens.length; i++) {
				if (tokens[i].match('https?://.*')) {
					callback(tokens[i]);
					break;
				}
			}

		});

	});

}

function apiRequest(channel, callback) {
	Request({
		url: 'http://api.twitch.tv/api/channels/' + channel + '/access_token',
		onComplete: callback
	}).get();
}

function usherRequest(channel, sig, token, callback) {
	Request({
		url: 'http://usher.twitch.tv/select/' + channel + '.json?nauthsig=' + sig + '&nauth=' + token + '&allow_source=true',
		onComplete: callback
	}).get();
}
