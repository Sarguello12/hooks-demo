import React, { useEffect, useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
	const [ingredients, setIngredients] = useState([]);

	const filterIngredientsHandler = useCallback(filteredIngredients => {
		setIngredients(filteredIngredients);
	}, []);

	const addIngredientsHandler = ingredient => {
		fetch(
			'https://hooks-demo-feddb-default-rtdb.firebaseio.com/ingredients.json',
			{
				method: 'POST',
				body: JSON.stringify(ingredient),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
			.then(response => {
				return response.json();
			})
			.then(responseData => {
				setIngredients(prevIngredients => [
					...prevIngredients,
					{ id: responseData.name, ...ingredient },
				]);
			});
	};

	const removeIngredientHandler = ingredientId => {
		setIngredients(prevIngredients =>
			prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
		);
	};

	return (
		<div className='App'>
			<IngredientForm onAddIngredient={addIngredientsHandler} />

			<section>
				<Search onLoadIngredients={filterIngredientsHandler} />
				<IngredientList
					ingredients={ingredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
