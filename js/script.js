const countersCollection = new Map();

document.querySelectorAll('.contact-list__item')
	.forEach((elem) => {

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

document.querySelectorAll('.contact-list').forEach((elem) => {
	elem.addEventListener('click', (event) => {

		const contactListItem = event.target.closest('.contact-list__item');
		if (event.target === contactListItem) {
			contactListItem.nextElementSibling.hidden = !contactListItem.nextElementSibling.hidden;
			return;
		}

		const deleteButton = event.target.closest('.contact__button-img');
		if (event.target === deleteButton) {
			const currentItem = event.target.parentElement.parentElement.parentElement.previousElementSibling;
			const currentContact = event.target.parentElement.parentElement;

			countersCollection.forEach((value, key) => {
				if (key === currentItem.dataset.item) {
					countersCollection.set(key, --value);
					if (value === 0) currentItem.classList.remove('contact-list__item_active');
				}
			})

			currentItem.firstElementChild.innerText = `${countersCollection.get(currentItem.dataset.item)}`
			currentContact.remove();
		}
	})
})

const form = document.querySelector('.form');
form.addEventListener('submit', (event) => {

	event.preventDefault();

	const contact = {};
	contact.firstName = form.elements.firstName.value;
	contact.lastName = form.elements.lastName.value;
	contact.phone = form.elements.phone.value;

	const contactCard = document.createElement('div');
	contactCard.classList.add('contact');
	contactCard.innerHTML = `
	<div class="contact__info">
	<div>First name: ${contact.firstName}</div>
	<div>Last name: ${contact.lastName}</div>
	<div>Phone: ${contact.phone}</div>
	</div>
	<button class="contact__button" type="button"><img class="contact__button-img" src="./img/delete_contact_card_icon.svg" alt="Delete current contact button"></button>
	`;

	const currentItem = document.querySelector(`[data-item=${contact.firstName[0].toLowerCase()}]`);
	currentItem.classList.add('contact-list__item_active');
	currentItem.nextElementSibling.prepend(contactCard);

	countersCollection.forEach((value, key) => {
		if (key === currentItem.dataset.item) {
			countersCollection.set(key, ++value)
		}
	})

	currentItem.firstElementChild.innerText = `${countersCollection.get(currentItem.dataset.item)}`;
})
