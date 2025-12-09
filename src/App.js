import React from 'react';
import FilterDropdown from './FilterDropdown';
import Pagination from './Pagination';
import useTableData from './useTableData';
import './index.css';

function App() {
	const [now, setNow] = React.useState(Date.now());

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
		ipTypeOptions,
		countryOptions,
		lastUpdated,
	} = useTableData();

	React.useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	const formatRelativeTime = (date, currentTimestamp) => {
		if (!date) return '';

		const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
		const units = [
			{ unit: 'year', ms: 1000 * 60 * 60 * 24 * 365 },
			{ unit: 'month', ms: 1000 * 60 * 60 * 24 * 30 },
			{ unit: 'week', ms: 1000 * 60 * 60 * 24 * 7 },
			{ unit: 'day', ms: 1000 * 60 * 60 * 24 },
			{ unit: 'hour', ms: 1000 * 60 * 60 },
			{ unit: 'minute', ms: 1000 * 60 },
			{ unit: 'second', ms: 1000 },
		];

		const diffMs = date.getTime() - currentTimestamp;
		for (let i = 0; i < units.length; i += 1) {
			const { unit, ms } = units[i];
			if (Math.abs(diffMs) >= ms || i === units.length - 1) {
				const value = Math.round(diffMs / ms);
				return rtf.format(value, unit);
			}
		}
		return '';
	};

	const relativeUpdatedText = lastUpdated ? formatRelativeTime(lastUpdated, now) : '';

	return (
		<>
			<h1>Mysterium Node Data</h1>
			<p style={{ marginTop: '-10px', marginBottom: '15px', textAlign: 'center' }}>
				{lastUpdated ? `Data fetched: ${relativeUpdatedText}` : 'Loading data...'}
			</p>
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
						options={ipTypeOptions}
						selectedOption={ipTypeFilter}
						onSelectOption={handleIpTypeFilterChange}
					/>
					<FilterDropdown
						label="Country"
						options={countryOptions}
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
							{sortField === 'provider_id' && sortOrder === 'desc' &&
								<i className="fas fa-sort-down"></i>}
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
