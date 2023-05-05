import React from 'react';
import PropTypes from 'prop-types';

function FilterDropdown({ label, options, selectedOption, onSelectOption }) {
	const handleChange = (event) => {
		const selectedOption = event.target.value;
		onSelectOption(selectedOption);
	};

	return (
		<div className="ml-5">
			<label htmlFor={`${label}-filter`}>{label}:</label>
			<select className="selectInput" id={`${label}-filter`} value={selectedOption} onChange={handleChange}>
				<option value="All">All</option>
				{options && options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}


FilterDropdown.propTypes = {
	label: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(PropTypes.string),
	selectedOption: PropTypes.string.isRequired,
	onSelectOption: PropTypes.func.isRequired,
};

export default FilterDropdown;
