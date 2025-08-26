import React, { useState, useEffect } from "react";
import { LuUser, LuUpload, LuTrash, LuCamera } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, currentImageUrl }) => {
    const inputRef = React.useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Set initial preview URL from current user image
    useEffect(() => {
        if (currentImageUrl && !image) {
            setPreviewUrl(currentImageUrl);
        }
    }, [currentImageUrl, image]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

            setLoading(true);
            
            // Update the image state
            setImage(file);

            // Create a preview URL for the selected image
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
            setImageError(false);
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(currentImageUrl || null);
        setImageError(false);
        
        // Clear the input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const onChooseFile = () => {
        inputRef.current?.click();
    };

    const handleImageError = () => {
        setImageError(true);
        setLoading(false);
    };

    const handleImageLoad = () => {
        setImageError(false);
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center space-y-3">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            <div className="relative group">
                {!previewUrl || imageError ? (
                    // Default avatar when no image
                    <div className="w-24 h-24 flex items-center justify-center bg-purple-100 rounded-full relative border-4 border-purple-200 group-hover:border-purple-300 transition-colors">
                        <LuUser className="text-4xl text-purple-600" />
                        
                        {loading && (
                            <div className="absolute inset-0 bg-purple-100 rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        <button
                            type="button"
                            className="absolute -bottom-1 -right-1 w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                            onClick={onChooseFile}
                            title="Upload Photo"
                        >
                            <LuCamera size={16} />
                        </button>
                    </div>
                ) : (
                    // Image preview
                    <div className="relative">
                        <img
                            src={previewUrl}
                            alt="Profile preview"
                            className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 group-hover:border-purple-300 transition-colors"
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                        />
                        
                        {loading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="absolute -bottom-1 -right-1 flex gap-1">
                            <button
                                type="button"
                                className="w-7 h-7 flex items-center justify-center bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                                onClick={onChooseFile}
                                title="Change Photo"
                            >
                                <LuUpload size={12} />
                            </button>
                            
                            {image && (
                                <button
                                    type="button"
                                    className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    onClick={handleRemoveImage}
                                    title="Remove Photo"
                                >
                                    <LuTrash size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Helper text */}
            <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">
                    {previewUrl && !imageError ? 'Profile Photo' : 'Add Profile Photo'}
                </p>
                <p className="text-xs text-gray-500">
                    Click the camera icon to {previewUrl && !imageError ? 'change' : 'upload'} photo
                </p>
                <p className="text-xs text-gray-400">
                    Max size: 5MB • Formats: JPG, PNG, GIF
                </p>
            </div>

            {imageError && (
                <div className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                    Failed to load image. Please try uploading again.
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;