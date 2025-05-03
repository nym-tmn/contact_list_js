import { ensureNonFalsy } from '@src/app/helpers/helpers';
import { countersCollection } from '@src/stores/collections';
import { updateActiveState } from '@src/utils/dom';

export function updateCounter(listItem: HTMLDivElement, shouldIncrement: boolean) {
	const itemKey = ensureNonFalsy(
		listItem.dataset.item,
		`Cannot find attribute=${listItem.dataset.item}`
	);

	const currentValue = ensureNonFalsy(
		countersCollection.get(itemKey),
		`Cannot find counter for collection with key=${itemKey}`
	);

	let newValue = shouldIncrement ? currentValue + 1 : currentValue - 1;
	countersCollection.set(itemKey, newValue);

	const counterElement = ensureNonFalsy(
		listItem.querySelector<HTMLDivElement>('.contact-list__counter'),
		`Cannot find counter for contacts with ID data-item=${listItem.dataset.item}`
	);
	counterElement.textContent = `${newValue}`;

	if (newValue === 0) updateActiveState(listItem, false);
}