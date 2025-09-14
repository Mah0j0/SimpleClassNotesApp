let notes=[]; //let significa que la variable puede cambiar su valor
let editingNoteId=null; //para saber si estamos editando una nota o creando una nueva

function loadNotes(){
    const savedNotes=localStorage.getItem("quickNotes");
    return savedNotes ? JSON.parse(savedNotes) : [];
}
function saveNote(event){
    event.preventDefault(); //para que no se recargue la pagina al enviar el formulario

    const title=document.getElementById("noteTitle").value.trim();
    const content=document.getElementById("noteContent").value.trim();

    if(editingNoteId){
        //Update existing note
        const noteIndex=notes.findIndex(note=>note.id===editingNoteId);
        notes[noteIndex]={
            ...notes[noteIndex], //para mantener los datos que no se estan editando
            title: title,
            content: content
        }
    }
    else{
        //Create new note
        notes.unshift({
        id: generateId(),
        title: title,
        content: content,
        createdAt: Date.now()
    })
    }

    CloseNoteDialog()
    saveNotes()
    renderNotes()
}
function generateId(){
    return Date.now().toString()
}

function saveNotes(){
    localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function deleteNote(noteId){
    notes=notes.filter(note=>note.id !== noteId); //para que el array notes contenga todas las notas menos la que se quiere eliminar
    saveNotes();
    renderNotes();
}

function renderNotes(){
    const notesContainer=document.getElementById("notesContainer");

    if(notes.length===0){
        notesContainer.innerHTML=`
        <div class="empty-state">
            <h2>No hay notas aún</h2> 
            <p>Haz clic en el botón '+' para agregar una nueva nota.</p>
            <button class="add-note-btn" onclick="openNoteDialog()">+ Agrega tu primera nota</button>
        </div>
        `;
        return;
    }
    notesContainer.innerHTML= notes.map(note=>`
        <div class="note-card">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
            <div class="note-actions">
                <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title= "Editar nota">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#191b23">
                    <path d="M184-184v-83.77l497.23-498.77q5.15-5.48 11.07-7.47 5.93-1.99 11.99-1.99 6.06 0 11.62 1.54 5.55 1.54 11.94 7.15l38.69 37.93q5.61 6.38 7.54 12 1.92 5.63 1.92 12.25 0 6.13-2.24 12.06-2.24 5.92-7.22 11.07L267.77-184H184Zm505.15-466.46L744-704.54 704.54-744l-54.08 54.85 38.69 38.69Z"/>
                </svg>
                </button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Eliminar nota">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#191b23">
                    <path d="m400-352.69 80-80 80 80L583.31-376l-80-80 80-80L560-559.31l-80 80-80-80L376.69-536l80 80-80 80L400-352.69ZM336.62-184Q312-184 296-200q-16-16-16-40.62V-696h-48v-32h152v-38.77h192V-728h152v32h-48v455.38Q680-216 664-200q-16 16-40.62 16H336.62Z"/>
                </svg>
                </button>
            </div>
        </div>
        `).join('');
}
function openNoteDialog(noteId=null){
    const dialog=document.getElementById("noteDialog");
    const titleInput=document.getElementById("noteTitle");
    const contentInput=document.getElementById("noteContent");

    if(noteId){
        //Edit mode
        const noteToEdit=notes.find(note=>note.id===noteId);
        editingNoteId=noteId;
        document.getElementById("dialogTitle").textContent="Editar nota";
        titleInput.value=noteToEdit.title;
        contentInput.value=noteToEdit.content;
        
    }else{
        //Create mode
        editingNoteId=null;
        document.getElementById("dialogTitle").textContent="Agregar nueva nota";
        titleInput.value="";
        contentInput.value="";
    }

    dialog.showModal();
    titleInput.focus();//para que el cursor este en el input del titulo
}

function CloseNoteDialog(){
    document.getElementById("noteDialog").close();
}
function toggleTheme(){
    const isdark=document.body.classList.toggle("dark-theme");  
    localStorage.setItem("theme", isdark ? "dark" : "light");
    document.getElementById("themeToggleBtn").textContent=isdark ? "☀️" : "🌙"; 
}
function applyStoredTheme(){
    if(localStorage.getItem("theme")==="dark"){
        document.body.classList.add("dark-theme");
        document.getElementById("themeToggleBtn").textContent="☀️";
    }
}
document.addEventListener("DOMContentLoaded", function(){
    applyStoredTheme();
    notes=loadNotes();
    renderNotes();
    
    document.getElementById('noteForm').addEventListener('submit', saveNote)
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

    document.getElementById('noteDialog').addEventListener('click', function(event){
        if(event.target === this){
            CloseNoteDialog();
        }
    });
});

