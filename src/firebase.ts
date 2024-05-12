import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDxd_Ue76OJi5rSPtx1el1dB7zRMAZqCAk',
  authDomain: 'switter-react.firebaseapp.com',
  projectId: 'switter-react',
  storageBucket: 'switter-react.appspot.com',
  messagingSenderId: '97334048712',
  appId: '1:97334048712:web:ed07caabb21057230f32fd',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// using firebase auth
export const auth = getAuth(app);
