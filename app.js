const cafeList = document.querySelector('#post-list');
const form = document.querySelector('#add-post-form');

// create element & render cafe
function renderCafe(doc){
    let li = document.createElement('div');
    let username = document.createElement('span');
    let trashSize = document.createElement('span');
    let image = document.createElement('img');
      //  let city = document.createElement('span');
    //      let city = document.createElement('span');
      //      let city = document.createElement('span');
//var sp = '&nbsp &nbsp &nbsp &nbsp &nbsp';
    let cross = document.createElement('button');

      li.setAttribute('data-id', doc.id);
    username.textContent = doc.data().username;
    trashSize.textContent = doc.data().trashSize;
    image.src=doc.data().postUrl;
    cross.textContent = 'x';

    li.appendChild(username);
  //  li.appendChild("&nbsp");
    li.appendChild(trashSize);
    //  li.appendChild("&nbsp");
    li.appendChild(image);
    //  li.appendChild("&nbsp");
    li.appendChild(cross);

    cafeList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Post').doc(id).delete();
    });
}



// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('Post').add({
        username: form.username.value,
        trashSize: form.trashSize.value
    });
    form.username.value = '';
    form.trashSize.value = '';
});

// real-time listener
db.collection('Post').orderBy('username').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    });
});
