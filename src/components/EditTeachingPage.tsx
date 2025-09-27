import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

import { useAppDispatch, useAppSelector } from '../hooks';
import { 
    fetchTeachingPageData, 
    updateTeachingItem, 
    deleteTeachingItem,
    TeachingItem 
} from '../reducers/teachingpage';

const EditTeachingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { teachings, status } = useAppSelector((state) => state.teachingpage);
    const [editableTeachings, setEditableTeachings] = useState<TeachingItem[]>([]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTeachingPageData());
        }
    }, [status, dispatch]);

    useEffect(() => {
        setEditableTeachings(teachings);
    }, [teachings]);

    const handleInputChange = (index: number, field: keyof TeachingItem, value: string | number) => {
        const updatedTeachings = [...editableTeachings];
        (updatedTeachings[index] as any)[field] = value;
        setEditableTeachings(updatedTeachings);
    };

    const handleSave = (item: TeachingItem) => {
        dispatch(updateTeachingItem(item));
    };

    const handleDelete = (item: TeachingItem) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            dispatch(deleteTeachingItem(item));
        }
    };

    if (status === 'loading' || status === 'idle') {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReactLoading type="spinningBubbles" color="#666665" />
            </div>
        );
    }

    return (
        <div className="edit-page-container">
            <h1>Edit Teaching Page</h1>
            {/* We can add a form to add new items here later */}
            <div className="items-list">
                {editableTeachings.map((item, index) => (
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
                            <button onClick={() => handleSave(item)} className="button">Save</button>
                            <button onClick={() => handleDelete(item)} className="button button--danger">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditTeachingPage;