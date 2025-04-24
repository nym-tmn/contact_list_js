// import './../assets/styles/scss/style.scss';
import '@assets/styles/scss/style.scss'
// import '@src/index';

const countersCollection = new Map();
const contactsCollection = new Set();
const STORAGE_KEY = 'phoneBookContacts';

function loadFromStorage() {
	const storedData = localStorage.getItem(STORAGE_KEY);
	if (storedData) {
		const parsedData = JSON.parse(storedData);

		parsedData.contacts.forEach(contact => {
			contactsCollection.add(contact);
		});

		Object.entries(parsedData.counters).forEach(([key, value]) => {
			countersCollection.set(key, value);
		});

		restoreUI(parsedData.contacts);
	}
}

// Функция для восстановления UI
function restoreUI(contacts) {
	contacts.forEach(jsonContact => {
		const contact = JSON.parse(jsonContact);
		const currentListItem = getCurrentListItem(getIdentifier(contact));

		const contactCard = createContactCard(contact, jsonContact);
		currentListItem.nextElementSibling.prepend(contactCard);

		if (!currentListItem.hasAttribute('data-active')) {
			updateActiveState(currentListItem, true);
		}

		const counterElement = currentListItem.querySelector('.contact-list__counter');
		counterElement.textContent = countersCollection.get(getIdentifier(contact));
	});
}

// Функция для сохранения данных в localStorage
function saveToStorage() {
	const dataToSave = {
		contacts: Array.from(contactsCollection),
		counters: Object.fromEntries(countersCollection)
	};

	localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

// Инициализация и настройка каждого элемента списка
function initializeContacts() {
	const contactListItems = document.querySelectorAll('.js-contact-list__item');
	contactListItems.forEach(elem => setupListItem(elem));

	loadFromStorage();
}

function setupListItem(listItem) {
	const itemKey = listItem.dataset.item;

	countersCollection.set(itemKey, 0);

	const countElement = createCounterElement(itemKey);
	listItem.append(countElement);

	const contactsContainer = createContactsContainer();
	listItem.after(contactsContainer);
}

function createCounterElement(itemKey) {
	const countElement = document.createElement('div');
	countElement.innerText = countersCollection.get(itemKey);
	countElement.classList.add('contact-list__counter');
	return countElement;
}

function createContactsContainer() {
	const contactsContainer = document.createElement('div');
	contactsContainer.classList.add('contacts');
	contactsContainer.hidden = true;
	return contactsContainer;
}

initializeContacts();

// Получение данных из форм
function getFormData(form) {
	const data = new FormData(form);
	const formData = Object.fromEntries(data.entries());
	Object.keys(formData).forEach(key => formData[key] = formData[key].trim());
	return formData
}

// Получение текущего элемента списка
function getCurrentListItem(itemKey) {
	const currentListItem = document.querySelector(`[data-item=${itemKey}]`);
	return currentListItem;
}

// Переключатель видимости элемента
function toggleVisibility(element) {
	element.hidden = !element.hidden;
}

// Обновление состояния видимости пустого блока
const searchedContacts = document.querySelector('.js-search-modal__contacts');
const emptyElement = document.querySelector('.js-search-modal__empty');

function hasContacts() {
	return searchedContacts.children.length > 0;
}

function updateEmptyState() {
	emptyElement.hidden = hasContacts();
}

// Обновление активного состояния элемента
function updateActiveState(element, isActive) {
	isActive
		? element.setAttribute('data-active', 'true')
		: element.removeAttribute('data-active');
}

// Обновление счетчика
function updateCounter(element, shouldIncrement) {
	const itemKey = element.dataset.item;
	const currentValue = countersCollection.get(itemKey);
	let newValue = shouldIncrement ? currentValue + 1 : currentValue - 1;
	countersCollection.set(itemKey, newValue);

	const counterElement = element.firstElementChild;
	counterElement.textContent = newValue;

	if (newValue === 0) updateActiveState(element, false);
}

// Функция создания карточки контакта
function createContactCard(contact, jsonContact) {
	const contactCard = document.createElement('div');
	contactCard.classList.add('contacts__item', 'item-contacts', 'js-contacts__item');
	contactCard.setAttribute('data-json-id', jsonContact);
	contactCard.innerHTML = `
			<div class="item-contacts__info">
				<div class="item-contacts__first-name">First name: ${contact.firstName}</div>
				<div class="item-contacts__last-name">Last name: ${contact.lastName}</div>
				<div class="item-contacts__phone">Phone: ${contact.phone}</div>
			</div>
			<button class="item-contacts__btn btn-icon js-delete-contact" type="button">
				<i class="fa-solid fa-square-xmark"></i>
			</button>
		`;
	return contactCard;
}

// Обработчик события основной формы на submit
function handleAddSubmit(event) {
	event.preventDefault();

	const formData = getFormData(mainForm);

	const contact = {
		firstName: formData.firstName,
		lastName: formData.lastName,
		phone: formData.phone
	};

	const errors = validateContact(contact);
	if (displayErrors(mainForm, errors)) return;

	const jsonContact = JSON.stringify(contact);
	const currentListItem = getCurrentListItem(getIdentifier(contact));
	const contactCard = createContactCard(contact, jsonContact);
	currentListItem.nextElementSibling.prepend(contactCard);

	if (!currentListItem.nextElementSibling.hidden) {
		toggleVisibility(currentListItem.nextElementSibling)
	}

	updateActiveState(currentListItem, true);
	updateCounter(currentListItem, true);
	contactsCollection.add(jsonContact);
	saveToStorage();
}

// Добавление слушателя событий для основной формы
const mainForm = document.querySelector('.js-actions__form');
mainForm.addEventListener('submit', handleAddSubmit);

// Функция получения идентификатора
function getIdentifier(data) {
	return data.lastName[0].toLowerCase();
}

// Функция получения параметров контакта
function getContactParams(element) {
	const targetContact = element;
	const [jsonAttribute] = Object.values({ ...targetContact.dataset });
	const identifier = getIdentifier(JSON.parse(jsonAttribute));
	const currentListItem = getCurrentListItem(identifier);
	const currentContactData = JSON.parse(jsonAttribute);

	return {
		jsonAttribute,
		identifier,
		currentListItem,
		currentContactData,
	}
}

// Функция удаления контакта
function deleteContact(deleteIcon) {
	const { jsonAttribute, currentListItem, } = getContactParams(deleteIcon.parentElement);

	document.querySelectorAll(`[data-json-id='${jsonAttribute}']`)
		.forEach(elem => elem.remove());

	contactsCollection.delete(jsonAttribute);
	updateCounter(currentListItem, false);
	if (!currentListItem.hasAttribute('data-active')) toggleVisibility(currentListItem.nextElementSibling);
	saveToStorage();
}

// Обработчик собитый списка контактов (удаление котнтактов, скрытие/раскрытие)
function handleContactListClick(event) {
	const currentListItem = event.target.closest('.js-contact-list__item');
	if (currentListItem && currentListItem.contains(event.target)) {
		if (currentListItem.hasAttribute('data-active')) toggleVisibility(currentListItem.nextElementSibling);
		return;
	}

	const deleteIcon = event.target.closest('.js-delete-contact');
	if (deleteIcon && deleteIcon.contains(event.target)) {
		deleteContact(deleteIcon);
		return;
	}
}

// Добавление слушателя событий списку контактов
const contactLists = document.querySelectorAll('.js-contact-list');
contactLists.forEach(list => {
	list.addEventListener('click', handleContactListClick);
})

// Отчищаем весь список контактов
const clearContactsButton = document.querySelector('.js-actions__clear-list');
clearContactsButton.addEventListener('click', () => {

	const contacts = document.querySelectorAll('.js-contacts__item');
	const activeItems = document.querySelectorAll('[data-active=true]');

	function clearAllContacts() {
		contacts.forEach(elem => elem.remove());
		contactsCollection.clear();
	}

	function resetActiveItems() {
		activeItems.forEach(elem => {
			const key = elem.dataset.item;
			countersCollection.set(key, 0);
			updateActiveState(elem, false)
			if (!elem.nextElementSibling.hidden) toggleVisibility(elem.nextElementSibling);
		})
	}

	clearAllContacts();
	resetActiveItems();
	saveToStorage();
})

// Функция очистки контактов в модальном окне поиска
function clearContacts() {
	Array.from(searchedContacts.children)
		.forEach(elem => elem.remove())
}

// Инициализация модального окна поиска
const searchInput = document.querySelector('.js-search-modal__input');

function initSearchModal() {
	const searchModal = document.querySelector('.js-search-modal-overlay');

	function openSearchModal() {
		searchModal.classList.add('active');
		updateEmptyState();
	}

	const searchButton = document.querySelector('.js-actions__search');
	searchButton.addEventListener('click', openSearchModal);

	function closeSearchModal() {
		searchModal.classList.remove('active');
		searchInput.value = '';
		clearContacts();
	}

	const closeIcon = document.querySelector('.js-search-modal__close');
	closeIcon.addEventListener('click', closeSearchModal);

	searchModal.addEventListener('mousedown', (event) => {
		if (event.target === searchModal) {
			closeSearchModal();
		}
	});
}

initSearchModal();

// Функция создания кнопки редактирования
function createEditButton() {
	const editIcon = document.createElement('button');
	editIcon.setAttribute('type', 'button');
	editIcon.classList.add('item-contacts__btn', 'btn-icon', 'js-edit-contact');
	editIcon.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
	return editIcon;
}

// Функция создания клона контакта
function createContactClone(identifier) {
	const contactClobe = document.querySelector(`[data-json-id='${identifier}']`).cloneNode(true);
	contactClobe.classList.add('item-contacts_with-extra-padding')
	searchedContacts.prepend(contactClobe);
	return contactClobe;
}

// Обработчик собитый инпута для поиска контактов
function handleSearchInput(event) {
	let currentContact = null;
	let isMatch = null;

	clearContacts();

	contactsCollection.forEach(elem => {

		currentContact = JSON.parse(elem);
		isMatch = currentContact.lastName.toLowerCase().startsWith(`${event.target.value.toLowerCase()}`);

		if (isMatch) {
			const editIcon = createEditButton();
			const contactClone = createContactClone(elem);
			contactClone.lastElementChild.before(editIcon);
		}
	})

	if (!event.target.value) {
		clearContacts();
	}

	updateEmptyState();
}

// Добавление слушателя событий инпуту для поиска контактов
searchInput.addEventListener('input', handleSearchInput);

// Функция обновления данных контакта
function updateContact(data, jsonAttribute) {
	contactsCollection.delete(jsonAttribute);

	const updatedContacts = document.querySelectorAll(`[data-json-id='${jsonAttribute}']`);

	updatedContacts.forEach(elem => {
		elem.dataset.jsonId = JSON.stringify(data);
		elem.querySelector('.item-contacts__first-name').textContent = `First name: ${data.firstName}`;
		elem.querySelector('.item-contacts__last-name').textContent = `Last name: ${data.lastName}`;
		elem.querySelector('.item-contacts__phone').textContent = `Phone: ${data.phone}`;
	})

	contactsCollection.add(JSON.stringify(data));
	saveToStorage();
}

// Функция перемещения контакта при обновлении данных в соответствущую ячейку
function moveContact(currentId, currentListItem, newId) {
	Array.from(currentListItem.nextElementSibling.children)
		.forEach(elem => {
			const { currentListItem: targetListItem } = getContactParams(elem);

			if (currentId !== newId) {
				targetListItem.nextElementSibling.prepend(elem);
				updateActiveState(targetListItem, true);
				updateCounter(currentListItem, false);
				updateCounter(targetListItem, true);
			}
		})
	saveToStorage();
}

// Функция обновления списка контактов(в соответствии со значением в searchInput) после изменения данных какого-либо контакта
function refreshContactList(currentId, searchedContacts) {
	Array.from(searchedContacts.children).forEach(elem => {
		const { identifier: newId } = getContactParams(elem);

		if (currentId !== newId) {
			elem.remove();
		}
	});
}

// Функция инициализации модального окна для редактирования
function initEditModal(editModal, editModalForm, closeIcon, handleEditSubmit) {

	function openEditModal() {
		editModal.classList.add('active');
	}

	editModalForm.addEventListener('submit', handleEditSubmit);

	function closeEditModal(handleCloseClick, handleModalBackdropClick) {
		editModal.classList.remove('active');
		editModalForm.removeEventListener('submit', handleEditSubmit);
		closeIcon.removeEventListener('click', handleCloseClick);
		editModal.removeEventListener('mousedown', handleModalBackdropClick);
	}

	function handleCloseClick() {
		closeEditModal(handleCloseClick, handleModalBackdropClick);
	}

	closeIcon.addEventListener('click', handleCloseClick);

	function handleModalBackdropClick(event) {
		if (event.target === editModal) {
			closeEditModal(handleCloseClick, handleModalBackdropClick);
		}
	}

	editModal.addEventListener('mousedown', handleModalBackdropClick);

	return {
		openEditModal,
		handleCloseClick,
		handleModalBackdropClick,
		closeEditModal,
	}
}

// Обработчик событий найденых контактов
function handleFoundContactClick(event) {
	const deleteIcon = event.target.closest('.js-delete-contact');
	if (deleteIcon && deleteIcon.contains(event.target)) {
		deleteContact(deleteIcon);
		updateEmptyState();
		return;
	}

	const editModal = document.querySelector('.js-edit-modal-overlay');
	const editModalForm = document.querySelector('.js-edit-modal__form');
	const closeIcon = document.querySelector('.js-edit-modal__close');
	const editIcon = event.target.closest('.js-edit-contact');
	if (editIcon && editIcon.contains(event.target)) {

		const {
			openEditModal,
			handleCloseClick,
			handleModalBackdropClick,
			closeEditModal
		} = initEditModal(editModal, editModalForm, closeIcon, handleEditSubmit);

		openEditModal();

		const { jsonAttribute, identifier: currentIdentifier, currentListItem, currentContactData } = getContactParams(editIcon.parentElement);

		editModalForm.firstName.value = currentContactData.firstName;
		editModalForm.lastName.value = currentContactData.lastName;
		editModalForm.phone.value = currentContactData.phone;

		function handleEditSubmit(event) {
			event.preventDefault();

			const formData = getFormData(editModalForm);

			const updatedContact = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				phone: formData.phone
			};

			const errors = validateContact(updatedContact);
			if (displayErrors(editModalForm, errors)) return;

			updateContact(updatedContact, jsonAttribute);

			const newIdentifier = getIdentifier(updatedContact);
			if (currentIdentifier !== newIdentifier) moveContact(currentIdentifier, currentListItem, newIdentifier);

			const searchInputValue = document.querySelector('.js-search-modal__input').value;
			if (searchInputValue) refreshContactList(currentIdentifier, searchedContacts);

			updateEmptyState();
			closeEditModal(handleCloseClick, handleModalBackdropClick);
		}
	}
}

// Добавление слушателя событий контейнеру найденых контактов
searchedContacts.addEventListener('click', handleFoundContactClick);

// Функция слртировки контактов по фамилии в алфавитном порядке
function sortContacts() {
	const sortedContacts = [...contactsCollection].sort((a, b) => {

		const elemA = document.querySelector(`[data-json-id='${a}']`);
		const elemB = document.querySelector(`[data-json-id='${b}']`);
		const lastNameA = elemA.querySelector('.item-contacts__last-name').textContent;
		const lastNameB = elemB.querySelector('.item-contacts__last-name').textContent;

		return lastNameB.localeCompare(lastNameA);
	})
	return sortedContacts;
}

// Обработчик события на клик по кнопке showAll
function handleShowAllClick() {

	searchInput.value = null;

	clearContacts();

	const sortedContacts = sortContacts();

	sortedContacts.forEach(elem => {
		const editIcon = createEditButton();
		const contactClone = createContactClone(elem);
		contactClone.lastElementChild.before(editIcon);
	})

	updateEmptyState();
}

// Добавление слушателя событий для кнопки showAll
const showAllButton = document.querySelector('.js-show-all');
showAllButton.addEventListener('click', handleShowAllClick);

// Валидация формы и обработка ошибок
const ErrorType = {
	REQUIRED: 'Empty input',
	MIN_LENGTH: 'Can\'t be shorter than 3 symbols',
	MAX_LENGTH: 'Can\'t be longer than 20 symbols',
	NAME_FORMAT: 'Invalid value',
	PHONE_FORMAT: 'Invalid phone number',
	DUPLICATE_CONTACT: 'Contact already exists',
	DUPLICATE_PHONE: 'This phone number already exists',
};

const FieldType = {
	FIRST_NAME: 'firstName',
	LAST_NAME: 'lastName',
	PHONE: 'phone',
};

const ErrorContainers = {
	MAIN_FORM: '.js-actions__error',
	EDIT_FORM: '.js-edit-modal__error',
};

function validateField(value, fieldType) {
	const regexName = /^[A-Z][a-z]*(?:[\s-]+[A-Z][a-z]*)*$/;
	const regexPhone = /^\+\d{1,3}\d{10}$/;
	const error = [];

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
}

function validateContact(contact) {
	const errors = {
		[FieldType.FIRST_NAME]: validateField(contact.firstName, FieldType.FIRST_NAME),
		[FieldType.LAST_NAME]: validateField(contact.lastName, FieldType.LAST_NAME),
		[FieldType.PHONE]: validateField(contact.phone, FieldType.PHONE),
	};

	const jsonContact = JSON.stringify(contact);
	const isDuplicateContact = contactsCollection.has(jsonContact);

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

let errorTimeout = null;
const originalPlaceholders = new Map();
function displayErrors(formElement, errors) {

	const errorContainerSelector = formElement.classList.contains('js-edit-modal__form')
		? ErrorContainers.EDIT_FORM
		: ErrorContainers.MAIN_FORM;

	if (errorTimeout) {
		clearTimeout(errorTimeout);
		errorTimeout = null;
	}

	clearErrors(formElement, errorContainerSelector);

	let hasErrors = false;

	Object.entries(errors).forEach(([fieldName, fieldErrors]) => {

		if (fieldErrors?.length && fieldName !== 'general') {
			const input = formElement.querySelector(`[name="${fieldName}"]`);

			if (!originalPlaceholders.has(input)) {
				originalPlaceholders.set(input, input.placeholder);
			}

			const errorContainer = document.querySelector(errorContainerSelector);
			errorContainer.textContent = 'Error';
			errorContainer.classList.add('active');
			input.value = '';
			input.placeholder = fieldErrors.join(', ');
			input.classList.add('error');
			hasErrors = true;
		}
	});

	if (errors.general) {
		const errorContainer = document.querySelector(errorContainerSelector);
		errorContainer.textContent = errors.general;
		errorContainer.classList.add('active');
		hasErrors = true;
	}

	if (hasErrors) {
		errorTimeout = setTimeout(() => {
			clearErrors(formElement, errorContainerSelector);
			errorTimeout = null;
		}, 3000);

		return hasErrors;
	}
}

function restoreOriginalPlaceholders() {
	originalPlaceholders.forEach((placeholder, input) => {
		input.placeholder = placeholder;
	});
}

function clearErrors(formElement, errorContainerSelector) {
	restoreOriginalPlaceholders();

	formElement.querySelectorAll('.error').forEach(input => {
		input.classList.remove('error');
	});

	const errorContainer = document.querySelector(errorContainerSelector);
	if (errorContainer) {
		errorContainer.classList.remove('active');
	}

	formElement.querySelectorAll('input').forEach(input => {
		originalPlaceholders.delete(input);
	});
}