import { displayGlobalErrors } from '@src/errors/globalErrors';
import { initializeApp } from '@src/app/app';
import '@assets/styles/scss/style.scss';

window.addEventListener('error', (event) => {
	event.preventDefault();
	console.error('Global error:', event.error);
	displayGlobalErrors(event.error.message);
});

initializeApp();