import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserContext';
import { useItems } from '../context/ItemsContext';
import Navbar from '../components/Navbar';
import EditProfile from '../components/EditProfile';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile } = useUser();
  const { items } = useItems();
  const [showEditModal, setShowEditModal] = useState(false);

  const fullName = user?.user_metadata?.full_name || 'User';
  const email = user?.email || '';
  const avatarUrl = profile?.avatar_url;
  const totalItems = items.length;
  const totalWears = items.reduce((sum, item) => sum + (item.wear_count || 0), 0);
  const currentStreak = profile?.streak_count || 0;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-header">
          <button
            onClick={() => navigate(-1)}
            className="back-btn"
            aria-label="Go back"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="profile-title">Profile</h1>
          <button
            onClick={() => setShowEditModal(true)}
            className="edit-btn"
            aria-label="Edit profile"
          >
            <i className="fas fa-pen"></i>
          </button>
        </div>

        <div className="profile-avatar">
          <div className="avatar-circle">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
          <h2 className="profile-name">{fullName}</h2>
          <p className="profile-email">{email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <i className="fas fa-fire stat-icon"></i>
            <div className="stat-info">
              <span className="stat-value">{currentStreak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>

          <div className="stat-card">
            <i className="fas fa-tshirt stat-icon"></i>
            <div className="stat-info">
              <span className="stat-value">{totalItems}</span>
              <span className="stat-label">Items</span>
            </div>
          </div>

          <div className="stat-card">
            <i className="fas fa-check stat-icon"></i>
            <div className="stat-info">
              <span className="stat-value">{totalWears}</span>
              <span className="stat-label">Total Wears</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-arrow-right-from-bracket"></i>
            Log Out
          </button>
        </div>
      </div>

      {showEditModal && <EditProfile onClose={() => setShowEditModal(false)} />}
    </>
  );
}
