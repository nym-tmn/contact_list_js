import { contactsCollection, countersCollection } from '@src/stores/collections';
import { IParsedData, IContact } from '@src/types/types';
import { getIdentifier } from '@src/utils/contacts';
import { getCurrentListItem, updateActiveState } from '@src/utils/dom';
import { createContactCard } from '@src/app/features/createContact';
import { ensureNonFalsy } from '@src/app/helpers/helpers';

const STORAGE_KEY = 'phoneBookContacts';

export function loadFromStorage() {
	const storedData = ensureNonFalsy(
		localStorage.getItem(STORAGE_KEY),
		`No data in localStorage for key '${STORAGE_KEY}'`
	);

	const parsedData: IParsedData = JSON.parse(storedData);

	parsedData.contacts.forEach((contact: string) => {
		contactsCollection.add(contact);
	});

	Object.entries(parsedData.counters).forEach(([key, value]) => {
		countersCollection.set(key, value);
	});

	restoreUI(parsedData.contacts);
}

function restoreUI(contacts: string[]) {
	contacts.forEach((jsonContact) => {
		const contact: IContact = JSON.parse(jsonContact);
		const currentListItem = getCurrentListItem(getIdentifier(contact));

		const contactCard = createContactCard(contact, jsonContact);
		const contactsContainer = ensureNonFalsy(
			currentListItem.nextElementSibling,
			`Cannot find container for contacts with ID: ${getIdentifier(contact)}`
		)
		contactsContainer.prepend(contactCard);

		updateActiveState(currentListItem, true);

		const counterElement = ensureNonFalsy(
			currentListItem.querySelector<HTMLDivElement>('.contact-list__counter'),
			`Cannot find counter for contacts with ID data-item=${currentListItem.dataset.item}`
		);
		counterElement.textContent = `${countersCollection.get(getIdentifier(contact))}`;
	});
}

export function saveToStorage() {
	const dataToSave: IParsedData = {
		contacts: Array.from(contactsCollection),
		counters: Object.fromEntries(countersCollection)
	};

	localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}