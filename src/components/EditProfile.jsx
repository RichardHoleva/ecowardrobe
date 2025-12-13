import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserContext';

export default function EditProfile({ onClose }) {
  const { user, profile, updateProfile } = useUser();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let avatarUrl = profile?.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatar')
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('avatar')
          .getPublicUrl(uploadData.path);

        avatarUrl = urlData.publicUrl;
      }

      // Update user metadata (name)
      const { error: userError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (userError) throw userError;

      // Update profile (avatar)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) throw profileError;

      updateProfile(profileData);
      setMessage('Profile updated successfully!');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-overlay" onClick={onClose}>
      <div className="edit-profile-card" onClick={(e) => e.stopPropagation()}>
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-field">
            <label>Profile Picture</label>
            <div className="image-upload">
              {avatarPreview ? (
                <div className="image-preview-box">
                  <img src={avatarPreview} alt="Avatar preview" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="remove-image-btn"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <label htmlFor="avatar-input" className="upload-btn">
                  <i className="fas fa-camera"></i> Upload Photo
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {message && (
            <p className={message.includes('success') ? 'success' : 'error'}>
              {message}
            </p>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
