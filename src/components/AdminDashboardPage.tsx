import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>From here you can manage the website content.</p>
            <nav>
                <ul>
                    {/* We will add links to edit pages here later */}
                    <li><Link to="/edit-about">Edit About Page</Link></li>
                    <li><Link to="/edit-cv">Edit CV Page</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminDashboardPage;