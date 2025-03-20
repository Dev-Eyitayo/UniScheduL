// electron/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,  // Typically off for security reasons
      contextIsolation: true   // Usually recommended
    }
  });

  // For DEV: Load your local React dev server
  mainWindow.loadURL('http://localhost:5173/admin'); 
  // For PROD: Load your production build of React
  // mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
