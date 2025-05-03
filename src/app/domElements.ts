import { IEditModalForm } from '@src/types/types';
import { ensureNonFalsy } from './helpers/helpers';

export const mainForm = ensureNonFalsy(
	document.querySelector<HTMLFormElement>('.js-actions__form'),
	'Cannot find form with class js-actions__form'
);

export const contactLists = document.querySelectorAll<HTMLDivElement>('.js-contact-list');

export const clearContactsButton = ensureNonFalsy(
	document.querySelector<HTMLButtonElement>('.js-actions__clear-list'),
	'Cannot find button with class js-actions__clear-list'
);

export const searchButton = ensureNonFalsy(
	document.querySelector<HTMLButtonElement>('.js-actions__search'),
	'Cannot find button with class js-actions__search'
);

export const searchModal = ensureNonFalsy(
	document.querySelector<HTMLDivElement>('.js-search-modal-overlay'),
	'Cannot find search modal window with class js-search-modal-overlay'
);

export const foundContactsContainer = ensureNonFalsy(
	searchModal.querySelector<HTMLDivElement>('.js-search-modal__contacts'),
	'Cannot find element found contacts with class js-search-modal__contacts'
);

export const searchInput = ensureNonFalsy(
	searchModal.querySelector<HTMLInputElement>('.js-search-modal__input'),
	'Cannot find serach field with class js-search-modal__input'
);

export const showAllButton = ensureNonFalsy(
	searchModal.querySelector<HTMLButtonElement>('.js-show-all'),
	'Cannot find button with class js-show-all'
);

export const closeSearchModalIcon = ensureNonFalsy(
	searchModal.querySelector<HTMLButtonElement>('.js-search-modal__close'),
	'Cannot find icon close with class js-search-modal__close'
);

export const editModal = ensureNonFalsy(
	searchModal.querySelector<HTMLDivElement>('.js-edit-modal-overlay'),
	'Cannot find modal window with class js-edit-modal-overlay'
);

export const closeEditModalIcon = ensureNonFalsy(
	editModal.querySelector<HTMLButtonElement>('.js-edit-modal__close'),
	'Cannot find modal window icon close with class js-edit-modal__close'
);

export const editModalForm = ensureNonFalsy(
	editModal.querySelector<IEditModalForm>('.js-edit-modal__form'),
	'Cannot find modal window form with class js-edit-modal__form'
);