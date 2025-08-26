import React, { useState, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import ProfileView from '../../components/Profile/ProfileView';
import EditProfileForm from '../../components/Profile/EditProfileForm';
import { UserContext } from '../../context/userContext';
import toast from 'react-hot-toast';

const Profile = () => {
  useUserAuth();
  
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (profileData) => {
    setLoading(true);
    try {
      // The actual API call is handled in EditProfileForm
      // This is just for UI state management
      setIsEditing(false);
      // Success toast is shown in EditProfileForm
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error('Failed to save profile changes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (!user) {
    return (
      <DashboardLayout activeMenu="Profile">
        <div className="my-5 mx-auto max-w-4xl">
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="my-5 mx-auto max-w-6xl">
        {isEditing ? (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <p className="text-gray-600 text-sm">Update your personal information and preferences</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Auto-save enabled</span>
              </div>
            </div>
            <EditProfileForm
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
            />
          </div>
        ) : (
          <ProfileView onEditProfile={() => setIsEditing(true)} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;