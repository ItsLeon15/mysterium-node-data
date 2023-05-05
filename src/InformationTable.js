import React from 'react';

function InformationTable({ filteredData, startIndex, endIndex }) {
	return (
		<table>
			<thead>
				<tr>
					<th id="continent-header">Continent</th>
					<th id="country-header">Country</th>
					<th id="region-header">Region</th>
					<th id="city-header">City</th>
					<th id="asn-header">ASN</th>
					<th id="isp-header">ISP</th>
					<th id="ip-type-header">IP Type</th>
					<th id="provider-id-header">Provider ID</th>
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
	);
}

export default InformationTable;