
const titleInput = document.getElementById('title')
const contentInput = document.getElementById('content')

let currentNote = null
let saveTimer

window.notesAPI.onFloatingNoteLoad(note => {
    currentNote = note
    titleInput.value = note.title
    contentInput.value = note.content
})

function updateNote() {
    if (!currentNote) return

    clearTimeout(saveTimer)

    saveTimer = setTimeout(async () => {
        const notes = await window.notesAPI.loadNotes()

        const updatedNotes = notes.map(note => {
            if (note.id === currentNote.id) {
                return {
                    ...note,
                    title: titleInput.value,
                    content: contentInput.value
                }
            }

            return note
        })

        await window.notesAPI.saveNotes(updatedNotes)
    }, 300)
}

titleInput.addEventListener('input', updateNote)
contentInput.addEventListener('input', updateNote)
