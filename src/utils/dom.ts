import { ensureNonFalsy } from '@src/app/helpers/helpers';

export function getCurrentListItem(itemKey: string) {
	const currentListItem = document.querySelector<HTMLDivElement>(`[data-item=${itemKey}]`);
	return ensureNonFalsy(currentListItem, `Cannot find contacts with ID data-item=${itemKey}`);
}

export function updateActiveState(HTMLElement: HTMLDivElement, isActive: boolean) {
	isActive
		? HTMLElement.setAttribute('data-active', 'true')
		: HTMLElement.removeAttribute('data-active');
}

export function toggleVisibility<T extends Element>(element: T) {
	element.classList.toggle('hidden');
}

export function createEditButton() {
	const editIcon = document.createElement('button');
	editIcon.setAttribute('type', 'button');
	editIcon.classList.add('item-contacts__btn', 'btn-icon', 'js-edit-contact');
	editIcon.innerHTML = `<i class='fa-solid fa-pen-to-square'></i>`;
	return editIcon;
}

export function updateEmptyState(foundContacts: NodeListOf<HTMLDivElement>) {
	const emptyElement = ensureNonFalsy(
		document.querySelector<HTMLDivElement>('.js-search-modal__empty'),
		'Cannot find empty block with class js-search-modal__empty'
	);

	const hasContacts = foundContacts.length > 0;
	emptyElement.hidden = hasContacts;
}