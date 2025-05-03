import { displayErrors, validateContact } from '@src/errors/formValidation';
import { IContact, IEditModalHandlers } from '@src/types/types';
import { getFormContact, getFoundContacts, getIdentifier } from '@src/utils/contacts';
import { updateEmptyState } from '@src/utils/dom';
import { editContact } from '@src/app/features/editContact';
import { moveContact } from '@src/app/features/moveContact';
import { refreshContactList } from '@src/app/features/refreshContactList';

export function setupEditModalHandlers({
	editModal,
	closeEditModalIcon,
	editModalForm,
	jsonAttribute,
	identifier,
	currentListItem,
	currentContactData,
	searchInput,
}: IEditModalHandlers) {

	function handleOpenModalClick() {
		editModal.classList.add('active');

		editModalForm.firstName.value = currentContactData.firstName;
		editModalForm.lastName.value = currentContactData.lastName;
		editModalForm.phone.value = currentContactData.phone;
		
		closeEditModalIcon.addEventListener('click', handleCloseModalClick);
		editModal.addEventListener('mousedown', handleCloseBackdropModalClick);
		editModalForm.addEventListener('submit', handleEditSubmit);
	}

	function handleCloseModalClick() {
		editModal.classList.remove('active');
		closeEditModalIcon.removeEventListener('click', handleCloseModalClick);
		editModal.removeEventListener('mousedown', handleCloseBackdropModalClick);
		editModalForm.removeEventListener('submit', handleEditSubmit);
	}

	function handleCloseBackdropModalClick(event: MouseEvent) {
		if (event.target === editModal) {
			handleCloseModalClick();
		}
	}

	function handleEditSubmit(event: SubmitEvent) {
		event.preventDefault();

		const formData = getFormContact(editModalForm);
		const updatedContact: IContact = {
			firstName: formData.firstName,
			lastName: formData.lastName,
			phone: formData.phone,
		};

		const errors = validateContact(editModalForm, updatedContact);
		if (displayErrors(editModalForm, errors)) return;

		editContact(updatedContact, jsonAttribute);

		const newIdentifier = getIdentifier(updatedContact);
		if (identifier !== newIdentifier) {
			moveContact(identifier, currentListItem, newIdentifier);
		}

		const searchInputValue = searchInput.value;

		if (searchInputValue) {
			refreshContactList(identifier, getFoundContacts());
		}

		updateEmptyState(getFoundContacts());
		handleCloseModalClick();
	}

	handleOpenModalClick();
}