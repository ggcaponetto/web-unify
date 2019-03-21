let localStream;
let recorder;
let recordChunk;
const { remote: { dialog} } = require('electron');
const { desktopCapturer } = require('electron');
const fs = require('fs');

/*navigator.mediaDevices.getUserMedia({
    video: true
}).then(stream => {
    localStream = stream;
    preview.srcObject = stream;
});*/

desktopCapturer.getSources({ types: ['window'] }, (error, sources) => {
    if (error) throw error;
    for (let i = 0; i < sources.length; ++i) {
        if (sources[i].name === 'web-unify') {
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
                    console.log("got desktop capture stream", stream);
                    localStream = stream;
                    preview.srcObject = stream;

                    try{
                        // record to file
                        let myChunks = [];
                        let mediaRecorder = new MediaRecorder(stream);

                        // remove the old file
                        try {
                            fs.unlinkSync("C:\\Users\\Giuseppe\\Downloads\\buffer.webm");
                        }catch (e) {
                            console.warn(e.message)
                        }
                        // create the new file
                        let outVideo = fs.createWriteStream("C:\\Users\\Giuseppe\\Downloads\\buffer.webm");

                        let fileReader = new FileReader();
                        let blob;
                        let frameChunks;

                        mediaRecorder.ondataavailable = e => {
                            console.log(`ondataavailable ${(new Date())}`, { data: e.data, myChunks});
                            // myChunks.push(e.data);
                            frameChunks = [e.data];
                            blob = new Blob(frameChunks);
                            fileReader.onload = (event) => {
                                // console.log("fileReader onload", {arrayBuffer, myChunks});
                                let myBuffer= new Buffer.from(event.target.result);
                                outVideo.write(myBuffer);
                                outVideo.on( 'error', err => console.error( "Oops:", err ) );
                                console.log("fileReader done", { data: e.data, frameChunks});
                            };
                            fileReader.readAsArrayBuffer(blob);
                        };
                        mediaRecorder.start();

                        setInterval(() => {
                            console.log("setInterval requestData");
                            mediaRecorder.requestData();
                        }, 500);

                    }catch (e) {
                        console.error(e);
                    }
                })
                .catch((e) => {
                    handleCapturerError(e)
                });
        }
    }
});

btnRecord.onclick = function() {
    if (this.textContent === 'Record Start') {
        recordChunk = [];
        recorder = new MediaRecorder(localStream);
        recorder.ondataavailable = e => {
            console.log("ondataavailable", e.data);
            recordChunk.push(e.data);
        };
        dlLink.style.display = 'none';
        btnSave.style.display = 'none';
        recorder.start();
        this.textContent = 'Record Stop';

    } else {
        recorder.stop();

        let blob = new Blob(recordChunk);
        let dlURL = URL.createObjectURL(blob);

        dlLink.href = dlURL;
        dlLink.download = `recording-link.webm`;
        dlLink.style.display = 'block';
        btnSave.style.display = 'block';
        this.textContent = 'Record Start';
    }
};

btnSave.onclick = () => {
    const blob = new Blob(recordChunk);
    let fr = new FileReader();
    fr.onload = () => {
        showSaveDialog(fr.result);
    };
    fr.readAsArrayBuffer(blob);
};

function showSaveDialog(arrayBuffer) {
    let buffer = new Buffer.from(arrayBuffer);
    let dt = new Date();
    dialog.showSaveDialog({
        defaultPath: __dirname + '/electron-tutorial.webm',
        filters: [{
            extensions: ['webm']
        }]
    }, fileName => {
        if (fileName) {
            fs.writeFile(fileName, buffer, function(err) {
                if (err) {
                    alert("An error ocurred creating the file " + err.message);
                }
            });
        }
    });
}