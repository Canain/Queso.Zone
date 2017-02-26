import 'regenerator-runtime/runtime';
import '../sass/style.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import { User } from 'firebase';

import Routes from './routes';

firebase.initializeApp({
	apiKey: 'AIzaSyCef7RCvQdn1Coiyba016Vl7MDPnGohmfE',
	authDomain: 'quesozone.firebaseapp.com',
	databaseURL: 'https://quesozone.firebaseio.com',
	storageBucket: 'quesozone.appspot.com',
	messagingSenderId: '902069248859'
});

if (process.env.NODE_ENV !== 'production') {
	window['firebase'] = firebase;
}

const observer = firebase.auth().onAuthStateChanged(() => {
	observer();
	const div = window.document.getElementById('preload');
	div.id = null;
	div.className = null;
	ReactDOM.render(<Routes/>, div);
})

