import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDxtMi3rQ9VreVRk-zGiQu2ohpYhSqVX7c',
  authDomain: 'swimming-club-cms.firebaseapp.com',
  projectId: 'swimming-club-cms',
  storageBucket: 'swimming-club-cms.appspot.com',
  messagingSenderId: '318820243909',
  appId: '1:318820243909:web:2bc11c603245d23703d3ac',
  measurementId: 'G-YE0W29K36R',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
