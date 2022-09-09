import React, { useReducer, useCallback, useMemo } from 'react';
import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case 'SET':
			return action.ingredients;
		case 'ADD':
			return [...currentIngredients, action.ingredient];
		case 'DELETE':
			return currentIngredients.filter(ing => ing.id !== action.id);
		default:
			throw new Error('Should not get there!');
	}
};

const httpReducer = (httpState, action) => {
	switch (action.type) {
		case 'SEND':
			return { loading: true, error: null };
		case 'RESPONSE':
			return { loading: false, error: null };
		case 'ERROR':
			return { loading: false, error: action.errorData };
		case 'CLEAR':
			return { ...httpState, error: null };
		default:
			throw new Error('Should not be reached!');
	}
};

const Ingredients = () => {
	const [ingredients, dispatch] = useReducer(ingredientReducer, []);
	const [httpStatus, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
	});

	const filterIngredientsHandler = useCallback(filteredIngredients => {
		dispatch({ type: 'SET', ingredients: filteredIngredients });
	}, []);

	const addIngredientsHandler = useCallback(ingredient => {
		dispatchHttp({ type: 'SEND' });
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
				dispatchHttp({ type: 'RESPONSE' });
				return response.json();
			})
			.then(responseData => {
				dispatch({
					type: 'ADD',
					ingredient: { id: responseData.name, ...ingredient },
				});
			});
	}, []);

	const removeIngredientHandler = useCallback(ingredientId => {
		dispatchHttp({ type: 'SEND' });
		fetch(
			`https://hooks-demo-feddb-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
			{
				method: 'DELETE',
			}
		)
			.then(response => {
				dispatchHttp({ type: 'RESPONSE' });
				dispatch({ type: 'DELETE', id: ingredientId });
			})
			.catch(error => {
				dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
			});
	}, []);

	const clearErrors = useCallback(() => {
		dispatchHttp({ type: 'CLEAR' });
	}, []);

	const ingredientList = useMemo(() => {
		return (
			<IngredientList
				ingredients={ingredients}
				onRemoveItem={removeIngredientHandler}
			/>
		);
	}, [ingredients, removeIngredientHandler]);

	return (
		<div className='App'>
			{httpStatus.error && (
				<ErrorModal onClose={clearErrors}>{httpStatus.error}</ErrorModal>
			)}
			<IngredientForm
				onAddIngredient={addIngredientsHandler}
				loading={httpStatus.loading}
			/>

			<section>
				<Search onLoadIngredients={filterIngredientsHandler} />
				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;
