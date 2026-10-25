
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs/promises')

const notesFile = path.join(app.getPath('userData'), 'notes.json')

async function loadNotes() {
    try {
        const data = await fs.readFile(notesFile, 'utf8')
        const notes = JSON.parse(data)

        return Array.isArray(notes) ? notes : []
    } catch (error) {
        if (error.code === 'ENOENT') {
            return []
        }

        throw error
    }
}

async function saveNotes(notes) {
    await fs.mkdir(path.dirname(notesFile), { recursive: true })

    const tempFile = notesFile + '.tmp'

    await fs.writeFile(tempFile, JSON.stringify(notes, null, 2), 'utf8')
    await fs.rename(tempFile, notesFile)

    return true
}

ipcMain.handle('notes:load', async () => {
    return loadNotes()
})

ipcMain.handle('notes:save', async (event, notes) => {
    if (!Array.isArray(notes)) {
        throw new Error('Invalid notes data')
    }

    return saveNotes(notes)
})

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 700,
        minHeight: 500,
        title: 'Sticky Notes',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
