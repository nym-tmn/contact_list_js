import { countersCollection } from '@src/stores/collections';
import { IInitEditModalParams, IInitSearchModal } from '@src/types/types';
import { getContactParams } from '@src/utils/contacts';
import { ensureNonFalsy } from '@src/app/helpers/helpers';
import { setupSearchModalHandlers } from '@src/app/handlers/searchModalHandlers';
import { setupEditModalHandlers } from '@src/app/handlers/editModalHandlers';

export function initializeListItems() {
	const contactListItems = document.querySelectorAll<HTMLDivElement>('.js-contact-list__item');
	contactListItems.forEach(elem => setupListItem(elem));
}

function setupListItem(listItem: HTMLDivElement) {
	const itemKey = ensureNonFalsy(
		listItem.dataset.item,
		`Cannot find attribute=${listItem.dataset.item}`
	);

	countersCollection.set(itemKey, 0);

	const countElement = createCounterElement(itemKey);
	listItem.append(countElement);

	const contactsContainer = createContactsContainer();
	listItem.after(contactsContainer);
}

function createCounterElement(itemKey: string): HTMLDivElement {
	const countElement = document.createElement('div');
	countElement.classList.add('contact-list__counter');
	countElement.textContent = `${countersCollection.get(itemKey)}`;
	return countElement;
}

function createContactsContainer() {
	const contactsContainer = document.createElement('div');
	contactsContainer.classList.add('contacts', 'hidden');
	return contactsContainer;
}

export function initSearchModal({
	searchButton,
	searchModal,
	searchInput,
	showAllButton,
	foundContactsContainer,
	closeSearchModalIcon,
}: IInitSearchModal) {
	setupSearchModalHandlers({
		searchButton,
		searchModal,
		searchInput,
		showAllButton,
		foundContactsContainer,
		closeSearchModalIcon
	});
}

export function initEditModal({
	editIcon,
	editModal,
	closeEditModalIcon,
	editModalForm,
	searchInput,
}: IInitEditModalParams) {

	const errorMsg = editIcon.parentElement
		? `Cannot find contact with ID data-json-id=${editIcon.parentElement.dataset.jsonId}`
		: 'Cannot find parent element';
	const {
		jsonAttribute,
		identifier,
		currentListItem,
		currentContactData
	} = getContactParams(ensureNonFalsy(editIcon.parentElement, errorMsg));

	setupEditModalHandlers({
		editModal,
		closeEditModalIcon,
		editModalForm,
		jsonAttribute,
		identifier,
		currentListItem,
		currentContactData,
		searchInput,
	});
}