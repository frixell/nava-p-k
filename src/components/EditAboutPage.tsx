import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { useAppDispatch, useAppSelector } from '../hooks';
import { 
    fetchAboutPageData, 
    updateAboutPageData, 
    updateAboutPageSeo,
    uploadAboutPageImage,
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

    const handleSubmit = async (
        pageData: Omit<AboutPageData, 'imageUrl' | 'publicId'>,
        newImageFile: File | null
    ) => {
        setIsSaving(true);
        let finalData: AboutPageData = { ...data!, ...pageData };

        try {
            if (newImageFile) {
                const uploadResult = await dispatch(uploadAboutPageImage(newImageFile)).unwrap();
                finalData.imageUrl = uploadResult.secure_url;
                finalData.publicId = uploadResult.public_id;
            }

            const { seo, ...pageContent } = finalData;

            await Promise.all([
                dispatch(updateAboutPageData(pageContent as Omit<AboutPageData, 'seo'>)).unwrap(),
                dispatch(updateAboutPageSeo(seo)).unwrap()
            ]);

            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save about page data:', error);
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