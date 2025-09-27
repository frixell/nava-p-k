import React, { useState, useEffect, FormEvent } from 'react';
import { CVPageData, CVSection, CVItem } from '../reducers/cvpage';

interface CVPageFormProps {
    initialData: CVPageData;
    onSubmit: (data: CVPageData) => void;
    isSaving: boolean;
}

const CVPageForm: React.FC<CVPageFormProps> = ({ initialData, onSubmit, isSaving }) => {
    const [title, setTitle] = useState('');
    const [sections, setSections] = useState<CVSection[]>([]);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [seoKeywords, setSeoKeywords] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setSections(initialData.sections || []);
            setSeoTitle(initialData.seo?.title || '');
            setSeoDescription(initialData.seo?.description || '');
            setSeoKeywords(initialData.seo?.keyWords || '');
        }
    }, [initialData]);

    const handleSectionChange = (index: number, field: keyof CVSection, value: any) => {
        const newSections = [...sections];
        (newSections[index] as any)[field] = value;
        setSections(newSections);
    };

    const handleItemChange = (sectionIndex: number, itemIndex: number, field: keyof CVItem, value: string) => {
        const newSections = [...sections];
        newSections[sectionIndex].items[itemIndex][field] = value;
        setSections(newSections);
    };

    const addSection = () => {
        setSections([...sections, { title: '', items: [] }]);
    };

    const addItem = (sectionIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].items.push({ year: '', description: '' });
        setSections(newSections);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ 
            title, sections,
            seo: { title: seoTitle, description: seoDescription, keyWords: seoKeywords }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
                <label htmlFor="pageTitle">Page Title</label>
                <input
                    type="text"
                    id="pageTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-input"
                />
            </div>

            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="cv-form-section">
                    <h3>Section {sectionIndex + 1}</h3>
                    <div className="form-group">
                        <label>Section Title</label>
                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                            className="text-input"
                        />
                    </div>
                    {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="cv-form-item">
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="text"
                                    value={item.year}
                                    onChange={(e) => handleItemChange(sectionIndex, itemIndex, 'year', e.target.value)}
                                    className="text-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(sectionIndex, itemIndex, 'description', e.target.value)}
                                    className="text-input"
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={() => addItem(sectionIndex)} className="button button--secondary">
                        Add Item to Section
                    </button>
                </div>
            ))}

            <button type="button" onClick={addSection} className="button button--secondary">
                Add Section
            </button>

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

            <hr />

            <button type="submit" disabled={isSaving} className="button">
                {isSaving ? 'Saving...' : 'Save CV Changes'}
            </button>
        </form>
    );
};

export default CVPageForm;