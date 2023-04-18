const continentHeader = document.getElementById('continent-header');
const countryHeader = document.getElementById('country-header');
const regionHeader = document.getElementById('region-header');
const cityHeader = document.getElementById('city-header');
const asnHeader = document.getElementById('asn-header');
const ispHeader = document.getElementById('isp-header');
const ipTypeHeader = document.getElementById('ip-type-header');

const headers = [
	continentHeader,
	countryHeader,
	regionHeader,
	cityHeader,
	asnHeader,
	ispHeader,
	ipTypeHeader,
];

const dataRows = Array.from(document.querySelectorAll('tbody tr'));
const rowsPerPage = 50;
let currentPage = 1;

function toggleSortClass(header) {
	headers.forEach(h => {
		if (h !== header) {
			h.classList.remove('sort-asc', 'sort-desc');
			h.querySelector('i').classList.remove('fa-sort-up', 'fa-sort-down');
			h.querySelector('i').classList.add('fa-sort');
		}
	});
	const sortIcon = header.querySelector('i');
	if (header.classList.contains('sort-asc')) {
		header.classList.remove('sort-asc');
		header.classList.add('sort-desc');
		sortIcon.classList.remove('fa-sort', 'fa-sort-up');
		sortIcon.classList.add('fa-sort-down');
	} else {
		header.classList.remove('sort-desc');
		header.classList.add('sort-asc');
		sortIcon.classList.remove('fa-sort', 'fa-sort-down');
		sortIcon.classList.add('fa-sort-up');
	}
}

function sortTable(columnIndex, ascending) {
	const sortedRows = dataRows.slice().sort((a, b) => {
		const aText = a.children[columnIndex] ? a.children[columnIndex].textContent : '';
		const bText = b.children[columnIndex] ? b.children[columnIndex].textContent : '';
		if (aText < bText) return ascending ? -1 : 1;
		if (aText > bText) return ascending ? 1 : -1;
		return 0;
	});
	dataRows.forEach(row => row.remove());
	sortedRows.forEach(row => document.querySelector('tbody').appendChild(row));
}


function handleHeaderClick(event) {
	const header = event.target.closest('th');
	const columnIndex = Array.from(header.parentNode.children).indexOf(header);
	const ascending = !header.classList.contains('sort-asc');
	toggleSortClass(header);
	sortTable(columnIndex, ascending);
}


function displayPage(pageNumber) {
	currentPage = pageNumber;
	const start = (pageNumber - 1) * rowsPerPage;
	const end = start + rowsPerPage;
	dataRows.forEach(row => row.style.display = 'none');
	dataRows.slice(start, end).forEach(row => row.style.display = '');
}

function handlePageClick(event) {
	const button = event.target.closest('.page-btn');
	if (button) {
		const pageNumber = parseInt(button.dataset.page);
		displayPage(pageNumber);
		button.classList.add('active');
	}
}

headers.forEach(header => header.addEventListener('click', handleHeaderClick));
displayPage(1);
