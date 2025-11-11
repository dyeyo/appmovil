// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAQNEt0_wt_M8xVK6TrTtyX5TYKRYcQNn4',
    authDomain: 'inmobilaap.firebaseapp.com',
    projectId: 'inmobilaap',
    storageBucket: 'inmobilaap.firebasestorage.app',
    messagingSenderId: '1071596898931',
    appId: '1:1071596898931:web:c408e53ffef44c35e67806',
    measurementId: 'G-9FKWGB94N7',
  },
  url_base: 'https://www.inmobilapp.com/api/',
  // url_base: 'http://127.0.0.1:8000/api/',
  url_base_file: 'https://www.inmobilapp.com/',
  // url_base_file: 'http://127.0.0.1:8000/',
};
/*
CORRER PARA EL APK
ionic build  
npx cap sync android
npx cap open android
*/
