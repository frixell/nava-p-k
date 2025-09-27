import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchHomepageData } from '../reducers/homepage';

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    
    // Select data from the Redux store using our typed hooks.
    // This is fully type-safe and provides autocompletion.
    const { items, status, error } = useAppSelector((state) => state.homepage);

    // Fetch data when the component mounts if it hasn't been fetched yet.
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchHomepageData());
        }
    }, [status, dispatch]);

    // Render a loading indicator while data is being fetched.
    if (status === 'loading' || status === 'idle') {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReactLoading type="spinningBubbles" color="#666665" />
            </div>
        );
    }

    // Render an error message if the fetch failed.
    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    // Render the main content once data is successfully loaded.
    return (
        <div className="homepage-container">
            <h1>Welcome to the Homepage</h1>
            {/* This is an example render. You will need to replace this with your actual JSX for displaying homepage items. */}
            {items.map((item) => (
                <div key={item.id}>
                    <h2>{item.title || 'No Title'}</h2>
                    <p>{item.description || 'No Description'}</p>
                </div>
            ))}
        </div>
    );
};

export default HomePage;