import React from 'react';

function Pagination({ currentPage, numPages, setCurrentPage }) {
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

	return <div className="pagination" style={{ textAlign: 'center', marginBottom: '15px' }}>{buttons}</div>;
}

export default Pagination;