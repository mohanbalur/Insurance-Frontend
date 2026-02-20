import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import ClaimStatusBadge from '../../components/ClaimStatusBadge';
import { useNavigate } from 'react-router-dom';

const ClaimsPage = () => {
    const navigate = useNavigate();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await axiosInstance.get('/claims/my-claims');
                setClaims(response.data.data.claims || []);
            } catch (error) {
                console.error('Error fetching claims:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClaims();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1E90FF]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B1F3A]">My Claims</h1>
                    <p className="text-slate-500">Track the status of your submitted claims.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/claims/new')}
                    className="bg-[#1E90FF] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                >
                    File New Claim
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Claim Number / ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Policy</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Incident Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {claims.length > 0 ? (
                                claims.map((claim) => (
                                    <tr key={claim._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#0B1F3A]">{claim.claimNumber}</span>
                                                <span className="text-[10px] text-slate-400 font-mono uppercase">ID: {claim._id.slice(-8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-slate-600">{claim.policy?.plan?.name || 'Standard Plan'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(claim.incidentDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-[#0B1F3A]">₹{claim.amount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <ClaimStatusBadge status={claim.status} />
                                                {claim.status === 'REJECTED' && claim.adminNotes && (
                                                    <span className="text-[10px] text-red-500 font-medium max-w-[150px] truncate" title={claim.adminNotes}>
                                                        Note: {claim.adminNotes}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="text-xs font-bold text-slate-400 hover:text-[#1E90FF] transition-colors">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <p className="mb-4">No claims found.</p>
                                            <button
                                                onClick={() => navigate('/dashboard/claims/new')}
                                                className="text-[#1E90FF] font-bold underline"
                                            >
                                                File your first claim
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClaimsPage;
