import React, { useState } from 'react';
import { router, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useToast } from '../../../Context/ToastContext';

export default function DocumentIndex({ 
    auth, 
    documents = [], 
    users = [], 
    filters = {},
    stats = {}
}) {
    const { success, error, info } = useToast();
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        title: '',
        type: '',
        file: null
    });

    const handleFilter = (filterType, value) => {
        const params = new URLSearchParams(window.location.search);

        if (value === "all" || value === "") {
            params.delete(filterType);
        } else {
            params.set(filterType, value);
        }

        router.get(
            `/admin/documents?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSearch = (searchTerm) => {
        const params = new URLSearchParams(window.location.search);

        if (searchTerm === "") {
            params.delete("search");
        } else {
            params.set("search", searchTerm);
        }

        router.get(
            `/admin/documents?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleDocumentSelect = (documentId) => {
        setSelectedDocuments((prev) => {
            const updated = prev.includes(documentId)
                ? prev.filter((id) => id !== documentId)
                : [...prev, documentId];
            setShowBulkActions(updated.length > 0);
            return updated;
        });
    };

    const selectAllDocuments = () => {
        const allDocumentIds = documents.map((document) => document.id);
        setSelectedDocuments(
            selectedDocuments.length === allDocumentIds.length
                ? []
                : allDocumentIds
        );
        setShowBulkActions(selectedDocuments.length !== allDocumentIds.length);
    };

    const getTypeBadge = (type) => {
        const badges = {
            'inspection_report': "bg-blue-500/20 border-blue-500/30 text-blue-400",
            'contract': "bg-green-500/20 border-green-500/30 text-green-400",
            'invoice': "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
            'certificate': "bg-purple-500/20 border-purple-500/30 text-purple-400",
            'legal': "bg-red-500/20 border-red-500/30 text-red-400",
            'other': "bg-gray-500/20 border-gray-500/30 text-gray-400",
        };
        const normalizedType = type?.toLowerCase().replace(/\s+/g, '_') || 'other';
        return badges[normalizedType] || badges.other;
    };

    const getTypeIcon = (type) => {
        const icons = {
            'inspection_report': "📋",
            'contract': "📄",
            'invoice': "💳",
            'certificate': "🏆",
            'legal': "⚖️",
            'other': "📁",
        };
        const normalizedType = type?.toLowerCase().replace(/\s+/g, '_') || 'other';
        return icons[normalizedType] || icons.other;
    };

    const getFileTypeIcon = (filename) => {
        const extension = filename?.split('.').pop()?.toLowerCase();
        const icons = {
            'pdf': "📄",
            'jpg': "🖼️",
            'jpeg': "🖼️",
            'png': "🖼️",
            'doc': "📝",
            'docx': "📝",
            'xls': "📊",
            'xlsx': "📊",
        };
        return icons[extension] || "📎";
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/documents', {
            onSuccess: () => {
                success('Document uploaded successfully');
                reset();
                setShowUploadForm(false);
            },
            onError: () => {
                error('Failed to upload document');
            },
        });
    };

    const bulkDeleteDocuments = () => {
        if (selectedDocuments.length === 0) return;

        if (confirm(`Are you sure you want to delete ${selectedDocuments.length} documents?`)) {
            router.delete('/admin/documents/bulk-delete', {
                data: { document_ids: selectedDocuments },
                onSuccess: () => {
                    success(`${selectedDocuments.length} documents deleted successfully`);
                    setSelectedDocuments([]);
                    setShowBulkActions(false);
                },
                onError: () => {
                    error('Failed to delete documents');
                },
            });
        }
    };

    return (
        <AdminLayout
            title="Document Management - NWB Admin"
            auth={auth}
        >
            <div className="space-y-6">
                {/* Header */}
                <div
                    className="relative overflow-hidden rounded-3xl"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(0, 179, 186, 0.1) 0%, rgba(0, 179, 186, 0.05) 100%)",
                    }}
                >
                    <div className="absolute inset-0 opacity-10">
                        <div
                            className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                    </div>
                    <div className="relative p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-4xl font-bold text-white mb-3 flex items-center">
                                    <span className="mr-4 text-5xl">📄</span>
                                    Document Management
                                </h2>
                                <p className="text-xl text-slate-300 mb-2">
                                    Manage all client documents and file uploads
                                </p>
                                <p
                                    className="text-sm font-medium"
                                    style={{ color: "#00b3ba" }}
                                >
                                    Admin Dashboard • Document Management • File System
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowUploadForm(!showUploadForm)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Upload Document
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-white">
                            {stats.total || 0}
                        </div>
                        <div className="text-gray-300 text-sm">
                            Total Documents
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-blue-400">
                            {stats.inspection_reports || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Reports</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-green-400">
                            {stats.contracts || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Contracts</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-yellow-400">
                            {stats.invoices || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Invoices</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-purple-400">
                            {stats.certificates || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Certificates</div>
                    </div>
                </div>

                {/* Upload Form */}
                {showUploadForm && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white flex items-center">
                                <span className="mr-3 text-2xl">📤</span>
                                Upload New Document
                            </h3>
                            <button
                                onClick={() => setShowUploadForm(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Client</label>
                                <select
                                    value={data.user_id}
                                    onChange={(e) => setData('user_id', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Client</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                                {errors.user_id && <div className="text-red-400 text-sm mt-1">{errors.user_id}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Document Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter document title"
                                    required
                                />
                                {errors.title && <div className="text-red-400 text-sm mt-1">{errors.title}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Document Type</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Type</option>
                                    <option value="inspection_report">📋 Inspection Report</option>
                                    <option value="contract">📄 Contract</option>
                                    <option value="invoice">💳 Invoice</option>
                                    <option value="certificate">🏆 Certificate</option>
                                    <option value="legal">⚖️ Legal Document</option>
                                    <option value="other">📁 Other</option>
                                </select>
                                {errors.type && <div className="text-red-400 text-sm mt-1">{errors.type}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">File Upload</label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                    className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                    required
                                />
                                <div className="text-xs text-gray-400 mt-1">
                                    Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX
                                </div>
                                {errors.file && <div className="text-red-400 text-sm mt-1">{errors.file}</div>}
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadForm(false)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            Upload Document
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white mb-2">
                                Search Documents
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by title, client, type..."
                                    defaultValue={filters.search || ""}
                                    onChange={(e) => {
                                        clearTimeout(window.searchTimeout);
                                        window.searchTimeout = setTimeout(
                                            () => {
                                                handleSearch(e.target.value);
                                            },
                                            300
                                        );
                                    }}
                                    className="w-full pl-10 px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Document Type
                            </label>
                            <select
                                value={filters.type || "all"}
                                onChange={(e) =>
                                    handleFilter("type", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="inspection_report">📋 Inspection Report</option>
                                <option value="contract">📄 Contract</option>
                                <option value="invoice">💳 Invoice</option>
                                <option value="certificate">🏆 Certificate</option>
                                <option value="legal">⚖️ Legal Document</option>
                                <option value="other">📁 Other</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => router.get("/admin/documents")}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {showBulkActions && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-yellow-300 font-medium flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {selectedDocuments.length} documents selected
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={bulkDeleteDocuments}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                >
                                    Delete Selected
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedDocuments([]);
                                        setShowBulkActions(false);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {                /* Documents Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                    {documents && documents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedDocuments.length ===
                                                        documents.length &&
                                                    documents.length > 0
                                                }
                                                onChange={selectAllDocuments}
                                                className="rounded border-gray-300 bg-[#232424]"
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Document Details
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Client
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            File Info
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Upload Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {documents.map((document) => (
                                        <tr
                                            key={document.id}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDocuments.includes(
                                                        document.id
                                                    )}
                                                    onChange={() =>
                                                        handleDocumentSelect(
                                                            document.id
                                                        )
                                                    }
                                                    className="rounded border-gray-300 bg-[#232424]"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">
                                                    #{document.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">
                                                        {getTypeIcon(document.type)}
                                                    </span>
                                                    <div>
                                                        <div className="text-white font-medium">
                                                            {document.title}
                                                        </div>
                                                        <div className="text-gray-400 text-sm">
                                                            {document.description || 'No description'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                                                        {document.user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "U"}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium text-sm">
                                                            {document.user?.name ||
                                                                "Unknown User"}
                                                        </div>
                                                        <div className="text-gray-400 text-xs">
                                                            {document.user?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeBadge(
                                                        document.type
                                                    )}`}
                                                >
                                                    {document.type || 'Other'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">
                                                        {getFileTypeIcon(document.filename || document.file_url)}
                                                    </span>
                                                    <div>
                                                        <div className="text-white text-sm">
                                                            {document.filename || 'Unknown file'}
                                                        </div>
                                                        <div className="text-gray-400 text-xs">
                                                            {document.file_size ? formatFileSize(document.file_size) : 'Size unknown'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white text-sm">
                                                    {document.created_at ? formatDate(document.created_at) : 'Date unknown'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <a
                                                        href={document.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    </a>
                                                    <a
                                                        href={document.file_url}
                                                        download
                                                        className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                        </svg>
                                                    </a>
                                                    <Link
                                                        href={`/admin/documents/${document.id}/delete`}
                                                        method="delete"
                                                        as="button"
                                                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                                                        onClick={(e) => {
                                                            if (!confirm('Are you sure you want to delete this document?')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📄</div>
                            <h3 className="text-xl font-medium text-white mb-2">
                                No documents found
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {Object.values(filters).some(
                                    (filter) => filter && filter !== "all"
                                )
                                    ? "No documents match your current filters. Try adjusting your search criteria."
                                    : "No documents have been uploaded yet. Start by uploading your first document."}
                            </p>
                            <div className="flex justify-center gap-3">
                                {Object.values(filters).some(
                                    (filter) => filter && filter !== "all"
                                ) ? (
                                    <button
                                        onClick={() =>
                                            router.get("/admin/documents")
                                        }
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Clear Filters
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowUploadForm(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        Upload First Document
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination - Remove since documents is simple array */}
                {/* Commented out pagination since backend sends simple array
                {documents.last_page > 1 && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div className="text-gray-300 text-sm">
                                Showing {documents.from} to {documents.to} of{" "}
                                {documents.total} documents
                            </div>
                            <div className="flex space-x-1">
                                {documents.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                            link.active
                                                ? "text-white border"
                                                : link.url
                                                ? "text-gray-300 hover:text-white hover:bg-white/10"
                                                : "text-gray-500 cursor-not-allowed"
                                        }`}
                                        style={
                                            link.active
                                                ? {
                                                      backgroundColor:
                                                          "#00b3ba",
                                                      borderColor: "#00b3ba",
                                                  }
                                                : {}
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                */}

                {/* Document Management Guide */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Document Management Guide
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <h5 className="font-semibold text-white mb-2">
                                Document Types:
                            </h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>
                                    • 📋 <strong>Inspection Reports:</strong> Property assessments
                                </li>
                                <li>
                                    • 📄 <strong>Contracts:</strong> Legal agreements
                                </li>
                                <li>
                                    • 💳 <strong>Invoices:</strong> Billing documents
                                </li>
                                <li>
                                    • 🏆 <strong>Certificates:</strong> Certifications and awards
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-white mb-2">
                                Supported Formats:
                            </h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>
                                    • 📄 <strong>PDF:</strong> Best for reports and contracts
                                </li>
                                <li>
                                    • 🖼️ <strong>Images:</strong> JPG, JPEG, PNG
                                </li>
                                <li>
                                    • 📝 <strong>Documents:</strong> DOC, DOCX
                                </li>
                                <li>
                                    • 📊 <strong>Spreadsheets:</strong> XLS, XLSX
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-white mb-2">
                                Quick Actions:
                            </h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>
                                    • Use bulk actions for multiple documents
                                </li>
                                <li>
                                    • Filter by type for better organization
                                </li>
                                <li>• Export data for external use</li>
                                <li>• View or download documents instantly</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}