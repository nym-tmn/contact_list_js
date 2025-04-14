'use strict'

const countersCollection = new Map();
const contactsCollection = new Set();

// Инициализация и настройка каждого элемента списка
function initializeContacts() {
	const contactListItems = document.querySelectorAll('.js-contact-list__item');
	contactListItems.forEach(elem => setupListItem(elem));
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
function handleSubmit(event) {
	event.preventDefault();
	if (!validateForm('.js-form-actions__input', '.js-actions__error', 'Error')) return;

	const formData = getFormData(mainForm);

	const contact = {};
	contact.firstName = formData.firstName;
	contact.lastName = formData.lastName;
	contact.phone = formData.phone;
	const jsonContact = JSON.stringify(contact);

	if (!contactsCollection.has(jsonContact)) {
		const currentListItem = getCurrentListItem(contact.lastName[0].toLowerCase());

		const contactCard = createContactCard(contact, jsonContact);

		currentListItem.nextElementSibling.prepend(contactCard);

		if (!currentListItem.nextElementSibling.hidden) toggleVisibility(currentListItem.nextElementSibling);
		updateActiveState(currentListItem, true);
		updateCounter(currentListItem, true);
	} else {
		const errorMessage = 'The contact list cannot contain 2 identical contacts';
		showError(null, null, '.js-actions__error', errorMessage);
	}

	contactsCollection.add(jsonContact);
}

// Добавление слушателя событий для основной формы
const mainForm = document.querySelector('.js-actions__form');
mainForm.addEventListener('submit', handleSubmit);

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
			if (!validateForm('.js-form-edit-modal__input', '.js-edit-modal__error', 'Error')) return;


			const formData = getFormData(editModalForm);

			if (contactsCollection.has(JSON.stringify(formData))) {
				const errorMessage = 'The contact list cannot contain 2 identical contacts';
				showError(null, null, '.js-edit-modal__error', errorMessage);
				return;
			}

			updateContact(formData, jsonAttribute);

			const newIdentifier = getIdentifier(formData);
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
const errorPopUp = document.createElement('div');
errorPopUp.classList.add('errorStyle');

const validateForm = (formSelector, errorSelector, errorMessage) => {

	let isValid = true;
	const regexName = /^[A-Z][a-z]*(?:[\s-]+[A-Z][a-z]*)*$/;
	const regexPhone = /^\+\d{1,4}\d{9}$/;

	const inputs = document.querySelectorAll(formSelector);

	inputs.forEach(input => {

		const value = input.value.trim();

		if (!value) {
			showError(input, 'Empty input', errorSelector, errorMessage);
			isValid = false;
			return;
		}

		if (input.type !== 'tel') {
			if (value.length < 3) {
				showError(input, 'Can\'t be shorter than 3 symbols', errorSelector, errorMessage);
				isValid = false;
				return;
			}

			if (value.length > 20) {
				showError(input, 'Can\'t be longer than 20 symbols', errorSelector, errorMessage);
				isValid = false;
				return;
			}

			if (!regexName.test(value)) {
				showError(input, 'Invalid value', errorSelector, errorMessage);
				isValid = false;
				return;
			}
		}

		if (input.type === 'tel') {
			if (!regexPhone.test(value)) {
				showError(input, 'Invalid phone number', errorSelector, errorMessage);
				isValid = false;
				return;
			}
		}
	})
	return isValid;
}

const showError = (input, errorPlaceholder, errorSelector, errorMessage) => {

	const errorContainer = document.querySelector(errorSelector);
	errorPopUp.innerText = errorMessage;
	errorContainer.append(errorPopUp);
	errorContainer.classList.add('active');

	if (input) {
		const originalPlaceholder = input.placeholder;
		input.classList.add('error');
		input.value = '';
		input.placeholder = errorPlaceholder;

		setTimeout(() => {
			input.classList.remove('error');
			input.placeholder = originalPlaceholder;
		}, 3000);
	}

	setTimeout(() => {
		errorContainer.classList.remove('active');
	}, 3000);
};