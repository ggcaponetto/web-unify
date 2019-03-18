const { app, BrowserWindow } = require('electron');

// const webUrl = path.resolve(`${__dirname}/../../web-unify-react/app/build/index.html`);
// const webUrl = `http://localhost:5000`;
// const webUrl = `http://localhost:3000`;

// open app
app.on("ready", () => {
	let win = new BrowserWindow({ width: 800, height: 600, show: true });
	win.on('closed', () => {
		win = null
	});
	// Load a remote or local URL
	// win.loadURL(webUrl);
	try {
		win.webContents.openDevTools();
		win.loadURL('file://' + __dirname + '/index.html');
	}catch (e) {
		console.error(e);
	}
});
