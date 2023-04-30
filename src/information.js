import React, { useState, useEffect } from 'react';
import './index.css';

function Information() {
	const [tableData, setTableData] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortField, setSortField] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');
	const [currentPage, setCurrentPage] = useState(1);
	const [numPages, setNumPages] = useState(1);
	const rowsPerPage = 50;

	useEffect(() => {
		fetch('data.json')
			.then(response => response.json())
			.then(data => setTableData(data))
			.catch(error => console.error(error));
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
		setNumPages(Math.max(1, Math.ceil(filteredData.length / rowsPerPage)));
	}, [searchQuery, tableData]);

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

	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;

	const startPage = Math.max(1, currentPage - 1);
	let endPage = Math.min(startPage + 5, numPages);

	if (endPage > numPages) {
		endPage = numPages;
	}

	if (numPages <= 3) {
		endPage = numPages;
	}

	const buttons = [];

	if (numPages <= 7) {
		for (let i = 1; i <= numPages; i++) {
			buttons.push(
				<button
					key={i}
					className={`page-btn ${i === currentPage ? 'active' : ''}`}
					onClick={() => setCurrentPage(i)}
				>
					{i}
				</button>
			);
		}
	} else {
		let startEllipsis = true;
		let endEllipsis = true;

		if (currentPage <= 4) {
			startEllipsis = false;
		}
		if (currentPage >= numPages - 3) {
			endEllipsis = false;
		}

		buttons.push(
			<button
				key={1}
				className={`page-btn ${1 === currentPage ? 'active' : ''}`}
				onClick={() => setCurrentPage(1)}
			>
				{1}
			</button>
		);

		if (startEllipsis) {
			buttons.push(<span key="startEllipsis">...</span>);
		}

		for (let i = currentPage - 2; i <= currentPage + 2; i++) {
			if (i < 2 || i >= numPages) {
				continue;
			}
			buttons.push(
				<button
					key={i}
					className={`page-btn ${i === currentPage ? 'active' : ''}`}
					onClick={() => setCurrentPage(i)}
				>
					{i}
				</button>
			);
		}

		if (endEllipsis) {
			buttons.push(<span key="endEllipsis">...</span>);
		}

		buttons.push(
			<button
				key={numPages}
				className={`page-btn ${numPages === currentPage ? 'active' : ''}`}
				onClick={() => setCurrentPage(numPages)}
			>
				{numPages}
			</button>
		);
	}

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1);
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
				const aValue = a.location[field] || '';
				const bValue = b.location[field] || '';
				return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			}
		});

		setTableData(sortedData);
		setSortField(field);
		setSortOrder(order);
	};

	return (
		<>
			<h1>Mysterium Node Data</h1>
			<form method="get">
				<label htmlFor="search">Search:</label>
				<input
					type="text"
					id="search"
					name="search"
					placeholder="Search..."
					value={searchQuery}
					onChange={handleSearchChange}
				/>
			</form>
			<div className="pagination" style={{ textAlign: 'center', marginBottom: '15px' }}>
				{buttons}
			</div>
			<table>
				<thead>
					<tr>
						<th id="continent-header" onClick={() => handleSort('continent')}>
							Continent
							{sortField === 'continent' && sortOrder === 'asc' && <i className="fas fa-sort-up"></i>}
							{sortField === 'continent' && sortOrder === 'desc' && <i className="fas fa-sort-down"></i>}
							{sortField !== 'continent' && <i className="fas fa-sort"></i>}
						</th>
						<th id="country-header" onClick={() => handleSort('country')}>
							Country
							{sortField === 'country' && sortOrder === 'asc' && <i className="fas fa-sort-up"></i>}
							{sortField === 'country' && sortOrder === 'desc' && <i className="fas fa-sort-down"></i>}
							{sortField !== 'country' && <i className="fas fa-sort"></i>}
						</th>
						<th id="region-header" onClick={() => handleSort('region')}>
							Region
							{sortField === 'region' && sortOrder === 'asc' && <i className="fas fa-sort-up"></i>}
							{sortField === 'region' && sortOrder === 'desc' && <i className="fas fa-sort-down"></i>}
							{sortField !== 'region' && <i className="fas fa-sort"></i>}
						</th>
						<th id="city-header" onClick={() => handleSort('city')}>
							City
							{sortField === 'city' && sortOrder === 'asc' && <i className="fas fa-sort-up"></i>}
							{sortField === 'city' && sortOrder === 'desc' && <i className="fas fa-sort-down"></i>}
							{sortField !== 'city' && <i className="fas fa-sort"></i>}
						</th>
						<th id="asn-header">ASN</th>
						<th id="isp-header" onClick={() => handleSort('isp')}>
							ISP
							{sortField === 'isp' && sortOrder === 'asc' && <i className="fas fa-sort-up"></i>}
							{sortField === 'isp' && sortOrder === 'desc' && <i className="fas fa-sort-down"></i>}
							{sortField !== 'isp' && <i className="fas fa-sort"></i>}
						</th>
						<th id="ip-type-header" onClick={() => handleSort('ip_type')}>
							IP Type
							{sortField === 'ip_type' && sortOrder === 'asc' && <i className="fas fa-sort-up"></i>}
							{sortField === 'ip_type' && sortOrder === 'desc' && <i className="fas fa-sort-down"></i>}
							{sortField !== 'ip_type' && <i className="fas fa-sort"></i>}
						</th>
						<th id="provider-id-header" onClick={() => handleSort('provider_id')}>
							Provider ID
							{sortField === 'provider_id' && sortOrder === 'asc' && <i className="fas fa-sort-up"></i>}
							{sortField === 'provider_id' && sortOrder === 'desc' && <i className="fas fa-sort-down"></i>}
							{sortField !== 'provider_id' && <i className="fas fa-sort"></i>}
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredData.slice(startIndex, endIndex).map((row, index) => (
						<tr key={index}>
							<td>{row.location.continent}</td>
							<td>{row.location.country}</td>
							<td>{row.location.region}</td>
							<td>{row.location.city}</td>
							<td>{row.location.asn}</td>
							<td>{row.location.isp}</td>
							<td>{row.location.ip_type}</td>
							<td>{row.provider_id}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

export default Information;
