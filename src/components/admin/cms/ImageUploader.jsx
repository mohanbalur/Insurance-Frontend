import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, RefreshCw, Trash2 } from 'lucide-react';
import adminService from '../../../services/adminService';
import toast from 'react-hot-toast';

const ImageUploader = ({ value, onChange, label = 'Image', aspectRatio = 'video' }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleUpload = async (file) => {
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (JPEG, PNG, WEBP)');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        try {
            const res = await adminService.uploadMedia(file);
            const uploadedUrl = res?.data?.url || res?.data?.path;
            if (res.success && uploadedUrl) {
                onChange(uploadedUrl);
                toast.success('Image uploaded successfully');
            } else {
                throw new Error('Upload succeeded but no image URL was returned');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleUpload(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleUpload(file);
    };

    const handleDragOver = (e) => e.preventDefault();

    const removeImage = () => {
        onChange(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">{label} <span className="text-slate-400 font-normal">(Optional)</span></label>

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`relative group rounded-xl border-2 border-dashed transition-all overflow-hidden ${value ? 'border-slate-200 bg-white' : 'border-slate-200 hover:border-[#1E90FF] bg-slate-50'
                    }`}
            >
                {value ? (
                    <div className="relative">
                        <img
                            src={value}
                            alt="Preview"
                            className={`w-full h-auto object-cover max-h-48 ${aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'}`}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 bg-white rounded-lg text-[#0B1F3A] hover:text-[#1E90FF] shadow-lg transition-transform hover:scale-105"
                                title="Change Image"
                                disabled={uploading}
                            >
                                <RefreshCw size={18} className={uploading ? 'animate-spin' : ''} />
                            </button>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="p-2 bg-white rounded-lg text-red-500 hover:bg-red-50 shadow-lg transition-transform hover:scale-105"
                                title="Remove Image"
                                disabled={uploading}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full py-8 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-[#1E90FF] transition-colors"
                    >
                        {uploading ? (
                            <RefreshCw className="animate-spin text-[#1E90FF]" size={24} />
                        ) : (
                            <>
                                <Upload size={24} />
                                <div className="text-xs font-medium">Click or Drag Image to Upload</div>
                                <div className="text-[10px] text-slate-400">JPG, PNG or WEBP (Max 10MB)</div>
                            </>
                        )}
                    </button>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ImageUploader;
