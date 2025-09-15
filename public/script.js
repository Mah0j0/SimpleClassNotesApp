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
            <button class="sound-btn" onclick="speakNote('${note.content}', '${note.id}')" title="Escuchar nota">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#191b23">
                    <path d="M213.23-265.23q-36.61-44.62-56.92-98.92Q136-418.46 136-480q0-133.31 88.46-230.65Q312.92-808 443-822v32q-116.23 14.77-195.62 102.77Q168-599.23 168-480q0 55 17.5 104t49.5 89l-21.77 21.77ZM480-136q-61.54 0-116.23-20.42-54.69-20.43-100.31-57.04L286.77-236q40 32 89.11 50Q425-168 480-168q55 0 104.12-18.38 49.11-18.39 89.88-50.39l23.31 22.54Q651.69-177.62 597-156.81 542.31-136 480-136Zm267.54-130L725-288.54q31.23-40 49.12-88.61Q792-425.77 792-480q0-119.23-79-206.46T518.54-789.23v-32q129.31 14.77 217.38 111.35Q824-613.31 824-480q0 61.54-19.92 115.46-19.93 53.92-56.54 98.54ZM404-348.92v-262.16L611.08-480 404-348.92Z"/>
                </svg>
            </button>
            <audio id="player-${note.id}" controls></audio>
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
//------LÓGICA PARA TEXT TO SPEECH CON IBM WATSON
async function speakNote(content, noteId){
  try {
    console.log('speakNote()', noteId, content.slice(0,50));
    const response = await fetch("/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });

    console.log('/tts response', response.status, response.statusText);
    if (!response.ok) {
      const txt = await response.text();
      console.error('Error body from /tts:', txt);
      alert('Error al generar audio: ' + response.status + ' - ' + txt);
      return;
    }

    const audioBlob = await response.blob();
    console.log('audio blob size:', audioBlob.size);
    const audioUrl = URL.createObjectURL(audioBlob);
    const player = document.getElementById(`player-${noteId}`);
    player.src = audioUrl;
    await player.play().catch(e => console.warn('player.play() rejected', e));
  } catch (err) {
    console.error('fetch exception:', err);
    alert('Error de red: ' + err.message);
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

