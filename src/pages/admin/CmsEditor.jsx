import React, { useState, useEffect, useCallback } from 'react';
import {
    Globe,
    Save,
    Eye,
    EyeOff,
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Edit3,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

// New structured editors
import HeroSectionEditor from '../../components/admin/cms/HeroSectionEditor';
import FeaturesSectionEditor from '../../components/admin/cms/FeaturesSectionEditor';
import FaqSectionEditor from '../../components/admin/cms/FaqSectionEditor';
import AboutSectionEditor from '../../components/admin/cms/AboutSectionEditor';
import TeamSectionEditor from '../../components/admin/cms/TeamSectionEditor';
import CareersSectionEditor from '../../components/admin/cms/CareersSectionEditor';
import NewsSectionEditor from '../../components/admin/cms/NewsSectionEditor';
import PressSectionEditor from '../../components/admin/cms/PressSectionEditor';
import CustomJsonEditor from '../../components/admin/cms/CustomJsonEditor';
import AdvancedJsonToggle from '../../components/admin/cms/AdvancedJsonToggle';

// ─── Known pages that can be managed ──────────────────────────────────────────
const KNOWN_PAGES = [
    { key: 'home', label: 'Home Page' },
    { key: 'about', label: 'About Page' },
    { key: 'plans', label: 'Plans Page' },
    { key: 'contact', label: 'Contact Page' },
];

const SECTION_TYPES = ['hero', 'features', 'faq', 'about', 'team', 'careers', 'news', 'press', 'custom'];

// ─── Section type badge colours ────────────────────────────────────────────────
const TYPE_COLORS = {
    hero: 'bg-purple-100 text-purple-700',
    features: 'bg-blue-100 text-blue-700',
    faq: 'bg-amber-100 text-amber-700',
    about: 'bg-cyan-100 text-cyan-700',
    team: 'bg-indigo-100 text-indigo-700',
    careers: 'bg-emerald-100 text-emerald-700',
    news: 'bg-rose-100 text-rose-700',
    press: 'bg-orange-100 text-orange-700',
    custom: 'bg-slate-100 text-slate-600',
};

// ─── Add Section Modal ─────────────────────────────────────────────────────────
const AddSectionModal = ({ onAdd, onClose }) => {
    const [form, setForm] = useState({
        type: 'hero',
        title: '',
        order: 0,
        isActive: true,
        content: {},
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            toast.error('Section title is required');
            return;
        }
        onAdd(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2">
                        <Plus size={20} className="text-[#1E90FF]" /> Add New Section
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-xl font-bold">×</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Section Type</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                        >
                            {SECTION_TYPES.map(t => (
                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                            placeholder="e.g. Hero Banner"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
                        <input
                            type="number"
                            value={form.order}
                            onChange={(e) => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-slate-700">Active</label>
                        <button
                            type="button"
                            onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                            className={`text-2xl transition-colors ${form.isActive ? 'text-green-500' : 'text-slate-300'}`}
                        >
                            {form.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-2 rounded-xl bg-[#1E90FF] text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
                            Add Section
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Section Editor Card ───────────────────────────────────────────────────────
const SectionCard = ({ section, index, total, onUpdate, onDelete, onMove }) => {
    const [expanded, setExpanded] = useState(false);
    const [editorMode, setEditorMode] = useState('structured'); // 'structured' or 'json'

    const handleContentChange = (newContent) => {
        onUpdate(section.sectionId, { content: newContent });
    };

    return (
        <div className={`border rounded-2xl shadow-sm transition-all overflow-hidden ${section.isActive ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
            {/* Section Header */}
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${TYPE_COLORS[section.type] || 'bg-slate-100 text-slate-600'}`}>
                        {section.type}
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-[#0B1F3A]">{section.title || 'Untitled Section'}</p>
                        <p className="text-xs text-slate-500">Order: {section.order}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {/* Active toggle */}
                    <button
                        onClick={() => onUpdate(section.sectionId, { isActive: !section.isActive })}
                        className={`p-2 rounded-lg transition-colors ${section.isActive ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'}`}
                        title={section.isActive ? 'Deactivate' : 'Activate'}
                    >
                        {section.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    {/* Move up */}
                    <button
                        onClick={() => onMove(index, -1)}
                        disabled={index === 0}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronUp size={16} />
                    </button>
                    {/* Move down */}
                    <button
                        onClick={() => onMove(index, 1)}
                        disabled={index === total - 1}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronDown size={16} />
                    </button>
                    {/* Edit */}
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className={`p-2 rounded-lg transition-colors ${expanded ? 'text-[#1E90FF] bg-blue-50' : 'text-slate-400 hover:text-[#1E90FF] hover:bg-blue-50'}`}
                    >
                        <Edit3 size={16} />
                    </button>
                    {/* Delete */}
                    <button
                        onClick={() => {
                            if (confirm(`Delete section "${section.title}"?`)) onDelete(section.sectionId);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Expanded Editor */}
            {expanded && (
                <div className="border-t border-slate-100 px-6 py-5 space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-700">Display Title</label>
                            <input
                                type="text"
                                defaultValue={section.title}
                                onBlur={(e) => onUpdate(section.sectionId, { title: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-700">Sort Order</label>
                            <input
                                type="number"
                                defaultValue={section.order}
                                onBlur={(e) => onUpdate(section.sectionId, { order: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        {editorMode === 'json' || section.type === 'custom' ? (
                            <CustomJsonEditor
                                value={section.content}
                                onChange={handleContentChange}
                            />
                        ) : (
                            <>
                                {section.type === 'hero' && (
                                    <HeroSectionEditor
                                        content={section.content}
                                        onChange={handleContentChange}
                                    />
                                )}
                                {section.type === 'features' && (
                                    <FeaturesSectionEditor
                                        content={section.content}
                                        onChange={handleContentChange}
                                    />
                                )}
                                {section.type === 'faq' && (
                                    <FaqSectionEditor
                                        content={section.content}
                                        onChange={handleContentChange}
                                    />
                                )}
                                {section.type === 'about' && (
                                    <AboutSectionEditor
                                        content={section.content}
                                        onChange={handleContentChange}
                                    />
                                )}
                                {section.type === 'team' && (
                                    <TeamSectionEditor
                                        content={section.content}
                                        onChange={handleContentChange}
                                    />
                                )}
                                {section.type === 'careers' && (
                                    <CareersSectionEditor
                                        content={section.content}
                                        onChange={handleContentChange}
                                    />
                                )}
                                {section.type === 'news' && (
                                    <NewsSectionEditor
                                        content={section.content}
                                        onChange={handleContentChange}
                                    />
                                )}
                                {section.type === 'press' && (
                                    <PressSectionEditor
                                        content={section.content}
                                        onChange={handleContentChange}
                                    />
                                )}
                            </>
                        )}

                        {section.type !== 'custom' && (
                            <AdvancedJsonToggle
                                mode={editorMode}
                                onChange={setEditorMode}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main CmsEditor Page ───────────────────────────────────────────────────────
const CmsEditor = () => {
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState('home');
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Load list of existing pages
    useEffect(() => {
        adminService.listCmsPages()
            .then(res => {
                if (res.success) setPages(res.data.pages || []);
            })
            .catch(() => { });
    }, []);

    // Load selected page
    const loadPage = useCallback(async (key) => {
        setLoading(true);
        setPageData(null);
        try {
            const res = await adminService.getCmsPage(key);
            if (res.success) {
                setPageData(res.data.page);
            }
        } catch (err) {
            if (err?.response?.status === 404) {
                // Page doesn't exist yet — start blank
                setPageData({ pageKey: key, title: KNOWN_PAGES.find(p => p.key === key)?.label || key, sections: [] });
            } else {
                toast.error('Failed to load CMS page');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPage(selectedPage);
    }, [selectedPage, loadPage]);

    // Save entire page
    const handleSave = async () => {
        if (!pageData) return;
        setSaving(true);
        try {
            await adminService.updateCmsPage(selectedPage, {
                title: pageData.title,
                sections: pageData.sections,
            });
            toast.success('Page saved successfully');
            setLastSaved(new Date());
        } catch {
            toast.error('Failed to save page');
        } finally {
            setSaving(false);
        }
    };

    // Add section (via API)
    const handleAddSection = async (sectionData) => {
        try {
            const res = await adminService.addCmsSection(selectedPage, sectionData);
            if (res.success) {
                setPageData(res.data.page);
                toast.success('Section added');
                setShowAddModal(false);
            }
        } catch {
            toast.error('Failed to add section');
        }
    };

    // Update section (via API)
    const handleUpdateSection = async (sectionId, updates) => {
        try {
            const res = await adminService.updateCmsSection(selectedPage, sectionId, updates);
            if (res.success) {
                setPageData(res.data.page);
                toast.success('Section updated');
            }
        } catch (error) {
            toast.error('Failed to update section');
        }
    };

    // Delete section (via API)
    const handleDeleteSection = async (sectionId) => {
        try {
            const res = await adminService.deleteCmsSection(selectedPage, sectionId);
            if (res.success) {
                setPageData(res.data.page);
                toast.success('Section deleted');
            }
        } catch {
            toast.error('Failed to delete section');
        }
    };

    // Reorder sections locally then save
    const handleMove = async (index, direction) => {
        if (!pageData) return;
        const sections = [...pageData.sections];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= sections.length) return;

        // Swap order values
        const temp = sections[index].order;
        sections[index] = { ...sections[index], order: sections[newIndex].order };
        sections[newIndex] = { ...sections[newIndex], order: temp };
        sections.sort((a, b) => (a.order || 0) - (b.order || 0));

        setPageData(prev => ({ ...prev, sections }));

        // Persist via full page update
        try {
            await adminService.updateCmsPage(selectedPage, { title: pageData.title, sections });
        } catch {
            toast.error('Failed to reorder sections');
        }
    };

    const activeSections = pageData?.sections?.filter(s => s.isActive) || [];
    const allSections = pageData?.sections || [];

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2">
                        <Globe className="text-[#1E90FF]" size={24} />
                        CMS Editor
                    </h1>
                    <p className="text-slate-700 text-sm mt-1">Control public website content. Changes go live immediately after save.</p>
                </div>
                <div className="flex items-center gap-3">
                    {lastSaved && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle size={12} /> Saved {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={() => setPreviewMode(p => !p)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${previewMode ? 'bg-blue-50 border-[#1E90FF] text-[#1E90FF]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                        {previewMode ? 'Exit Preview' : 'Live Preview'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !pageData}
                        className="px-5 py-2 bg-[#1E90FF] text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Saving...' : 'Save Page'}
                    </button>
                </div>
            </div>

            {/* Page Selector */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Select Page to Edit</label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="w-full md:w-72 px-3 py-2 rounded-xl border border-slate-200 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                    >
                        {KNOWN_PAGES.map(p => (
                            <option key={p.key} value={p.key}>{p.label}</option>
                        ))}
                        {/* Also show any pages from DB not in KNOWN_PAGES */}
                        {pages
                            .filter(p => !KNOWN_PAGES.find(kp => kp.key === p.pageKey))
                            .map(p => (
                                <option key={p.pageKey} value={p.pageKey}>{p.pageKey}</option>
                            ))
                        }
                    </select>
                </div>
                {pageData && (
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span><span className="font-bold text-[#0B1F3A]">{allSections.length}</span> total sections</span>
                        <span><span className="font-bold text-green-700">{activeSections.length}</span> active</span>
                    </div>
                )}
            </div>

            {/* Preview Mode Banner */}
            {
                previewMode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
                        <AlertCircle size={20} className="text-[#1E90FF] shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-[#0B1F3A]">Live Preview Mode</p>
                            <p className="text-xs text-slate-700">
                                Open <a href="/" target="_blank" rel="noopener noreferrer" className="text-[#1E90FF] underline">the public website</a> in a new tab to see live changes after saving.
                            </p>
                        </div>
                    </div>
                )
            }

            {/* Sections Editor */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#0B1F3A]">
                        Page Sections — <span className="text-[#1E90FF]">{KNOWN_PAGES.find(p => p.key === selectedPage)?.label || selectedPage}</span>
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        disabled={!pageData}
                        className="px-4 py-2 bg-[#0B1F3A] text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        <Plus size={16} /> Add Section
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E90FF]" />
                        </div>
                    ) : !pageData ? (
                        <div className="text-center py-12 text-slate-400">Select a page to begin editing.</div>
                    ) : allSections.length === 0 ? (
                        <div className="text-center py-12">
                            <Globe size={40} className="text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 text-sm">No sections yet.</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="mt-4 px-5 py-2 bg-[#1E90FF] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
                            >
                                Add First Section
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {allSections.map((section, idx) => (
                                <SectionCard
                                    key={section.sectionId}
                                    section={section}
                                    index={idx}
                                    total={allSections.length}
                                    onUpdate={handleUpdateSection}
                                    onDelete={handleDeleteSection}
                                    onMove={handleMove}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Section Modal */}
            {
                showAddModal && (
                    <AddSectionModal
                        onAdd={handleAddSection}
                        onClose={() => setShowAddModal(false)}
                    />
                )
            }
        </div >
    );
};

export default CmsEditor;
