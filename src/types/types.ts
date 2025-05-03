export interface IContact {
	firstName: string;
	lastName: string;
	phone: string;
}

export type TimeoutType = ReturnType<typeof setTimeout> | null;

export interface IEditModalForm extends HTMLFormElement {
	firstName: HTMLInputElement;
	lastName: HTMLInputElement;
	phone: HTMLInputElement;
}

export interface IHandleCloseClick {
	handleCloseClick: () => void;
	handleModalBackdropClick: (event: MouseEvent) => void;
}

export interface ICreateEditSubmitHandler extends IHandleCloseClick {
	editModalForm: IEditModalForm;
	jsonAttribute: string;
	currentIdentifier: string;
	currentListItem: HTMLDivElement;
	foundContacts: NodeListOf<HTMLDivElement>;
	closeEditModal: ({ handleCloseClick, handleModalBackdropClick }: IHandleCloseClick) => void;
}

export interface IParsedData {
	contacts: string[];
	counters: { [key: string]: number };
}

export interface IInitEditModalParams {
	editIcon: HTMLButtonElement;
	editModal: HTMLDivElement;
	closeEditModalIcon: HTMLButtonElement;
	editModalForm: IEditModalForm;
	searchInput: HTMLInputElement;
}

export interface IInitSearchModal {
	searchButton: HTMLButtonElement;
	searchModal: HTMLDivElement;
	searchInput: HTMLInputElement;
	showAllButton: HTMLButtonElement;
	foundContactsContainer: HTMLDivElement;
	closeSearchModalIcon: HTMLButtonElement;
}

export interface ISearchModalHandlers {
	searchButton: HTMLButtonElement;
	searchModal: HTMLDivElement;
	searchInput: HTMLInputElement;
	showAllButton: HTMLButtonElement;
	foundContactsContainer: HTMLDivElement;
	closeSearchModalIcon: HTMLButtonElement;
}

export interface IEditModalHandlers {
	editModal: HTMLDivElement;
	closeEditModalIcon: HTMLButtonElement;
	editModalForm: IEditModalForm;
	jsonAttribute: string;
	identifier: string;
	currentListItem: HTMLDivElement;
	currentContactData: IContact;
	searchInput: HTMLInputElement;
}

export interface IMainHandlers {
	mainForm: HTMLFormElement;
	contactLists: NodeListOf<HTMLDivElement>;
	clearContactsButton: HTMLButtonElement;
}