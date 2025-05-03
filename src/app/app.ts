import { initializeListItems, initSearchModal } from '@src/app/init';
import { loadFromStorage } from '@src/app/localStorage';
import { setupMainHandlers } from '@src/app/handlers/mainHandlers';
import {
	clearContactsButton,
	closeSearchModalIcon,
	contactLists, foundContactsContainer,
	mainForm, searchButton, searchInput,
	searchModal,
	showAllButton
} from '@src/app/domElements';

export function initializeApp() {
	initializeListItems();
	loadFromStorage();
	initSearchModal({searchButton, searchModal, searchInput, showAllButton, foundContactsContainer, closeSearchModalIcon});
	setupMainHandlers({mainForm, contactLists, clearContactsButton});
}