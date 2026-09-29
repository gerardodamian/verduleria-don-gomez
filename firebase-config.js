/* ====== Configuración de Firebase ======
   Ya está completado con los datos del proyecto "verduleria-don-gomez".
   Las fotos de los productos no se suben desde acá: el dueño escribe el
   nombre del archivo en el panel (ej. tomate.jpg) y vos lo agregás después
   a la carpeta /img del proyecto y lo subís a GitHub. Por eso solo hace
   falta Firestore Database, activado con reglas abiertas. */
const firebaseConfig = {
  apiKey: "AIzaSyDk5YJnw7LUaVkmuz0KXes1_MuPJR_OQ40",
  authDomain: "verduleria-don-gomez.firebaseapp.com",
  projectId: "verduleria-don-gomez",
  storageBucket: "verduleria-don-gomez.firebasestorage.app",
  messagingSenderId: "413392559065",
  appId: "1:413392559065:web:96e24a18567da8db3017c8"
};
const FIREBASE_READY = firebaseConfig.apiKey !== "TU_API_KEY";
let db = null;
if (FIREBASE_READY && window.firebase) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}
