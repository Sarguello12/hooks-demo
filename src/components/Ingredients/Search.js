import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
	const [enteredFilter, setEnteredFilter] = useState('');
	const inputRef = useRef();
	const { onLoadIngredients } = props;

	useEffect(() => {
		const timer = setTimeout(() => {
			if (enteredFilter === inputRef.current.value) {
				const query =
					enteredFilter.length === 0
						? ''
						: `?orderBy="title"&equalTo="${enteredFilter}"`;
				fetch(
					`https://hooks-demo-feddb-default-rtdb.firebaseio.com/ingredients.json${query}`
				)
					.then(response => response.json())
					.then(responseData => {
						const fetchedIngredients = [];
						for (const key in responseData) {
							fetchedIngredients.push({
								id: key,
								title: responseData[key].title,
								amount: responseData[key].amount,
							});
						}
						onLoadIngredients(fetchedIngredients);
					});
			}
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, [enteredFilter, onLoadIngredients, inputRef]);

	return (
		<section className='search'>
			<Card>
				<div className='search-input'>
					<label>Filter by Title</label>
					<input
						ref={inputRef}
						type='text'
						value={enteredFilter}
						onChange={event => setEnteredFilter(event.target.value)}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
