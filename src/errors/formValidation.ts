import { ensureNonFalsy } from '@src/app/helpers/helpers';
import { contactsCollection } from '@src/stores/collections';
import { IContact, TimeoutType } from '@src/types/types';

enum ErrorType {
	REQUIRED = 'Empty input',
	MIN_LENGTH = 'Can\'t be shorter than 3 symbols',
	MAX_LENGTH = 'Can\'t be longer than 20 symbols',
	NAME_FORMAT = 'Invalid value',
	PHONE_FORMAT = 'Invalid phone number',
	DUPLICATE_CONTACT = 'Contact already exists',
	DUPLICATE_PHONE = 'This phone number already exists',
};

enum FieldType {
	FIRST_NAME = 'firstName',
	LAST_NAME = 'lastName',
	PHONE = 'phone',
};

enum ErrorSelectors {
	MAIN_FORM = '.js-actions__error',
	EDIT_FORM = '.js-edit-modal__error',
};

function validateField(value: string, fieldType: FieldType) {
	const regexName = /^[A-Z][a-z]*(?:[\s-]+[A-Z][a-z]*)*$/;
	const regexPhone = /^\+\d{1,3}\d{10}$/;
	const error: string[] = [];

	if (!value) {
		error.push(ErrorType.REQUIRED);
		return error;
	}

	if (fieldType !== FieldType.PHONE) {
		if (value.length < 3) {
			error.push(ErrorType.MIN_LENGTH);
			return error;
		}
		if (value.length > 20) {
			error.push(ErrorType.MAX_LENGTH);
			return error;
		}
		if (!regexName.test(value)) {
			error.push(ErrorType.NAME_FORMAT);
			return error;
		}
	} else {
		if (!regexPhone.test(value)) {
			error.push(ErrorType.PHONE_FORMAT);
			return error;
		}
	}
	return;
}

interface IErrors extends Record<FieldType, string[] | undefined> {
	general?: ErrorType;
}

export function validateContact(formElement: HTMLFormElement, contact: IContact) {

	const errorSelector = formElement.classList.contains('js-edit-modal__form')
		? ErrorSelectors.EDIT_FORM
		: ErrorSelectors.MAIN_FORM;
	
	const errors: IErrors = {
		[FieldType.FIRST_NAME]: validateField(contact.firstName, FieldType.FIRST_NAME),
		[FieldType.LAST_NAME]: validateField(contact.lastName, FieldType.LAST_NAME),
		[FieldType.PHONE]: validateField(contact.phone, FieldType.PHONE),
	};

	const jsonContact = JSON.stringify(contact);
	const isDuplicateContact = contactsCollection.has(jsonContact);

	if (errorSelector === ErrorSelectors.EDIT_FORM) return errors;

	let isDuplicatePhone = false;
	if (!isDuplicateContact) {
		contactsCollection.forEach(existingContact => {
			const existing = JSON.parse(existingContact);
			if (existing.phone === contact.phone) {
				isDuplicatePhone = true;
			}
		})
	}

	if (isDuplicateContact) {
		errors.general = ErrorType.DUPLICATE_CONTACT;
	} else if (isDuplicatePhone) {
		errors.general = ErrorType.DUPLICATE_PHONE;
	}

	return errors;
}

let errorTimeout: TimeoutType = null;
const originalPlaceholders = new Map<HTMLInputElement, string>();

export function displayErrors(formElement: HTMLFormElement, errors: IErrors) {

	const errorSelector = formElement.classList.contains('js-edit-modal__form')
		? ErrorSelectors.EDIT_FORM
		: ErrorSelectors.MAIN_FORM;

	const errorContainer = ensureNonFalsy(
		document.querySelector<HTMLDivElement>(errorSelector),
		`Cannot find error container with class=${errorSelector}`
	);

	if (errorTimeout) {
		clearTimeout(errorTimeout);
		errorTimeout = null;
	}

	clearErrors(formElement, errorContainer);

	let hasErrors = false;

	Object.entries(errors).forEach(([fieldName, fieldErrors]: [string, string[] | undefined]) => {

		if (fieldErrors?.length && fieldName !== 'general') {
			const input = ensureNonFalsy(
				formElement.querySelector<HTMLInputElement>(`[name="${fieldName}"]`),
				`Cannot find input element with ID name=${fieldName}`
			);

			if (!originalPlaceholders.has(input)) {
				originalPlaceholders.set(input, input.placeholder);
			}

			errorContainer.textContent = 'Error';
			errorContainer.classList.add('active');
			input.value = '';
			input.placeholder = fieldErrors.join('');
			input.classList.add('error');
			hasErrors = true;
		}
	});

	if (errors.general) {
		errorContainer.textContent = errors.general;
		errorContainer.classList.add('active');
		hasErrors = true;
	}

	if (hasErrors) {
		errorTimeout = setTimeout(() => {
			clearErrors(formElement, errorContainer);
			errorTimeout = null;
		}, 3000);

		return hasErrors;
	}
	return hasErrors;
}

function restoreOriginalPlaceholders() {
	originalPlaceholders.forEach((placeholder, input) => {
		input.placeholder = placeholder;
	});
}

function clearErrors(formElement: HTMLFormElement, errorContainer: HTMLDivElement) {
	restoreOriginalPlaceholders();

	formElement.querySelectorAll('.error').forEach(input => {
		input.classList.remove('error');
	});

	errorContainer.classList.remove('active');

	formElement.querySelectorAll('input').forEach(input => {
		originalPlaceholders.delete(input);
	});
}