const { app, BrowserWindow } = require('electron');
const path = require('path');

// const webResourcesPath = path.resolve(`${__dirname}/../../web-unify-react/app/build/index.html`);
const webUrl = `http://localhost:5000`;

app.on("ready", () => {
	let win = new BrowserWindow({ width: 800, height: 600 });
	win.on('closed', () => {
		win = null
	});

	// Load a remote or local URL
	win.loadURL(webUrl);
});
