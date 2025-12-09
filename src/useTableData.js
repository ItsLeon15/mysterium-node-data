import { useEffect, useMemo, useState } from 'react';

const FALLBACK_DATA_URL = `https://corsproxy.io/?${encodeURIComponent(
	'https://discovery.mysterium.network/api/v3/proposals',
)}`;

const fetchJson = async (url) => {
	const response = await fetch(url, {
		headers: {
			Accept: 'application/json'
		}
	});
	const contentType = response.headers.get('content-type') || '';

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	const isJsonContent = contentType.includes('application/json') || contentType.includes('text/json');
	if (isJsonContent) {
		return response.json();
	}

	const bodyText = await response.text();
	try {
		return JSON.parse(bodyText);
	} catch (error) {
		const bodyPreview = bodyText.slice(0, 200);
		throw new Error(`Unexpected content type: ${contentType}; preview: ${bodyPreview}`);
	}
};

const loadData = async () => {
	const sources = [FALLBACK_DATA_URL];

	for (let i = 0; i < sources.length; i += 1) {
		try {
			return await fetchJson(sources[i]);
		} catch (error) {
			const isLast = i === sources.length - 1;
			if (isLast) {
				throw error;
			}
			console.error(`Data fetch failed for ${sources[i]}; trying next source.`, error);
		}
	}

	return [];
};

function useTableData() {
	const [tableData, setTableData] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [ipTypeFilter, setIpTypeFilter] = useState('All');
	const [countryTypeFilter, setCountryTypeFilter] = useState('All');
	const [sortField, setSortField] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');
	const [currentPage, setCurrentPage] = useState(1);
	const [lastUpdated, setLastUpdated] = useState(null);

	useEffect(() => {
		loadData()
			.then((data) => {
				setTableData(data);
				setLastUpdated(new Date());
			})
			.catch((error) => {
				console.error('Primary data fetch attempts failed.', error);
				setTableData([]);
			});
	}, []);

	const normalizeValue = (value) => (value ? value.toString().toLowerCase() : '');
	const normalizedSearch = searchQuery.trim().toLowerCase();

	const filteredData = useMemo(() => tableData.filter((row) => {
		const matchesIpType =
			ipTypeFilter === 'All' ||
			normalizeValue(row?.location?.ip_type) === ipTypeFilter.toLowerCase();

		const matchesCountry =
			countryTypeFilter === 'All' ||
			normalizeValue(row?.location?.country) === countryTypeFilter.toLowerCase();

		if (!matchesIpType || !matchesCountry) {
			return false;
		}

		if (!normalizedSearch) {
			return true;
		}

		return Object.values(row).some((value) => {
			if (value && typeof value === 'object') {
				return Object.values(value).some((nestedValue) =>
					normalizeValue(nestedValue).includes(normalizedSearch),
				);
			}

			return normalizeValue(value).includes(normalizedSearch);
		});
	}), [tableData, ipTypeFilter, countryTypeFilter, normalizedSearch]);

	const sortedData = useMemo(() => {
		if (!sortField) {
			return filteredData;
		}

		const valueAccessor = (row) => {
			if (sortField === 'provider_id') {
				return normalizeValue(row?.provider_id);
			}

			return normalizeValue(row?.location?.[sortField]);
		};

		const sorted = [...filteredData];
		sorted.sort((a, b) => {
			const aValue = valueAccessor(a);
			const bValue = valueAccessor(b);

			if (aValue === bValue) {
				return 0;
			}

			return sortOrder === 'asc' ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
		});

		return sorted;
	}, [filteredData, sortField, sortOrder]);

	const numPages = Math.max(1, Math.ceil(sortedData.length / 50));

	useEffect(() => {
		setCurrentPage((prevPage) => Math.min(prevPage, numPages));
	}, [numPages]);

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1);
	};

	const handleIpTypeFilterChange = (selectedOption) => {
		setIpTypeFilter(selectedOption);
		setCurrentPage(1);
	};

	const handleCountryTypeFilterChange = (selectedOption) => {
		setCountryTypeFilter(selectedOption);
		setCurrentPage(1);
	};

	const handleSort = (field) => {
		const order = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
		setSortField(field);
		setSortOrder(order);
	};

	const startIndex = (currentPage - 1) * 50;
	const paginatedData = sortedData.slice(startIndex, startIndex + 50);

	const ipTypeOptions = useMemo(() => {
		const baseSet =
			countryTypeFilter === 'All'
				? tableData
				: tableData.filter(
						(row) => normalizeValue(row?.location?.country) === countryTypeFilter.toLowerCase(),
				  );

		return Array.from(
			new Set(
				baseSet
					.map((row) => row?.location?.ip_type)
					.filter(Boolean),
			),
		).sort();
	}, [tableData, countryTypeFilter]);

	const countryOptions = useMemo(() => {
		const baseSet =
			ipTypeFilter === 'All'
				? tableData
				: tableData.filter(
						(row) => normalizeValue(row?.location?.ip_type) === ipTypeFilter.toLowerCase(),
				  );

		return Array.from(
			new Set(
				baseSet
					.map((row) => row?.location?.country)
					.filter(Boolean),
			),
		).sort();
	}, [tableData, ipTypeFilter]);

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
		ipTypeOptions,
		countryOptions,
		lastUpdated,
	};
}

export default useTableData;
