import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCVPageData } from '../reducers/cvpage';

const CVPage: React.FC = () => {
    const dispatch = useAppDispatch();
    
    // Select data from the Redux store using our typed hooks
    const { data, status, error } = useAppSelector((state) => state.cvpage);

    // Fetch data when the component mounts if it hasn't been fetched yet
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCVPageData());
        }
    }, [status, dispatch]);

    // Render a loading indicator while data is being fetched
    if (status === 'loading' || status === 'idle') {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReactLoading type="spinningBubbles" color="#666665" />
            </div>
        );
    }

    // Render an error message if the fetch failed
    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    // Render the main content once data is successfully loaded
    return (
        <div className="cv-page-container">
            <h1>{data?.title}</h1>
            {data?.sections.map((section) => (
                <div key={section.title} className="cv-section">
                    <h2>{section.title}</h2>
                    <ul>
                        {section.items.map((item, index) => (
                            <li key={index}>
                                <strong>{item.year}:</strong> {item.description}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default CVPage;