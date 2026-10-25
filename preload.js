
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('notesAPI', {
    appName: 'Sticky Notes'
})
