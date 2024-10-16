import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

initializeApp(firebaseConfig)

// const app = initializeApp(firebaseConfig);

// export default app;

//https://www.youtube.com/watch?v=awd_oYcmrRA&t=246s