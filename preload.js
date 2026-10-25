
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('notesAPI', {
    loadNotes: () => ipcRenderer.invoke('notes:load'),
    saveNotes: (notes) => ipcRenderer.invoke('notes:save', notes),
    floatNote: (note) => ipcRenderer.invoke('notes:float', note),

    onFloatingNoteLoad: (callback) => {
        ipcRenderer.on('floating-note:load', (event, note) => callback(note))
    },

    onShortcut: (callback) => {
        ipcRenderer.on('app:shortcut', (event, action) => callback(action))
    }
})
