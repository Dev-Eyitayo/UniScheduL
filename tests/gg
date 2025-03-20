const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

// Dev server URL for your React app
const REACT_DEV_URL = 'http://localhost:5173'; 
// Or wherever your Vite dev server runs

// Path to index.html in your build folder
const REACT_PROD_PATH = path.join(
  __dirname,
  '..',
  'frontend',
  'dist',   // or 'build' if using Create React App
  'index.html'
);

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    // Load local dev server in dev mode
    win.loadURL(REACT_DEV_URL);
    win.webContents.openDevTools();
  } else {
    // Load the production build
    win.loadURL(`file://${REACT_PROD_PATH}`);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// On non-mac, quit on close
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
