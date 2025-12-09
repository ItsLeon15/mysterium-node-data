import React from 'react';
import useTableData from './useTableData';
import Pagination from './Pagination';
import FilterDropdown from './FilterDropdown';
import './index.css';

function App() {
	const {
		handleSort,
		handleSearchChange,
		handleIpTypeFilterChange,
		handleCountryTypeFilterChange,
		paginatedData,
		searchQuery,
		sortField,
		sortOrder,
		currentPage,
		setCurrentPage,
		numPages,
		ipTypeFilter,
		countryTypeFilter,
		tableData,
	} = useTableData();

	return (
		<>
			<h1>Mysterium Node Data</h1>
			<form method="get">
				<div className="flex">
					<div className="mr-5">
						<label htmlFor="search">Search:</label>
						<input
							type="text"
							id="search"
							name="search"
							placeholder="Search..."
							value={searchQuery}
							onChange={handleSearchChange}
						/>
					</div>
					<FilterDropdown
						label="IP Type"
						options={[...new Set(tableData.map((row) => row.location.ip_type))]}
						selectedOption={ipTypeFilter}
						onSelectOption={handleIpTypeFilterChange}
					/>
					<FilterDropdown
						label="Country"
						options={[...new Set(tableData.map((row) => row.location.country))]}
						selectedOption={countryTypeFilter}
						onSelectOption={handleCountryTypeFilterChange}
					/>
				</div>
			</form>
			<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} numPages={numPages} />
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
					{paginatedData.map((row, index) => (
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

export default App;
