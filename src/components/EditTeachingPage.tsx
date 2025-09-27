import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { useAppDispatch, useAppSelector } from '../hooks';
import { 
    fetchTeachingPageData, 
    updateTeachingPageSeo,
    updateTeachingItem,
    deleteTeachingItem,
    TeachingPageData,
    TeachingItem
} from '../reducers/teachingpage';
import TeachingPageForm from './TeachingPageForm';

const EditTeachingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data, status } = useAppSelector((state) => state.teachingpage);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTeachingPageData());
        }
    }, [status, dispatch]);
    
    const handleSubmit = async (updatedData: TeachingPageData) => {
        setIsSaving(true);
        const { seo, teachings } = updatedData;
        
        try {
            // Create an array of promises for all the item updates
            const updatePromises = teachings.map(item => dispatch(updateTeachingItem(item)).unwrap());
            
            await Promise.all([
                ...updatePromises,
                dispatch(updateTeachingPageSeo(seo)).unwrap()
            ]);
            
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save teaching page data:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (item: TeachingItem) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            dispatch(deleteTeachingItem(item));
        }
    }

    if (status === 'loading' || !data) {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReactLoading type="spinningBubbles" color="#666665" />
            </div>
        );
    }
    
    return (
        <div>
            <h1>Edit Teaching Page</h1>
            <TeachingPageForm initialData={data} onSubmit={handleSubmit} onDeleteItem={handleDelete} isSaving={isSaving} />
        </div>
    );
};

export default EditTeachingPage;