import { validateContact, displayErrors } from '@src/errors/formValidation';
import { contactsCollection, countersCollection } from '@src/stores/collections';
import { IContact, IMainHandlers } from '@src/types/types';
import { getFormContact, getIdentifier } from '@src/utils/contacts';
import { updateCounter } from '@src/utils/counters';
import { getCurrentListItem, toggleVisibility, updateActiveState } from '@src/utils/dom';
import { createContactCard } from '@src/app/features/createContact';
import { ensureNonFalsy } from '@src/app/helpers/helpers';
import { saveToStorage } from '@src/app/localStorage';
import { deleteContact } from '@src/app/features/deleteContact';
import { clearContacts } from '@src/app/features/clearContacts';

export function setupMainHandlers({
	mainForm,
	contactLists,
	clearContactsButton,
}: IMainHandlers) {

	function handleAddContactSubmit(event: SubmitEvent) {
		event.preventDefault();

		const formContact = getFormContact(mainForm);

		const contact: IContact = {
			firstName: formContact.firstName,
			lastName: formContact.lastName,
			phone: formContact.phone
		};

		const errors = validateContact(mainForm, contact);
		if (displayErrors(mainForm, errors)) return;

		const jsonContact = JSON.stringify(contact);
		const currentListItem = getCurrentListItem(getIdentifier(contact));
		const contactCard = createContactCard(contact, jsonContact);
		const contactsContainer = ensureNonFalsy(
			currentListItem.nextElementSibling,
			`Cannot find container for contacts with ID data-item=${currentListItem.dataset.item}`
		);
		contactsContainer.prepend(contactCard);

		if (!contactsContainer.classList.contains('hidden')) {
			toggleVisibility(contactsContainer)
		}

		updateActiveState(currentListItem, true);
		updateCounter(currentListItem, true);
		contactsCollection.add(jsonContact);
		saveToStorage();
		mainForm.reset();
	}

	function handleContactListClick(event: MouseEvent) {
		const eventTarget = event.target as HTMLDivElement;
		const currentListItem = eventTarget.closest<HTMLDivElement>('.js-contact-list__item');
		if (currentListItem && currentListItem.contains(eventTarget)) {
			const contactsContainer = ensureNonFalsy(
				currentListItem.nextElementSibling,
				`Cannot find container for contacts with ID data-item=${currentListItem.dataset.item}`
			);
			if (currentListItem.hasAttribute('data-active')) toggleVisibility(contactsContainer);
			return;
		}

		const deleteIcon = eventTarget.closest<HTMLButtonElement>('.js-delete-contact');
		if (deleteIcon && deleteIcon.contains(eventTarget)) {
			deleteContact(deleteIcon);
			return;
		}
	}

	function handleClearListClick() {
		const contacts = document.querySelectorAll<HTMLDivElement>('.js-contacts__item');
		const activeItems = document.querySelectorAll<HTMLDivElement>('[data-active=true]');

		function resetActiveItems() {
			activeItems.forEach(elem => {
				const key = ensureNonFalsy(
					elem.dataset.item,
					`Cannot find container for contacts with ID data-item=${elem.dataset.item}`
				);
				countersCollection.set(key, 0);
				updateActiveState(elem, false)
				const contactsContainer = ensureNonFalsy(
					elem.nextElementSibling,
					`Cannot find container for contacts with ID data-item=${elem.dataset.item}`
				);
				if (!!contactsContainer.classList.contains('hidden')) toggleVisibility(contactsContainer);
			})
		}

		contactsCollection.clear();
		clearContacts(contacts);
		resetActiveItems();
		saveToStorage();
	}

	mainForm.addEventListener('submit', handleAddContactSubmit);
	clearContactsButton.addEventListener('click', handleClearListClick);
	contactLists.forEach(list => {
		list.addEventListener('click', handleContactListClick);
	});
}