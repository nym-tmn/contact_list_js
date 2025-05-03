import { getContactParams } from '@src/utils/contacts';

export function refreshContactList(currentId: string, foundContacts: NodeListOf<HTMLDivElement>) {
	foundContacts.forEach(elem => {
		const { identifier: newId } = getContactParams(elem);

		if (currentId !== newId) {
			elem.remove();
		}
	});
}