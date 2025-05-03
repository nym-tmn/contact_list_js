import { createEditButton, updateEmptyState } from '@src/utils/dom';
import { clearContacts } from '@src/app/features/clearContacts';
import { deleteContact } from '@src/app/features/deleteContact';
import { initEditModal } from '@src/app/init';
import { contactsCollection } from '@src/stores/collections';
import { IContact, ISearchModalHandlers } from '@src/types/types';
import { createContactClone } from '@src/app/features/createContact';
import { ensureNonFalsy } from '@src/app/helpers/helpers';
import { sortContacts } from '@src/app/features/sortContacts';
import { closeEditModalIcon, editModalForm, editModal } from '@src/app/domElements';
import { getFoundContacts } from '@src/utils/contacts';

export function setupSearchModalHandlers({
	searchButton,
	searchModal,
	searchInput,
	showAllButton,
	foundContactsContainer,
	closeSearchModalIcon,
}: ISearchModalHandlers) {
	function handleOpenModalClick() {
		searchModal.classList.add('active');

		closeSearchModalIcon.addEventListener('click', handleCloseModalClick);
		searchModal.addEventListener('mousedown', handleCloseBackdropModalClick);
		foundContactsContainer.addEventListener('click', handleFoundContactClick);
		searchInput.addEventListener('input', handleInputChange);
		showAllButton.addEventListener('click', handleShowAllContactsClick);
	}

	function handleCloseModalClick() {
		searchModal.classList.remove('active');
		searchInput.value = '';
		clearContacts(getFoundContacts());
		updateEmptyState(getFoundContacts());

		closeSearchModalIcon.removeEventListener('click', handleCloseModalClick);
		searchModal.removeEventListener('mousedown', handleCloseBackdropModalClick);
		searchInput.removeEventListener('input', handleInputChange);
		showAllButton.removeEventListener('click', handleShowAllContactsClick);
	}

	function handleCloseBackdropModalClick(event: MouseEvent) {
		if (event.target === searchModal) {
			handleCloseModalClick();
		}
	}

	function handleFoundContactClick(event: MouseEvent) {
		const eventTarget = event.target as HTMLButtonElement;

		const deleteIcon = eventTarget.closest<HTMLButtonElement>('.js-delete-contact');
		if (deleteIcon && deleteIcon.contains(eventTarget)) {
			deleteContact(deleteIcon);
			updateEmptyState(getFoundContacts());
			return;
		}

		const editIcon = eventTarget.closest<HTMLButtonElement>('.js-edit-contact');
		if (editIcon && editIcon.contains(eventTarget)) {
			initEditModal({ editIcon, editModal, closeEditModalIcon, editModalForm, searchInput });
			return;
		}
	}

	function handleInputChange(event: Event) {
		let currentContact: IContact | null = null;
		let isMatch: boolean | null = null;
		const eventTarget = event.target as HTMLInputElement;

		clearContacts(getFoundContacts());

		contactsCollection.forEach(elem => {

			currentContact = JSON.parse(elem);
			isMatch = ensureNonFalsy(
				currentContact,
				`Cannot find current contact with ID=${elem}`
			)
				.lastName
				.toLowerCase()
				.startsWith(`${eventTarget.value.toLowerCase()}`);

			if (isMatch) {
				const editIcon = createEditButton();
				const contactClone = createContactClone(elem, foundContactsContainer);
				const contactCloneLastChild = ensureNonFalsy(
					contactClone.lastElementChild,
					'Cannot find last HTML Element for contact clone'
				);
				contactCloneLastChild.before(editIcon);
			}
		})

		if (!eventTarget.value) {
			clearContacts(getFoundContacts());
		}

		updateEmptyState(getFoundContacts());
	}

	function handleShowAllContactsClick() {
		searchInput.value = '';

		clearContacts(getFoundContacts());

		const sortedContacts = sortContacts();

		sortedContacts.forEach(elem => {
			const editIcon = createEditButton();
			const contactClone = createContactClone(elem, foundContactsContainer);
			const contactCloneLastChild = ensureNonFalsy(
				contactClone.lastElementChild,
				'Cannot find last HTML Element for contact clone'
			);
			contactCloneLastChild.before(editIcon);
		})

		updateEmptyState(getFoundContacts());
	}

	searchButton.addEventListener('click', handleOpenModalClick);
}