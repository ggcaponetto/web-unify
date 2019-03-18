const { desktopCapturer } = require('electron');

const fileName = "desktopCapture";

// desktop capture
function handleStream (stream) {
	try {
		const video = document.querySelector('video');
		video.srcObject = stream;
		video.onloadedmetadata = (e) => video.play()
	}catch (e) {
		console.error(e);
	}
}

function handleError (e) {
	console.log(e)
}

const startCapture = () => {
	console.log(`${fileName}`);
	console.log("startCapture... onclick..try", desktopCapturer);
	desktopCapturer.getSources({ types: ['window'] }, (error, sources) => {
		if (error){
			console.error(error);
		} else {
			console.log("startCapture", {error, sources});
			for (let i = 0; i < sources.length; ++i) {
				console.log("startCapture... source", {source: sources[i]});
				if (sources[i].name === 'Title') {
					navigator.mediaDevices.getUserMedia({
						audio: false,
						video: {
							mandatory: {
								chromeMediaSource: 'desktop',
								chromeMediaSourceId: sources[i].id,
								minWidth: 1280,
								maxWidth: 1280,
								minHeight: 720,
								maxHeight: 720
							}
						}
					})
						.then((stream) => {
							handleStream(stream);
						})
						.catch((e) => {
							handleError(e);
						});
				}
			}
		}
	});
};

try {
	startCapture();
}catch (e) {
	console.error(e);
}
