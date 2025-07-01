import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function DocumentIndex({ auth, documents, users }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        title: '',
        type: '',
        file: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/documents');
    };

    return (
        <AdminLayout title="Manage Documents" auth={auth}>
            <div className="space-y-6 max-w-4xl mx-auto">
                <h2 className="text-white text-2xl font-bold">📄 Upload New Document</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white/10 p-6 rounded-xl space-y-4 border border-white/20">
                    <div>
                        <label className="text-white block mb-1">Client</label>
                        <select
                            value={data.user_id}
                            onChange={(e) => setData('user_id', e.target.value)}
                            className="w-full p-2 rounded-lg bg-white/20 text-white"
                            required
                        >
                            <option value="">Select Client</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-white block mb-1">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full p-2 rounded-lg bg-white/20 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Type</label>
                        <input
                            type="text"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full p-2 rounded-lg bg-white/20 text-white"
                            placeholder="e.g. Inspection Report"
                        />
                    </div>
                    <div>
                        <label className="text-white block mb-1">File (PDF, JPG, PNG)</label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setData('file', e.target.files[0])}
                            className="w-full text-white"
                            required
                        />
                    </div>
                    <div className="text-right">
                        <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                            Upload
                        </button>
                    </div>
                </form>

                <div className="mt-10">
                    <h3 className="text-xl text-white font-semibold mb-4">📂 Uploaded Documents</h3>
                    <div className="bg-white/10 border border-white/20 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-white/10">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm text-gray-300">Title</th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-300">Client</th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-300">Type</th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-300">File</th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {documents.map(doc => (
                                    <tr key={doc.id} className="hover:bg-white/5">
                                        <td className="px-4 py-3 text-white">{doc.title}</td>
                                        <td className="px-4 py-3 text-white">{doc.user?.name}</td>
                                        <td className="px-4 py-3 text-white">{doc.type || '—'}</td>
                                        <td className="px-4 py-3 text-white">
                                            <a
                                                href={doc.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:underline text-sm"
                                            >
                                                View
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/documents/${doc.id}/delete`}
                                                method="delete"
                                                as="button"
                                                className="text-red-400 hover:text-red-300 text-sm"
                                            >
                                                Delete
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}