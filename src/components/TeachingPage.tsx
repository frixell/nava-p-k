import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchTeachingPageData } from '../reducers/teachingpage';

const TeachingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    
    // Correctly select the nested data from the refactored slice
    const { data, status, error } = useAppSelector((state) => state.teachingpage);
    // Destructure teachings from data, providing a fallback empty array
    const teachings = data?.teachings || [];

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTeachingPageData());
        }
    }, [status, dispatch]);

    if (status === 'loading' || status === 'idle') {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReactLoading type="spinningBubbles" color="#666665" />
            </div>
        );
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="teaching-page-container">
            <h1>Teaching</h1>
            <div className="teachings-list">
                {teachings.map((item) => (
                    <div key={item.id} className="teaching-item">
                        <img src={item.image} alt={item.details} />
                        <h2>{item.details}</h2>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeachingPage;