
const container = document.getElementById('notes-container')
const addButton = document.getElementById('add-note')
const searchInput = document.getElementById('search')
const emptyMessage = document.getElementById('empty-message')

let notes = []
let nextId = 1
let saveQueue = Promise.resolve()

function saveNotes() {
    const snapshot = JSON.stringify(notes)

    saveQueue = saveQueue
        .catch(() => {})
        .then(() => window.notesAPI.saveNotes(JSON.parse(snapshot)))
        .catch(error => {
            console.error('Could not save notes:', error)
        })

    return saveQueue
}

function renderNotes() {
    container.innerHTML = ''

    const searchText = searchInput.value.toLowerCase()

    const filteredNotes = notes.filter(note => {
        return note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText)
    })

    emptyMessage.classList.toggle('hidden', filteredNotes.length > 0)

    if (notes.length > 0 && filteredNotes.length === 0) {
        emptyMessage.textContent = 'No matching notes found.'
    } else {
        emptyMessage.textContent = 'No notes yet. Create your first note!'
    }

    filteredNotes.forEach(note => {
        const card = document.createElement('div')
        card.className = 'note'

        const title = document.createElement('input')
        title.value = note.title
        title.placeholder = 'Note title'

        const content = document.createElement('textarea')
        content.value = note.content
        content.placeholder = 'Write something...'

        const actions = document.createElement('div')
        actions.className = 'note-actions'

        const saveButton = document.createElement('button')
        saveButton.textContent = 'Save'

        saveButton.addEventListener('click', async () => {
            note.title = title.value
            note.content = content.value

            await saveNotes()
            renderNotes()
        })

        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'

        deleteButton.addEventListener('click', async () => {
            notes = notes.filter(item => item.id !== note.id)

            await saveNotes()
            renderNotes()
        })

        actions.append(saveButton, deleteButton)
        card.append(title, content, actions)
        container.appendChild(card)
    })
}

addButton.addEventListener('click', async () => {
    notes.unshift({
        id: Date.now(),
        title: '',
        content: ''
    })

    await saveNotes()
    renderNotes()

    const firstTitle = container.querySelector('.note input')
    if (firstTitle) firstTitle.focus()
})

searchInput.addEventListener('input', renderNotes)

async function startApp() {
    try {
        notes = await window.notesAPI.loadNotes()
        nextId = Date.now()
        renderNotes()
    } catch (error) {
        console.error('Could not load notes:', error)
        emptyMessage.textContent = 'Could not load notes. Check the console.'
    }
}

startApp()
