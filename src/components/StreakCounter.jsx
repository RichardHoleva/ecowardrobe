// src/components/StreakCounter.jsx
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabaseClient';

export default function StreakCounter() {
  const { user, profile, updateProfile } = useUser();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user || !profile) return;

    async function updateStreak() {
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = profile?.last_login_date;
      let newStreak = profile?.streak_count || 0;

      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Check if streak continues or resets
        if (lastLogin === yesterdayStr) {
          newStreak += 1;
        } else if (lastLogin !== today) {
          newStreak = 1;
        }

        // Update streak in database
        const { data, error } = await supabase
          .from('profiles')
          .update({
            streak_count: newStreak,
            last_login_date: today
          })
          .eq('id', user.id)
          .select()
          .single();

        if (!error && data) {
          updateProfile(data);
          setStreak(newStreak);
        }
      } else {
        setStreak(newStreak);
      }
    }

    updateStreak();
  }, [user, profile, updateProfile]);

  return (
    <div className="streak-counter">
      <i className="fa-solid fa-fire"></i>
      <span className="streak-number">{streak}</span>
    </div>
  );
}