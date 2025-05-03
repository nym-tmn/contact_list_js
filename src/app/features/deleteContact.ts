import { contactsCollection } from '@src/stores/collections';
import { getContactParams } from '@src/utils/contacts';
import { updateCounter } from '@src/utils/counters';
import { toggleVisibility } from '@src/utils/dom';
import { ensureNonFalsy } from '../helpers/helpers';
import { saveToStorage } from '../localStorage';

export function deleteContact(deleteIcon: HTMLButtonElement) {
	const errorMsg = deleteIcon.parentElement
		? `Cannot find contact with ID data-json-id=${deleteIcon.parentElement.dataset.jsonId}`
		: 'Cannot find parent element';
	const { jsonAttribute, currentListItem, } = getContactParams(
		ensureNonFalsy(deleteIcon.parentElement, errorMsg)
	);

	document.querySelectorAll(`[data-json-id='${jsonAttribute}']`)
		.forEach(elem => elem.remove());

	contactsCollection.delete(jsonAttribute);
	updateCounter(currentListItem, false);
	const contactsContainer = ensureNonFalsy(
		currentListItem.nextElementSibling,
		`Cannot find container for contacts with ID data-item=${currentListItem.dataset.item}`
	);
	if (!currentListItem.hasAttribute('data-active')) {
		toggleVisibility(contactsContainer);
	}
	saveToStorage();
}