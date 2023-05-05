import { useEffect, useState } from 'react';

function useTableData() {
	const [tableData, setTableData] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [ipTypeFilter, setIpTypeFilter] = useState('');
	const [countryTypeFilter, setCountryTypeFilter] = useState('');
	const [sortField, setSortField] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');
	const [currentPage, setCurrentPage] = useState(1);
	const [numPages, setNumPages] = useState(1);

	useEffect(() => {
		fetch('data.json')
			.then((response) => response.json())
			.then((data) => setTableData(data))
			.catch((error) => console.error(error));
	}, []);

	useEffect(() => {
		const filteredData = tableData.filter((row) => {
			for (let key in row) {
				if (typeof row[key] === 'object' && row[key] !== null) {
					for (let subKey in row[key]) {
						if (
							row[key][subKey] &&
							row[key][subKey].toString().toLowerCase().includes(searchQuery.toLowerCase())
						) {
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
		setNumPages(Math.max(1, Math.ceil(filteredData.length / 50)));
	}, [searchQuery, tableData]);

	useEffect(() => {
		let filteredData = tableData.filter((row) => {
			let shouldInclude = true;

			if (ipTypeFilter && row.location.ip_type.toLowerCase() !== ipTypeFilter.toLowerCase()) {
				shouldInclude = false;
			}

			if (countryTypeFilter && row.location.country.toLowerCase() !== countryTypeFilter.toLowerCase()) {
				shouldInclude = false;
			}

			for (let key in row) {
				if (typeof row[key] === 'object' && row[key] !== null) {
					for (let subKey in row[key]) {
						if (
							row[key][subKey] &&
							row[key][subKey].toString().toLowerCase().includes(searchQuery.toLowerCase())
						) {
							return shouldInclude;
						}
					}
				} else {
					if (row[key] && row[key].toString().toLowerCase().includes(searchQuery.toLowerCase())) {
						return shouldInclude;
					}
				}
			}

			return false;
		});

		const sortedData = [...filteredData].sort((a, b) => {
			const aValue =
				typeof a[sortField] === 'object' && a[sortField] !== null
					? Object.values(a[sortField]).join('')
					: a[sortField];
			const bValue =
				typeof b[sortField] === 'object' && b[sortField] !== null
					? Object.values(b[sortField]).join('')
					: b[sortField];
			if (sortOrder === 'asc') {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
			} else {
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
			}
		});

		setNumPages(Math.max(1, Math.ceil(filteredData.length / 50)));
		setTableData(sortedData);
		setCurrentPage(1);
	}, [searchQuery, ipTypeFilter, countryTypeFilter, sortField, sortOrder, tableData]);

	useEffect(() => {
		const sortedData = tableData.sort((a, b) => {
			const aValue =
				typeof a[sortField] === 'object' && a[sortField] !== null
					? Object.values(a[sortField]).join('')
					: a[sortField];
			const bValue =
				typeof b[sortField] === 'object' && b[sortField] !== null
					? Object.values(b[sortField]).join('')
					: b[sortField];
			if (sortOrder === 'asc') {
				return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
			} else {
				return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
			}
		});
		setTableData(sortedData);
	}, [sortField, sortOrder, tableData]);

	const filteredData = tableData.filter((row) => {
		for (let key in row) {
			if (typeof row[key] === 'object' && row[key] !== null) {
				for (let subKey in row[key]) {
					if (
						row[key][subKey] &&
						row[key][subKey].toString().toLowerCase().includes(searchQuery.toLowerCase())
					) {
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

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1);
	};

	const handleIpTypeFilterChange = (selectedOption) => {
		if (selectedOption === 'All') {
			fetch('data.json')
				.then((response) => response.json())
				.then((data) => {
					setTableData(data);
					setIpTypeFilter('');
					setSortField('');
					setSortOrder('asc');
					setCurrentPage(1);
				})
				.catch((error) => console.error(error));
		} else {
			const filteredData = tableData.filter((row) => {
				return row.location.ip_type.toLowerCase() === selectedOption.toLowerCase();
			});
			setTableData(filteredData);
			setIpTypeFilter(selectedOption);
			setSortField('');
			setSortOrder('asc');
			setCurrentPage(1);
		}
	};

	const handleCountryTypeFilterChange = (selectedOption) => {
		if (selectedOption === 'All') {
			fetch('data.json')
				.then((response) => response.json())
				.then((data) => {
					setTableData(data);
					setCountryTypeFilter('');
					setSortField('');
					setSortOrder('asc');
					setCurrentPage(1);
				})
				.catch((error) => console.error(error));
		} else {
			const filteredData = tableData.filter((row) => {
				return row.location.country.toLowerCase() === selectedOption.toLowerCase();
			});
			setTableData(filteredData);
			setCountryTypeFilter(selectedOption);
			setSortField('');
			setSortOrder('asc');
			setCurrentPage(1);
		}
	};

	const handleSort = (field) => {
		const order = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
		const sortedData = [...filteredData].sort((a, b) => {
			if (field === 'provider_id') {
				const aValue = a.provider_id || '';
				const bValue = b.provider_id || '';
				return order === 'asc'
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			} else {
				const aValue =
					typeof a.location[field] === 'object' && a.location[field] !== null
						? Object.values(a.location[field]).join('')
						: a.location[field] || '';
				const bValue =
					typeof b.location[field] === 'object' && b.location[field] !== null
						? Object.values(b.location[field]).join('')
						: b.location[field] || '';
				return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			}
		});

		setTableData(sortedData);
		setSortField(field);
		setSortOrder(order);
	};

	const startIndex = (currentPage - 1) * 50;
	const endIndex = startIndex + 50;

	const paginatedData = filteredData.slice(startIndex, endIndex);

	return {
		handleSort,
		handleSearchChange,
		handleIpTypeFilterChange,
		handleCountryTypeFilterChange,
		ipTypeFilter,
		paginatedData,
		searchQuery,
		sortField,
		sortOrder,
		currentPage,
		setCurrentPage,
		numPages,
		tableData,
	};
}

export default useTableData;