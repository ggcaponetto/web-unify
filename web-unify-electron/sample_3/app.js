const { app, BrowserWindow } = require('electron');
let win;

app.on('window-all-closed', _ => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on("ready", () => {
    let win = new BrowserWindow({
        width: 1200,
        height: 900,
        show: true,
        webPreferences: {
            experimentalFeatures: true
        }
    });
    win.on('closed', () => win = null);
    // Load a remote or local URL
    // win.loadURL(webUrl);
    try {
        win.webContents.openDevTools();
        win.loadURL(`file://${__dirname}/win.html`);
    }catch (e) {
        console.error(e);
    }
});