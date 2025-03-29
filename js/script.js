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

		const deleteButton = event.target.closest('.js-contact__btn');
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
document.querySelector('.js-actions-wrapper').append(errorMessage);

const form = document.querySelector('.js-form');
form.addEventListener('submit', (event) => {

	event.preventDefault();

	const contact = {};
	contact.firstName = form.elements.firstName.value;
	contact.lastName = form.elements.lastName.value;
	contact.phone = form.elements.phone.value;
	const jsonContact = JSON.stringify(contact);

	const currentItem = document.querySelector(`[data-item=${contact.firstName[0].toLowerCase()}]`);
	currentItem.setAttribute('data-active', 'true')

	if (!contactsCollection.has(jsonContact)) {
		const contactCard = document.createElement('div');
		contactCard.classList.add('contact', 'js-contact');
		contactCard.setAttribute('data-json-id', jsonContact);
		contactCard.innerHTML = `
		<div class="contact__info">
		<div>First name: ${contact.firstName}</div>
		<div>Last name: ${contact.lastName}</div>
		<div>Phone: ${contact.phone}</div>
		</div>
		<button class="contact__btn js-contact__btn" type="button">
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
		errorMessage.classList.add('errorVisible');
		setTimeout(() => errorMessage.classList.remove('errorVisible'), 5000)
	}

	contactsCollection.add(jsonContact);

	if (!currentItem.nextElementSibling.hidden) {
		currentItem.nextElementSibling.hidden = true;
	}
})

document.querySelector('.js-btn-clear-list')
	.addEventListener('click', () => {

		document.querySelectorAll('.js-contact')
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

document.querySelector('.js-btn-search')
	.addEventListener('click', () => {
		console.log('ddd');
	})  