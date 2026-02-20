import React from 'react';

const PolicyStatusBadge = ({ status }) => {
    const styles = {
        PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        PENDING_APPROVAL: 'bg-blue-100 text-blue-700 border-blue-200',
        ACTIVE: 'bg-green-100 text-green-700 border-green-200',
        REJECTED: 'bg-red-100 text-red-700 border-red-200',
        EXPIRED: 'bg-slate-100 text-slate-600 border-slate-200',
        CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
        INACTIVE: 'bg-slate-50 text-slate-400 border-slate-100'
    };

    const labels = {
        PENDING_PAYMENT: 'Awaiting Payment',
        PENDING_APPROVAL: 'Under Review',
        ACTIVE: 'Active',
        REJECTED: 'Rejected',
        EXPIRED: 'Expired',
        CANCELLED: 'Cancelled',
        INACTIVE: 'Inactive'
    };

    const currentStyle = styles[status] || styles.INACTIVE;
    const currentLabel = labels[status] || status;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStyle}`}>
            {currentLabel}
        </span>
    );
};

export default PolicyStatusBadge;
