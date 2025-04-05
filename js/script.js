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

		const deleteIcon = event.target.closest('.js-delete-contact');

		if (deleteIcon && deleteIcon.contains(event.target)) {

			const contactListItem = deleteIcon.parentElement.parentElement.previousElementSibling;
			const deletedContact = deleteIcon.parentElement;
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
	contact.firstName = form.elements.firstName.value.trim();
	contact.lastName = form.elements.lastName.value.trim();
	contact.phone = form.elements.phone.value.trim();
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

		if (!currentItem.nextElementSibling.hidden) {
			currentItem.nextElementSibling.hidden = true;
		}

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
		document.querySelector('.js-search-modal-overlay').classList.add('active');
	})

document.querySelector('.js-search-modal__close')
	.addEventListener('click', () => {
		document.querySelector('.js-search-modal-overlay').classList.remove('active');

		searchInput.value = null;

		Array.from(document.querySelector('.js-search-modal__contacts').children)
			.forEach(elem => elem.remove())
	})

const searchModal = document.querySelector('.js-search-modal-overlay');
searchModal.addEventListener('click', (event) => {
	if (event.target === searchModal) {
		searchModal.classList.remove('active');

		searchInput.value = null;

		Array.from(document.querySelector('.js-search-modal__contacts').children)
			.forEach(elem => elem.remove())
	}
});

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
			const editIcon = document.createElement('button');
			editIcon.setAttribute('type', 'button');
			editIcon.classList.add('item-contacts__btn', 'btn-icon', 'btn-icon_with-extra-margin', 'js-edit-contact');
			editIcon.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;

			const targetElemClone = document.querySelector(`[data-json-id='${elem}']`).cloneNode(true);
			targetElemClone.classList.add('item-contacts_with-extra-padding')

			document.querySelector('.js-search-modal__contacts').prepend(targetElemClone);

			targetElemClone.lastElementChild.before(editIcon);
		}
	})

	if (!event.target.value) {
		Array.from(document.querySelector('.js-search-modal__contacts').children)
			.forEach(elem => elem.remove());
	}
});

const editModal = document.querySelector('.js-edit-modal-overlay');

editModal.addEventListener('click', (event) => {
	if (event.target === editModal) {
		editModal.classList.remove('active');
	}
})

document.querySelector('.js-search-modal__contacts')
	.addEventListener('click', (event) => {

		const deleteIcon = event.target.closest('.js-delete-contact');

		if (deleteIcon && deleteIcon.contains(event.target)) {
			const deletedContact = deleteIcon.parentElement;
			const [currentAttributeData] = Object.values({ ...deletedContact.dataset });
			const identifier = JSON.parse(currentAttributeData).lastName[0].toLowerCase();
			const contactListItem = document.querySelector(`[data-item=${identifier}]`);

			document.querySelectorAll(`[data-json-id='${currentAttributeData}']`)
				.forEach(elem => elem.remove());

			contactsCollection.delete(currentAttributeData);

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
			return;
		}

		const editIcon = event.target.closest('.js-edit-contact');

		if (editIcon && editIcon.contains(event.target)) {
			editModal.classList.add('active');

			const editableContact = editIcon.parentElement;
			const [currentAttributeData] = Object.values({ ...editableContact.dataset });
			const currentContactData = JSON.parse(currentAttributeData);

			const editModalForm = document.querySelector('.js-edit-modal__form');
			editModalForm.firstName.value = currentContactData.firstName;
			editModalForm.lastName.value = currentContactData.lastName;
			editModalForm.phone.value = currentContactData.phone;

			editModalForm.addEventListener('submit', (event) => {

				event.preventDefault();

				const data = new FormData(editModalForm);
				const formData = Object.fromEntries(data.entries());

				Object.keys(formData).forEach(key => formData[key] = formData[key].trim());

				contactsCollection.delete(currentAttributeData);

				document.querySelectorAll(`[data-json-id='${currentAttributeData}']`)
					.forEach(elem => {
						elem.dataset.jsonId = JSON.stringify(formData);
						elem.querySelector('.item-contacts__first-name').textContent = `First name: ${formData.firstName}`;
						elem.querySelector('.item-contacts__last-name').textContent = `Last name: ${formData.lastName}`;
						elem.querySelector('.item-contacts__phone').textContent = `Phone: ${formData.phone}`;
					})

				contactsCollection.add(JSON.stringify(formData));

				const identifier = currentContactData.lastName[0].toLowerCase();
				const lastNameFirstLetter = formData.lastName[0].toLowerCase();
				const initialCurrentItem = document.querySelector(`[data-item=${identifier}]`);

				if (identifier !== lastNameFirstLetter) {
					Array.from(initialCurrentItem.nextElementSibling.children)
						.forEach(elem => {

							const [currentAttributeData] = Object.values({ ...elem.dataset });
							const currentContactData = JSON.parse(currentAttributeData);
							const currentContactFirstLetter = currentContactData.lastName[0].toLowerCase();

							if (identifier !== currentContactFirstLetter) {
								const targetCurrentItem = document.querySelector(`[data-item=${lastNameFirstLetter}]`);
								targetCurrentItem.nextElementSibling.prepend(elem);
								targetCurrentItem.setAttribute('data-active', 'true');

								countersCollection.forEach((value, key) => {
									if (key === lastNameFirstLetter) {
										countersCollection.set(key, ++value)
									} else if (key === identifier) {
										countersCollection.set(key, --value);
										if (value === 0) initialCurrentItem.removeAttribute('data-active');
									}

									initialCurrentItem.firstElementChild.innerText = `${countersCollection.get(identifier)}`;
									targetCurrentItem.firstElementChild.innerText = `${countersCollection.get(targetCurrentItem.dataset.item)}`;
								})
							}
						})
				}

				const searchInputValue = document.querySelector('.js-search-modal__input').value;
				const searchedContactsContainer = Array.from(document.querySelector('.js-search-modal__contacts').children);

				if (searchInputValue) {
					searchedContactsContainer.forEach(elem => {
						const [currentAttributeData] = Object.values({ ...elem.dataset });
						const currentContactData = JSON.parse(currentAttributeData);
						const currentContactFirstLetter = currentContactData.lastName[0].toLowerCase();

						if (identifier !== currentContactFirstLetter) {
							elem.remove();
						}
					});
				}

				editModal.classList.remove('active');
			}, { once: true });
		}
	})

document.querySelector('.js-show-all')
	.addEventListener('click', () => {

		searchInput.value = null;

		Array.from(document.querySelector('.js-search-modal__contacts').children)
			.forEach(elem => elem.remove())

		const sortedContacts = [...contactsCollection].sort((a, b) => {

			const elemA = document.querySelector(`[data-json-id='${a}']`);
			const elemB = document.querySelector(`[data-json-id='${b}']`);

			const lastNameA = elemA.querySelector('.item-contacts__last-name').textContent;
			const lastNameB = elemB.querySelector('.item-contacts__last-name').textContent;

			return lastNameA.localeCompare(lastNameB);
		})

		sortedContacts.forEach(elem => {
			const editIcon = document.createElement('button');
			editIcon.setAttribute('type', 'button');
			editIcon.classList.add('item-contacts__btn', 'btn-icon', 'js-edit-contact');
			editIcon.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;

			const targetElemClone = document.querySelector(`[data-json-id='${elem}']`).cloneNode(true);
			targetElemClone.classList.add('item-contacts_with-extra-padding');

			document.querySelector('.js-search-modal__contacts').append(targetElemClone);

			targetElemClone.lastElementChild.before(editIcon);
		})
	})

document.querySelector('.js-edit-modal__close')
	.addEventListener('click', (event) => {

		const closeIcon = event.target.closest('.js-edit-modal__close');

	if (closeIcon && closeIcon.contains(event.target)) {
		document.querySelector('.js-edit-modal-overlay').classList.remove('active');
	}
})