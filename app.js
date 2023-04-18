const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');


const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const tableData = data.map((item) => {
	return {
		id: item.id,
		location: {
			continent: item.location.continent || '',
			country: item.location.country || '',
			region: item.location.region || '',
			city: item.location.city || '',
			postalCode: item.location.postalCode || '',
		},
		isp: item.location.isp,
		asn: item.location.asn,
		ipType: item.location.ip_type,
		provider_id: item.provider_id,
	};
});


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.get('/', function (req, res) {
	const rowsPerPage = 50;
	const currentPage = req.query.page ? parseInt(req.query.page) : 1;
	const sortField = req.query.sortField || '';
	const searchQuery = req.query.search || '';
	const sortOrder = req.query.sortOrder || 'asc';
	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;

	let filteredData = tableData.filter(function (row) {
		for (let key in row) {
			if (typeof row[key] === 'object' && row[key] !== null) {
				for (let subKey in row[key]) {
					if (row[key][subKey] && row[key][subKey].toString().toLowerCase().includes(searchQuery.toLowerCase())) {
						return true;
					}
				}
			} else {
				if (row[key] && row[key].toString().toLowerCase().includes(searchQuery.toLowerCase())) {
					return true;
				}
			}
		}
		return false;
	});


	if (sortField) {
		filteredData.sort(function (a, b) {
			if (sortOrder === 'asc') {
				return a[sortField].toString().localeCompare(b[sortField].toString());
			} else {
				return b[sortField].toString().localeCompare(a[sortField].toString());
			}
		});
	}

	const numPages = Math.ceil(filteredData.length / rowsPerPage);

	let startPage = Math.max(1, currentPage - 1);
	let endPage = Math.min(startPage + 5, numPages);

	if (endPage > numPages) {
		endPage = numPages;
	}

	if (numPages <= 3) {
		startPage = 1;
		endPage = numPages;
	}

	const buttons = [];
	for (let i = startPage; i <= endPage; i++) {
		buttons.push(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
	}

	res.render('index', {
		data: filteredData.slice(startIndex, endIndex),
		searchQuery: searchQuery,
		sortField: sortField,
		sortOrder: sortOrder,
		buttons: buttons.join(''),
		tableData: tableData.slice(startIndex, endIndex),
		currentPage,
		numPages,
		searchQuery,
		sortOrder,
		sortField,
		startPage,
		endPage,
	});
});


app.listen(80, () => console.log('Server running on port 80'));
