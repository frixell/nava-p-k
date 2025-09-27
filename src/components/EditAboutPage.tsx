import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { useAppDispatch, useAppSelector } from '../hooks';
import { 
    fetchAboutPageData, 
    updateAboutPageData, 
    updateAboutPageSeo, 
    AboutPageData 
} from '../reducers/aboutpage';
import AboutPageForm from './AboutPageForm';

const EditAboutPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data, status } = useAppSelector((state) => state.aboutpage);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAboutPageData());
        }
    }, [status, dispatch]);

    const handleSubmit = async (updatedData: AboutPageData) => {
        setIsSaving(true);
        const { seo, ...pageContent } = updatedData;

        try {
            // Dispatch both updates concurrently
            await Promise.all([
                dispatch(updateAboutPageData(pageContent as AboutPageData)).unwrap(),
                dispatch(updateAboutPageSeo(seo)).unwrap()
            ]);
            navigate('/dashboard'); // Navigate only after both are successful
        } catch (error) {
            console.error('Failed to save about page data:', error);
            // Optionally, show an error message to the user
        } finally {
            setIsSaving(false);
        }
    };

    if (status === 'loading' || !data) {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReactLoading type="spinningBubbles" color="#666665" />
            </div>
        );
    }

    return (
        <div>
            <h1>Edit About Page</h1>
            <AboutPageForm initialData={data} onSubmit={handleSubmit} isSaving={isSaving} />
        </div>
    );
};

export default EditAboutPage;