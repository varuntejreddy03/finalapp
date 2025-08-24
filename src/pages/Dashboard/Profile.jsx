import React, { useState, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import ProfileView from '../../components/Profile/ProfileView';
import EditProfileForm from '../../components/Profile/EditProfileForm';
import { UserContext } from '../../context/userContext';
import toast from 'react-hot-toast';

const Profile = () => {
  useUserAuth();
  
  const { user, updateUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = async (profileData) => {
    try {
      // For demo purposes, we'll just update the context
      // In a real app, you'd make an API call here
      const updatedUser = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        // Handle profile image if needed
      };
      
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="my-5 mx-auto max-w-4xl">
        {isEditing ? (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
            <EditProfileForm
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
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