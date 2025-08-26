import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Input from '../Inputs/Input';
import ProfilePhotoSelector from '../Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
import toast from 'react-hot-toast';
import { validateEmail } from '../../utils/helper';

const EditProfileForm = ({ onSave, onCancel }) => {
  const { user, updateUser } = useContext(UserContext);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: null
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setProfileData({ ...profileData, [key]: value });
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (profileData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);

    try {
      let profileImageUrl = user?.profileImageUrl || '';

      // Upload new profile image if selected
      if (profileData.profileImage) {
        try {
          const imageUploadResponse = await uploadImage(profileData.profileImage);
          profileImageUrl = imageUploadResponse.imageUrl || profileImageUrl;
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          toast.error('Failed to upload profile image, but profile will be updated');
        }
      }

      // Prepare update data
      const updateData = {
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        email: profileData.email.trim(),
        phone: profileData.phone.trim(),
        profileImageUrl
      };

      // Make API call to update profile
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, updateData);

      if (response.data) {
        // Update user context with new data
        const updatedUser = {
          ...user,
          ...updateData
        };
        
        updateUser(updatedUser);
        toast.success('Profile updated successfully!');
        onSave(updatedUser);
      }

    } catch (error) {
      console.error('Profile update error:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid profile data');
      } else if (error.response?.status === 409) {
        toast.error('Email already exists. Please use a different email.');
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image Selector */}
      <div className="flex justify-center">
        <ProfilePhotoSelector 
          image={profileData.profileImage} 
          setImage={(image) => handleChange('profileImage', image)}
          currentImageUrl={user?.profileImageUrl}
        />
      </div>
      
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            value={profileData.firstName}
            onChange={({ target }) => handleChange('firstName', target.value)}
            label="First Name *"
            placeholder="John"
            type="text"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        
        <div>
          <Input
            value={profileData.lastName}
            onChange={({ target }) => handleChange('lastName', target.value)}
            label="Last Name *"
            placeholder="Doe"
            type="text"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
        
        <div>
          <Input
            value={profileData.email}
            onChange={({ target }) => handleChange('email', target.value)}
            label="Email Address *"
            placeholder="john@example.com"
            type="email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        
        <div>
          <Input
            value={profileData.phone}
            onChange={({ target }) => handleChange('phone', target.value)}
            label="Phone Number *"
            placeholder="+1234567890"
            type="tel"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Profile Update Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>All fields marked with * are required</li>
          <li>Profile image should be less than 5MB</li>
          <li>Email changes may require verification</li>
          <li>Phone number should include country code</li>
        </ul>
      </div>
    </form>
  );
};

export default EditProfileForm;