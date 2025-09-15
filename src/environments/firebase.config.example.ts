// firebase.config.example.ts
// Copia este archivo como firebase.config.ts y completa con tus credenciales de Firebase

export const firebaseConfig = {
  // 🔹 Obtén estos valores desde: https://console.firebase.google.com/
  // Ve a: Configuración del proyecto > General > Tus aplicaciones > Configuración del SDK
  
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com", 
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234efgh5678"
};

// 🔹 Pasos para configurar Firebase:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Agrega una aplicación web
// 4. Copia la configuración aquí
// 5. Habilita Authentication > Google en la consola de Firebase
// 6. Guarda este archivo como firebase.config.ts (NO como .example.ts)