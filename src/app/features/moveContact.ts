import { getContactParams } from '@src/utils/contacts';
import { updateCounter } from '@src/utils/counters';
import { updateActiveState } from '@src/utils/dom';
import { ensureNonFalsy } from '@src/app/helpers/helpers';
import { saveToStorage } from '@src/app/localStorage';

export function moveContact(currentId: string, currentListItem: HTMLDivElement, newId: string) {
	const contactsContainer = ensureNonFalsy(
		currentListItem.nextElementSibling,
		`Cannot find container for contacts with ID data-item=${currentListItem.dataset.item}`
	);
	Array.from(contactsContainer.children)
		.forEach(elem => {
			const { currentListItem: targetListItem } = getContactParams(elem);

			if (currentId !== newId) {
				const targetContactsContainer = ensureNonFalsy(
					targetListItem.nextElementSibling,
					`Cannot find container for contacts with ID data-item=${targetListItem.dataset.item}`
				);
				targetContactsContainer.prepend(elem);
				updateActiveState(targetListItem, true);
				updateCounter(currentListItem, false);
				updateCounter(targetListItem, true);
			}
		})
	saveToStorage();
}