import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Input from '../Inputs/Input';
import ProfilePhotoSelector from '../Inputs/ProfilePhotoSelector';

const EditProfileForm = ({ onSave, onCancel }) => {
  const { user } = useContext(UserContext);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: null
  });

  const handleChange = (key, value) => {
    setProfileData({ ...profileData, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profileData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProfilePhotoSelector 
        image={profileData.profileImage} 
        setImage={(image) => handleChange('profileImage', image)} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={profileData.firstName}
          onChange={({ target }) => handleChange('firstName', target.value)}
          label="First Name"
          placeholder="John"
          type="text"
        />
        
        <Input
          value={profileData.lastName}
          onChange={({ target }) => handleChange('lastName', target.value)}
          label="Last Name"
          placeholder="Doe"
          type="text"
        />
        
        <Input
          value={profileData.email}
          onChange={({ target }) => handleChange('email', target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="email"
        />
        
        <Input
          value={profileData.phone}
          onChange={({ target }) => handleChange('phone', target.value)}
          label="Phone Number"
          placeholder="+1234567890"
          type="tel"
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="add-btn add-btn-fill"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;