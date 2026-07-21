// ===== Firebase konfigurace a inicializace =====
// Sdíleno mezi blog.html, clanek.html a admin.html.
const firebaseConfig = {
  apiKey: "AIzaSyDOxF3xnMMWEDcfXMlbrWZH8J--EhIez0Q",
  authDomain: "ilonka-blog.firebaseapp.com",
  projectId: "ilonka-blog",
  storageBucket: "ilonka-blog.firebasestorage.app",
  messagingSenderId: "597578566411",
  appId: "1:597578566411:web:e936b59384a2b5f7ea700e",
  measurementId: "G-GY4Q3E00W3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
