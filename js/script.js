'use strict'

const countersCollection = new Map();
const contactsCollection = new Set();

document.querySelectorAll('.js-contact-list__item')
	.forEach(elem => {
		countersCollection.set(elem.dataset.item, 0);

		const countElement = document.createElement('div');
		countElement.innerText = countersCollection.get(elem.dataset.item);
		countElement.classList.add('contact-list__counter');
		elem.append(countElement);

		const contactsContainer = document.createElement('div');
		contactsContainer.classList.add('contacts')
		contactsContainer.hidden = true;
		elem.after(contactsContainer);
	})

document.querySelectorAll('.js-contact-list').forEach(elem => {
	elem.addEventListener('click', (event) => {

		const contactListItem = event.target.closest('.js-contact-list__item');
		if (contactListItem && contactListItem.contains(event.target)) {
			contactListItem.hasAttribute('data-active')
				? contactListItem.nextElementSibling.hidden = !contactListItem.nextElementSibling.hidden
				: null;
			return;
		}

		const deleteButton = event.target.closest('.js-delete-contact');

		if (deleteButton && deleteButton.contains(event.target)) {

			const contactListItem = deleteButton.parentElement.parentElement.previousElementSibling;
			const deletedContact = deleteButton.parentElement;
			contactsCollection.delete(...Object.values({ ...deletedContact.dataset }));

			countersCollection.forEach((value, key) => {
				if (key === contactListItem.dataset.item) {
					countersCollection.set(key, --value);
					if (value === 0) contactListItem.removeAttribute('data-active');
				}
			})

			contactListItem.firstElementChild.innerText = `${countersCollection.get(contactListItem.dataset.item)}`
			deletedContact.remove();

			!contactListItem.hasAttribute('data-active')
				? contactListItem.nextElementSibling.hidden = true
				: null;
		}
	})
})

const errorMessage = document.createElement('div');
errorMessage.classList.add('error');
errorMessage.innerText = 'The contact list cannot contain 2 identical contacts.';
document.querySelector('.js-actions').append(errorMessage);

const form = document.querySelector('.js-actions__form');
form.addEventListener('submit', (event) => {

	event.preventDefault();

	const contact = {};
	contact.firstName = form.elements.firstName.value;
	contact.lastName = form.elements.lastName.value;
	contact.phone = form.elements.phone.value;
	const jsonContact = JSON.stringify(contact);

	const currentItem = document.querySelector(`[data-item=${contact.lastName[0].toLowerCase()}]`);
	currentItem.setAttribute('data-active', 'true')

	if (!contactsCollection.has(jsonContact)) {
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

		currentItem.nextElementSibling.prepend(contactCard);

		countersCollection.forEach((value, key) => {
			if (key === currentItem.dataset.item) {
				countersCollection.set(key, ++value)
			}
		})

		currentItem.firstElementChild.innerText = `${countersCollection.get(currentItem.dataset.item)}`;
	} else {
		errorMessage.classList.add('error-visible');
		setTimeout(() => errorMessage.classList.remove('error-visible'), 5000)
	}

	contactsCollection.add(jsonContact);

	if (!currentItem.nextElementSibling.hidden) {
		currentItem.nextElementSibling.hidden = true;
	}
})

document.querySelector('.js-actions__clear-list')
	.addEventListener('click', () => {

		document.querySelectorAll('.js-contacts__item')
			.forEach(elem => elem.remove())

		document.querySelectorAll('[data-active=true]')
			.forEach(elem => {
				countersCollection.forEach((_, key) => {
					if (key === elem.dataset.item) {
						countersCollection.set(key, 0);
						elem.removeAttribute('data-active');
						elem.nextElementSibling.hidden = true;
					}
				})
			})

		contactsCollection.clear();
	})

document.querySelector('.js-actions__search')
	.addEventListener('click', () => {
		document.querySelector('[data-isvisible=false]').dataset.isvisible = true;
	})

document.querySelector('.js-search-modal__close')
	.addEventListener('click', () => {
		document.querySelector('[data-isvisible=true]').dataset.isvisible = false;

		searchInput.value = null;

		Array.from(document.querySelector('.js-search-modal__contacts').children)
			.forEach(elem => elem.remove())
	})

const searchInput = document.querySelector('.js-search-modal__input');
searchInput.addEventListener('input', (event) => {

	let currentContact = null;
	let isMatch = null;

	Array.from(document.querySelector('.js-search-modal__contacts').children)
		.forEach(elem => elem.remove())

	contactsCollection.forEach(elem => {

		currentContact = JSON.parse(elem);
		isMatch = currentContact.lastName.toLowerCase().startsWith(`${event.target.value.toLowerCase()}`);

		if (isMatch) {
			const editButton = document.createElement('button');
			editButton.setAttribute('type', 'button');
			editButton.classList.add('item-contacts__btn', 'btn-icon', 'btn-icon_with-extra-padding', 'js-edit-contact');
			editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;

			const targetElemClone = document.querySelector(`[data-json-id='${elem}']`)?.cloneNode(true);
			targetElemClone?.classList.add('item-contacts_with-extra-padding')

			document.querySelector('.js-search-modal__contacts').prepend(targetElemClone);

			targetElemClone?.lastElementChild.before(editButton);
		}
	})

	if (!event.target.value) {
		Array.from(document.querySelector('.js-search-modal__contacts').children)
			.forEach(elem => elem.remove());
	}
});

document.querySelector('.js-search-modal__contacts')
	.addEventListener('click', (event) => {

		const deleteButton = event.target.closest('.js-delete-contact');

		if (deleteButton && deleteButton.contains(event.target)) {

			const deletedContact = deleteButton.parentElement;

			const [currentDataAttribute] = Object.values({ ...deletedContact.dataset });

			const identifier = JSON.parse(currentDataAttribute).lastName[0].toLowerCase();

			const contactListItem = document.querySelector(`[data-item=${identifier}]`);

			document.querySelectorAll(`[data-json-id='${currentDataAttribute}']`)
				.forEach(elem => elem.remove());

			contactsCollection.delete(currentDataAttribute);

			countersCollection.forEach((value, key) => {
				if (key === identifier) {
					countersCollection.set(key, --value);
					if (value === 0) contactListItem.removeAttribute('data-active');
				}
			})

			contactListItem.firstElementChild.innerText = `${countersCollection.get(identifier)}`;

			!contactListItem.hasAttribute('data-active')
				? contactListItem.nextElementSibling.hidden = true
				: null;
		}
	})

document.querySelector('.js-show-all')
	.addEventListener('click', () => {

		contactsCollection.forEach(elem => {
			const editButton = document.createElement('button');
			editButton.setAttribute('type', 'button');
			editButton.classList.add('item-contacts__btn', 'btn-icon', 'btn-icon_with-extra-padding', 'js-edit-contact');
			editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;

			const targetElemClone = document.querySelector(`[data-json-id='${elem}']`)?.cloneNode(true);
			targetElemClone?.classList.add('item-contacts_with-extra-padding')

			document.querySelector('.js-search-modal__contacts').prepend(targetElemClone);

			targetElemClone?.lastElementChild.before(editButton);
		})
		
	})