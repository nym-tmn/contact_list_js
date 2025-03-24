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

		let contactListItem = event.target.closest(`.contact-list__item`);
		contactListItem.nextElementSibling.hidden = !contactListItem.nextElementSibling.hidden;
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
	<button class="contact__button" type="button"><img src="./img/delete_contact_card_icon.svg" alt="Delete current contact button"></button>
	`;

	const currentItem = document.querySelector(`[data-item=${contact.firstName[0].toLowerCase()}]`);
	currentItem.classList.add('contact-list__item_active');

	countersCollection.forEach((value, key) => {
		if (key === currentItem.dataset.item) {
			countersCollection.set(key, ++value)
		}
	})

	currentItem.firstElementChild.innerText = `${countersCollection.get(currentItem.dataset.item)}`;
})
