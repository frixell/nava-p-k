import React, { useState, useEffect, FormEvent } from 'react';
import { AboutPageData } from '../reducers/aboutpage';

interface AboutPageFormProps {
    initialData: AboutPageData;
    onSubmit: (data: AboutPageData) => void;
    onImageUpload: (file: File) => void;
    isSaving: boolean;
}

const AboutPageForm: React.FC<AboutPageFormProps> = ({ initialData, onSubmit, isSaving }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [seoKeywords, setSeoKeywords] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
            setImageUrl(initialData.imageUrl || '');
            setSeoTitle(initialData.seo?.title || '');
            setSeoDescription(initialData.seo?.description || '');
            setSeoKeywords(initialData.seo?.keyWords || '');
        }
    }, [initialData]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (newImageFile) {
            onImageUpload(newImageFile);
        }
        onSubmit({ 
            title, content, imageUrl, 
            seo: { title: seoTitle, description: seoDescription, keyWords: seoKeywords } 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="textarea"
                />
            </div>
            <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                    type="text"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="text-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="imageUpload">Upload New Image</label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files ? e.target.files[0] : null)}
                    className="text-input"
                />
            </div>

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
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    );
};

export default AboutPageForm;