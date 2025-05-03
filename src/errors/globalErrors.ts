import { TimeoutType } from '@src/types/types';

let globalErrorTimeout: TimeoutType = null;

export function displayGlobalErrors(errorMsg: string) {
	const errorContainer = document.querySelector<HTMLDivElement>('.js-global__error');
	if (!errorContainer) return;

	if (globalErrorTimeout !== null) {
		clearTimeout(globalErrorTimeout);
	}

	errorContainer.textContent = errorMsg;
	errorContainer.classList.add('active');

	globalErrorTimeout = setTimeout(() => {
		errorContainer.classList.remove('active');
		globalErrorTimeout = null;
	}, 7000);
}