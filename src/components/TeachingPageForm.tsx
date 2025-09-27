import React, { useState, useEffect, FormEvent } from 'react';
import { TeachingPageData, TeachingItem } from '../reducers/teachingpage';

interface TeachingPageFormProps {
    initialData: TeachingPageData;
    onSubmit: (data: TeachingPageData) => void;
    onDeleteItem: (item: TeachingItem) => void;
    isSaving: boolean;
}

const TeachingPageForm: React.FC<TeachingPageFormProps> = ({ initialData, onSubmit, onDeleteItem, isSaving }) => {
    const [teachings, setTeachings] = useState<TeachingItem[]>([]);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [seoKeywords, setSeoKeywords] = useState('');

    useEffect(() => {
        if (initialData) {
            setTeachings(initialData.teachings || []);
            setSeoTitle(initialData.seo?.title || '');
            setSeoDescription(initialData.seo?.description || '');
            setSeoKeywords(initialData.seo?.keyWords || '');
        }
    }, [initialData]);

    const handleInputChange = (index: number, field: keyof TeachingItem, value: string | number) => {
        const updatedTeachings = teachings.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setTeachings(updatedTeachings);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            teachings,
            seo: { title: seoTitle, description: seoDescription, keyWords: seoKeywords }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            {teachings.map((item, index) => (
                <div key={item.id} className="form-section">
                    <h3>Item #{item.order}</h3>
                    <div className="form-group">
                        <label>Details</label>
                        <input
                            type="text"
                            value={item.details}
                            onChange={(e) => handleInputChange(index, 'details', e.target.value)}
                            className="text-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={item.description}
                            onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                            className="textarea"
                        />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            value={item.image}
                            onChange={(e) => handleInputChange(index, 'image', e.target.value)}
                            className="text-input"
                        />
                    </div>
                    <div className="button-group">
                        <button type="button" onClick={() => onDeleteItem(item)} className="button button--danger">Delete</button>
                    </div>
                </div>
            ))}
            
            {/* Add new item form could go here */}

            <hr />
            <h3>SEO Settings</h3>
            <div className="form-group">
                <label htmlFor="seoTitle">SEO Title</label>
                <input
                    type="text"
                    id="seoTitle"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="text-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="seoDescription">SEO Description</label>
                <textarea
                    id="seoDescription"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="textarea"
                />
            </div>
            <div className="form-group">
                <label htmlFor="seoKeywords">SEO Keywords</label>
                <input
                    type="text"
                    id="seoKeywords"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="text-input"
                />
            </div>

            <button type="submit" disabled={isSaving} className="button">
                {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
        </form>
    );
};

export default TeachingPageForm;