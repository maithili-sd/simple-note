let idCtr = 1; // counter for note id
let selectedNotes = []; // array that contains id of selected note
const noteColors = [
    '#bcffdb',
    '#cbff8c',
    '#FFE74C',
    '#70C1FF',
    '#EDA8F0',
    '#d3a3ff',
]; // colors for note background

const colors = {
    successColor: '#5DC080',
    warningColor: '#FCAB10',
    deleteColor: '#3AB9CF',
}; // colors for snackbar

/* hide create note form and edit note form at the start */
showCreateNoteForm(false);
showEditNoteForm(false);

/* function that returns randomly choosen color for note background */
function chooseColor() {
    return noteColors[Math.floor(Math.random() * noteColors.length)];
}

/* executed on clicking 'Add note' button */
function addNote() {
    const parent = document.getElementById('render-notes');

    // ensure 6x6 layout
    if (parent.childElementCount >= 36) {
        showSnackbar('Oops! Noteboard is full. Try deleting few notes.');
        return;
    }

    const noteId = idCtr++;
    const noteDescription = document.getElementById('note-description');

    const noteDiv = document.createElement('div');
    noteDiv.setAttribute('id', noteId);
    noteDiv.setAttribute('class', 'note-item');
    noteDiv.onclick = () => selected(noteId);

    const p = document.createElement('p');
    p.setAttribute('class', 'note-heading');
    p.innerHTML = noteDescription.value;

    const btnDiv = document.createElement('div');
    btnDiv.setAttribute('class', 'btns');

    // generate edit button for a newly added note
    const editButton = document.createElement('button');
    editButton.setAttribute('id', 'edit-button');
    editButton.setAttribute('aria-label', 'Edit button');
    const editIcon = document.createElement('i');
    editIcon.setAttribute('class', 'far fa-edit');
    editButton.appendChild(editIcon);
    editButton.onclick = () => editNoteId(noteId);

    // generate delete button for a newly added note
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('id', 'delete-button');
    deleteButton.setAttribute('aria-label', 'Delete button');
    const deleteIcon = document.createElement('i');
    deleteIcon.setAttribute('class', 'far fa-trash-alt');
    deleteButton.appendChild(deleteIcon);
    deleteButton.onclick = () => deleteNote(noteId);

    noteDiv.appendChild(p);
    btnDiv.appendChild(editButton);
    btnDiv.appendChild(deleteButton);
    noteDiv.appendChild(btnDiv);
    const noteColor = chooseColor();
    noteDiv.style.backgroundColor = noteColor;
    document.getElementById('render-notes').appendChild(noteDiv);

    if (parent.hasChildNodes()) {
        setDisplayNoneId('no-notes');
    }

    // hide create note form
    showCreateNoteForm(false);

    if (noteDescription.value.trim() === '') {
        showSnackbar('Warning: Emtpy note added!', colors.warningColor);
    } else {
        showSnackbar('New note added successfully!', colors.successColor);
    }

    // clear create note form before next use
    noteDescription.value = '';
}

/* executed on clicking 'Edit note' button */
function editNoteId(id) {
    // prevent bubbling of 'select' to parent div to ensure note is not selected on clicking edit button
    window.event.cancelBubble = true;

    showEditNoteForm(true);

    const noteId = document.getElementById('note-id');
    noteId.value = id;

    const idValue = document.getElementById('note-id').value;
    const p = document.getElementById(idValue).getElementsByTagName('p')[0];
    const editNoteDescription = document.getElementById(
        'edit-note-description'
    );

    editNoteDescription.value = p.innerHTML;
}

/* executed on clicking 'Done' button after editing a note */
function editNote() {
    const noteId = document.getElementById('note-id').value;
    const p = document.getElementById(noteId).getElementsByTagName('p')[0];
    const editNoteDescription = document.getElementById(
        'edit-note-description'
    );

    p.innerHTML = editNoteDescription.value;

    // clear and hide edit note form
    editNoteDescription.value = '';
    showEditNoteForm(false);

    showSnackbar('Note edited successfully!', colors.successColor);
}

/* executed on clicking 'Delete note' button */
function deleteNote(id) {
    // prevent bubbling of 'select' to parent div to ensure note is not selected on clicking delete button
    window.event.cancelBubble = true;

    const div = document.getElementById(id);
    div.remove();

    const parent = document.getElementById('render-notes');

    if (!parent.hasChildNodes()) {
        setDisplayBlockId('no-notes');
    }

    showSnackbar('Note deleted successfully!', colors.deleteColor);
}

/* executed on selecting a note */
function selected(id) {
    const selectedDiv = document.getElementById(id);

    /* if id of selected note already exists in array, remove (deselect) it
    otherwise check length 
        - if length is 2 then swap the note content and empty array
        - if length < 2 keep adding id to array
    */
    if (selectedNotes.includes(id)) {
        selectedDiv.classList.remove('selected');
        const index = selectedNotes.indexOf(id);
        selectedNotes.splice(index, 1);
    } else {
        selectedNotes.push(id);
        if (selectedNotes.length < 2) {
            selectedDiv.classList.add('selected');
        } else if (selectedNotes.length == 2) {
            selectedDiv.classList.add('selected');

            const p1 = document
                .getElementById(selectedNotes[0])
                .getElementsByTagName('p')[0];
            const p2 = document
                .getElementById(selectedNotes[1])
                .getElementsByTagName('p')[0];
            let temp = '';

            temp = p1.innerHTML;
            p1.innerHTML = p2.innerHTML;
            p2.innerHTML = temp;

            document
                .getElementById(selectedNotes[0])
                .classList.remove('selected');
            document
                .getElementById(selectedNotes[1])
                .classList.remove('selected');

            selectedNotes = [];

            showEditNoteForm(false);
        }
    }
}

/* set display of element with certain id to block */
function setDisplayBlockId(id) {
    document.getElementById(id).style.display = 'block';
}

/* set display of element with certain id to flex */
function setDisplayFlexId(id) {
    document.getElementById(id).style.display = 'flex';
}

/* set display of element with certain id to none */
function setDisplayNoneId(id) {
    document.getElementById(id).style.display = 'none';
}

/* function that shows edit note form */
function showEditNoteForm(click) {
    if (click) {
        setDisplayFlexId('edit-note');
        setDisplayBlockId('cancel-edit-note');
        const inputElement = document.getElementById('edit-note-description');
        inputElement.focus();
    } else {
        setDisplayNoneId('edit-note');
        setDisplayNoneId('cancel-edit-note');
    }
}

/* function that shows create note form */
function showCreateNoteForm(click) {
    if (click) {
        setDisplayFlexId('new-note');
        setDisplayBlockId('cancel-create-note');
        const inputElement = document.getElementById('note-description');
        inputElement.focus();
    } else {
        setDisplayNoneId('new-note');
        setDisplayNoneId('cancel-create-note');
    }
}

/* function to display snackbar */
function showSnackbar(message, color) {
    const snackElement = document.createElement('div');

    snackElement.setAttribute('class', 'snackbar');
    snackElement.setAttribute('class', 'snackbar show');
    snackElement.innerHTML = message;
    snackElement.style.backgroundColor = color;

    const snackContainer = document.getElementById('snackbar-container');
    snackContainer.append(snackElement);

    setTimeout(function () {
        snackElement.className = snackElement.className.replace(
            'snackbar show',
            'snackbar'
        );
    }, 2300);
}
