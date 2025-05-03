import { contactsCollection } from '@src/stores/collections';
import { ensureNonFalsy } from '@src/app/helpers/helpers';

export function sortContacts() {
	const sortedContacts = [...contactsCollection].sort((a, b) => {

		const elemA = ensureNonFalsy(
			document.querySelector<HTMLDivElement>(`[data-json-id='${a}']`),
			`Cannot find contact with ID data-json-id=${a}`
		);

		const elemB = ensureNonFalsy(
			document.querySelector<HTMLDivElement>(`[data-json-id='${b}']`),
			`Cannot find contact with ID data-json-id=${b}`
		);

		const lastNameA = ensureNonFalsy(
			elemA.querySelector('.js-item-contacts__last-name'),
			'Cannot find element with class js-item-contacts__last-name'
		).textContent;

		const lastNameB = ensureNonFalsy(
			elemB.querySelector('.js-item-contacts__last-name'),
			'Cannot find element with class js-item-contacts__last-name'
		).textContent;

		return (
			ensureNonFalsy(
				lastNameA,
				'Cannot find element with class js- item - contacts__last - name'
			)
				.localeCompare(
					ensureNonFalsy(
						lastNameB,
						'Cannot find element with class js-item-contacts__last-name'
					)
				)
		)
	})
	return sortedContacts;
}