import { IContact } from '@src/types/types';
import { ensureNonFalsy } from '../helpers/helpers';

export function createContactCard(contact: IContact, jsonContact: string) {
	const contactCard = document.createElement('div');
	contactCard.classList.add('contacts__item', 'item-contacts', 'js-contacts__item');
	contactCard.setAttribute('data-json-id', jsonContact);
	contactCard.innerHTML = `
			<div class='item-contacts__info'>
				<div class='item-contacts__first-name js-item-contacts__first-name'>First name: ${contact.firstName}</div>
				<div class='item-contacts__last-name js-item-contacts__last-name'>Last name: ${contact.lastName}</div>
				<div class='item-contacts__phone js-item-contacts__phone'>Phone: ${contact.phone}</div>
			</div>
			<button class='item-contacts__btn btn-icon js-delete-contact' type='button'>
				<i class='fa-solid fa-square-xmark'></i>
			</button>
		`;
	return contactCard;
}

export function createContactClone(identifier: string, foundContactsContainer: HTMLDivElement) {
	const contactElement = ensureNonFalsy(
		document.querySelector<HTMLDivElement>(`[data-json-id='${identifier}']`),
		`Cannot find contact with ID data-json-id=${identifier}`
	);
	const contactClone = contactElement.cloneNode(true) as HTMLDivElement;
	contactClone.classList.add('item-contacts_with-extra-padding')
	foundContactsContainer.append(contactClone);
	return contactClone;
}