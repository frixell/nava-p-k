import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { useAppDispatch, useAppSelector } from '../hooks';
import { 
    fetchCVPageData, 
    updateCVPageData, 
    updateCVPageSeo, 
    CVPageData 
} from '../reducers/cvpage';
import CVPageForm from './CVPageForm';

const EditCVPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data, status } = useAppSelector((state) => state.cvpage);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCVPageData());
        }
    }, [status, dispatch]);

    const handleSubmit = async (updatedData: CVPageData) => {
        setIsSaving(true);
        const { seo, ...pageContent } = updatedData;

        try {
            await Promise.all([
                dispatch(updateCVPageData(pageContent as Omit<CVPageData, 'seo'>)).unwrap(),
                dispatch(updateCVPageSeo(seo)).unwrap()
            ]);
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save CV page data:', error);
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
            <h1>Edit CV Page</h1>
            <CVPageForm initialData={data} onSubmit={handleSubmit} isSaving={isSaving} />
        </div>
    );
};

export default EditCVPage;