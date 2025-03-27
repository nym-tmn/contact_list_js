const countersCollection = new Map();
const contactsCollection = new Set();

document.querySelectorAll('.contact-list__item')
	.forEach(elem => {

		countersCollection.set(elem.dataset.item, 0);

		const countElement = document.createElement('div');
		countElement.innerText = countersCollection.get(elem.dataset.item);
		countElement.classList.add('contact-list__counter');
		elem.append(countElement);

		const contactsContainer = document.createElement('div');
		contactsContainer.classList.add('contacts-container');
		contactsContainer.hidden = true;
		elem.after(contactsContainer);
	})

document.querySelectorAll('.contact-list').forEach(elem => {
	elem.addEventListener('click', (event) => {

		const contactListItem = event.target.closest('.contact-list__item');
		if (contactListItem && contactListItem.contains(event.target)) {
			contactListItem.nextElementSibling.hidden = !contactListItem.nextElementSibling.hidden;
			return;
		}

		const deleteButton = event.target.closest('.contact__button');
		if (deleteButton.contains(event.target)) {

			const currentItem = deleteButton.parentElement.parentElement.previousElementSibling;
			const deletedContact = deleteButton.parentElement;
			contactsCollection.delete(...Object.values({ ...deletedContact.dataset }));

			countersCollection.forEach((value, key) => {
				if (key === currentItem.dataset.item) {
					countersCollection.set(key, --value);
					if (value === 0) currentItem.classList.remove('contact-list__item_active');
				}
			})

			currentItem.firstElementChild.innerText = `${countersCollection.get(currentItem.dataset.item)}`
			deletedContact.remove();
		}
	})
})

const errorMessage = document.createElement('div');
errorMessage.classList.add('error');
errorMessage.innerText = 'The contact list cannot contain 2 identical contacts.';
document.querySelector('.actions-wrapper').append(errorMessage);

const form = document.querySelector('.form');
form.addEventListener('submit', (event) => {

	event.preventDefault();

	const contact = {};
	contact.firstName = form.elements.firstName.value;
	contact.lastName = form.elements.lastName.value;
	contact.phone = form.elements.phone.value;
	const jsonContact = JSON.stringify(contact);

	const currentItem = document.querySelector(`[data-item=${contact.firstName[0].toLowerCase()}]`);
	currentItem.classList.add('contact-list__item_active');

	if (!contactsCollection.has(jsonContact)) {
		const contactCard = document.createElement('div');
		contactCard.classList.add('contact');
		contactCard.setAttribute('data-json-id', jsonContact);
		contactCard.innerHTML = `
		<div class="contact__info">
		<div>First name: ${contact.firstName}</div>
		<div>Last name: ${contact.lastName}</div>
		<div>Phone: ${contact.phone}</div>
		</div>
		<button class="contact__button" type="button">
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

document.querySelector('[data-clear=clear]')
	.addEventListener('click', () => {

		document.querySelectorAll('.contact')
			.forEach(elem => elem.remove())

		document.querySelectorAll('.contact-list__item_active')
			.forEach(elem => {
				countersCollection.forEach((value, key) => {
					if (key === elem.dataset.item) {
						countersCollection.set(key, value = 0);
						elem.classList.remove('contact-list__item_active');
					}
				})
			})

		contactsCollection.clear();
	})

document.querySelector('[data-search=search]')
	.addEventListener('click', () => {
		console.log('ddd');
		
	})  