import firebase from 'firebase/app';
import 'firebase/database';
import config from '../../config.json';

// eslint-disable-next-line import/prefer-default-export
export const db = firebase
  .initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId,
  })
  .database();
