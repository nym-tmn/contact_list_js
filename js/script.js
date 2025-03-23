let form = document.querySelector('.form');
form.addEventListener('submit', (event) => {

	event.preventDefault();

	const contact = {};
	contact.firstName = form.elements.firstName.value;
	contact.lastName = form.elements.lastName.value;
	contact.phone = form.elements.phone.value;

	let contactCard = document.createElement('div');
	contactCard.classList.add('contact');
	contactCard.innerHTML = `
	<div class="contact__card-info">
	<div>First name: ${contact.firstName}</div>
	<div>Last name: ${contact.lastName}</div>
	<div>Phone: ${contact.phone}</div>
	</div>
	<button class="contact__button" type="button"><img src="./img/delete_contact_card_icon.svg" alt="Delete current contact button"></button>
	`;

	document
		.querySelector(`[data-item=${contact.firstName[0].toLowerCase()}]`)
		.after(contactCard);
})