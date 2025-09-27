import React, { useEffect } from 'react';
import ReactLoading from 'react-loading';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchAboutPageData } from '../reducers/aboutpage';

const AboutPage: React.FC = () => {
    const dispatch = useAppDispatch();
    
    // Select data from the Redux store using our typed hooks
    const { data, status, error } = useAppSelector((state) => state.aboutpage);

    // Fetch data when the component mounts if it hasn't been fetched yet
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAboutPageData());
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
        <div className="about-page-container">
            {data?.imageUrl && <img src={data.imageUrl} alt={data.title} />}
            <h1>{data?.title}</h1>
            {/* Assuming the content is HTML, use dangerouslySetInnerHTML. If it's plain text, just use <p>{data?.content}</p> */}
            {data?.content && <div dangerouslySetInnerHTML={{ __html: data.content }} />}
        </div>
    );
};

export default AboutPage;