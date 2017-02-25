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

const observer = firebase.auth().onAuthStateChanged(() => {
	observer();
	const div = window.document.createElement('div');
	window.document.body.appendChild(div);
	ReactDOM.render(<Routes/>, div);
})

