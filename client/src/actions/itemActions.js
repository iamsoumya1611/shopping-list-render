import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from './types';
import axios from 'axios';

// Create an axios instance with default config
// In production, use the backend service URL from environment variable; in development, use localhost
const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = isProduction 
  ? process.env.REACT_APP_API_URL
  : 'http://localhost:5000/api';

console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL
});

export const getItems = () => dispatch => {
    dispatch(setItemsLoading());
    console.log('Fetching items from API...');
    
    // Return the Promise so we can handle it in components
    // Removed the redundant '/api' prefix since the proxy or baseURL should handle this
    return api.get('/items')
        .then(res => {
            // console.log('Received items from API:', res.data);
            dispatch({
                type: GET_ITEMS,
                payload: res.data
            });
            return res.data; // Return data for further handling
        })
        .catch(err => {
            console.error('Error fetching items:', err.response || err.message || err);
            // Show error to user with more details
            let errorMessage = 'Failed to fetch items.';
            if (err.code === 'ECONNABORTED') {
                errorMessage += ' Request timeout. Please check your network connection.';
            } else if (err.message) {
                errorMessage += ' ' + err.message;
            }
            alert(errorMessage);
            // Reset loading state even on error
            dispatch({
                type: GET_ITEMS,
                payload: []
            });
            // Re-throw the error so it can be caught by calling code
            throw err;
        });
};

export const deleteItem = id => dispatch => {
    // Removed the redundant '/api' prefix since the proxy or baseURL should handle this
    api.delete(`/items/${id}`)
        .then(res => 
            dispatch({
                type: DELETE_ITEM,
                payload: id
            })
        )
        .catch(err => {
            console.error('Error deleting item:', err.response || err.message || err);
            alert('Failed to delete item: ' + (err.message || 'Unknown error'));
        });
};

export const addItem = item => dispatch => {
    // Removed the redundant '/api' prefix since the proxy or baseURL should handle this
    api.post('/items', item)
        .then(res => 
            dispatch({
                type: ADD_ITEM,
                payload: res.data
            })
        )
        .catch(err => {
            console.error('Error adding item:', err.response || err.message || err);
            alert('Failed to add item: ' + (err.message || 'Unknown error'));
        });
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};