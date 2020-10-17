window.onload = function (){
    document.addEventListener("DOMContentLoaded", event => {
        const app = firebase.app();
        const db = firebase.database();
        const myPost = db.collection('posts').doc('firstpost');

        myPost.get().
        then(doc => {
            const data = doc.data();
            console.log(data.title)
        })
    });
}