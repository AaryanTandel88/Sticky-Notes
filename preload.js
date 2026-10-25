
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('notesAPI', {
    loadNotes: () => ipcRenderer.invoke('notes:load'),
    saveNotes: (notes) => ipcRenderer.invoke('notes:save', notes)
})
