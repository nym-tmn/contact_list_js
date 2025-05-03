export function clearContacts(contacts: NodeListOf<HTMLDivElement>) {
	contacts.forEach(elem => elem.remove())
}