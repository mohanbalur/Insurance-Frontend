import React from 'react';

const ClaimStatusBadge = ({ status }) => {
    const styles = {
        PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        UNDER_REVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
        APPROVED: 'bg-green-100 text-green-700 border-green-200',
        REJECTED: 'bg-red-100 text-red-700 border-red-200',
    };

    const labels = {
        PENDING: 'Pending',
        UNDER_REVIEW: 'Under Review',
        APPROVED: 'Approved',
        REJECTED: 'Rejected',
    };

    const currentStyle = styles[status] || 'bg-slate-100 text-slate-600 border-slate-200';
    const currentLabel = labels[status] || status;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStyle}`}>
            {currentLabel}
        </span>
    );
};

export default ClaimStatusBadge;
