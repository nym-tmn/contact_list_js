import { foundContactsContainer } from '@src/app/domElements';
import { ensureNonFalsy } from '@src/app/helpers/helpers';
import { IContact } from '@src/types/types';
import { getCurrentListItem } from '@src/utils/dom';

export function getIdentifier(data: IContact) {
	const identifier = ensureNonFalsy(
		data.lastName[0],
		`Cannot find contact with ID=${data.lastName[0] && data.lastName[0].toLowerCase()}`
	);
	return identifier.toLowerCase();
}

export function getFormContact(form: HTMLFormElement): IContact {
	const data = new FormData(form);

	const formData = Object.fromEntries(data.entries());

	return {
		firstName: String(formData.firstName).trim(),
		lastName: String(formData.lastName).trim(),
		phone: String(formData.phone).trim(),
	}
}

export function getContactParams<T extends Element>(element: T) {
	const targetContact = element;

	const jsonAttribute = targetContact.getAttribute('data-json-id');
	const contactJsonData = ensureNonFalsy(jsonAttribute, `Cannot find contact with attribute=${jsonAttribute}`)
	const currentContactData: IContact = JSON.parse(contactJsonData);
	const identifier = getIdentifier(currentContactData);
	const currentListItem = getCurrentListItem(identifier);

	return {
		jsonAttribute: contactJsonData,
		identifier,
		currentListItem,
		currentContactData,
	}
}

export function getFoundContacts() {
	return foundContactsContainer.querySelectorAll<HTMLDivElement>('.js-contacts__item');
}