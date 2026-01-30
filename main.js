
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Mooderia Metropolis",
    icon: path.join(__dirname, 'icon.ico'), // Make sure to have an icon file
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // In production, we point to the index.html
  win.loadFile('index.html');
  
  // Remove the default menu bar
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
