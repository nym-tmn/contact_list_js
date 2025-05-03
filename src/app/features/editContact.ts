import { IContact } from '@src/types/types';
import { contactsCollection } from '@src/stores/collections';
import { ensureNonFalsy } from '@src/app/helpers/helpers';
import { saveToStorage } from '@src/app/localStorage';

export function editContact(data: IContact, jsonAttribute: string) {
	contactsCollection.delete(jsonAttribute);

	const updatedContacts = document.querySelectorAll<HTMLDivElement>(`[data-json-id='${jsonAttribute}']`);

	updatedContacts.forEach(elem => {
		elem.dataset.jsonId = JSON.stringify(data);

		ensureNonFalsy(
			elem.querySelector<HTMLDivElement>('.js-item-contacts__first-name'),
			'Cannot find element with class js-item-contacts__first-name'
		).textContent = `First name: ${data.firstName}`;

		ensureNonFalsy(
			elem.querySelector<HTMLDivElement>('.js-item-contacts__last-name'),
			'Cannot find element with class js-item-contacts__last-name'
		).textContent = `Last name: ${data.lastName}`;

		ensureNonFalsy(
			elem.querySelector<HTMLDivElement>('.js-item-contacts__phone'),
			'Cannot find element with class js-item-contacts__phone'
		).textContent = `Phone: ${data.phone}`;
	})

	contactsCollection.add(JSON.stringify(data));
	saveToStorage();
}