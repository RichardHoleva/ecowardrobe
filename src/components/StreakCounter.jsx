import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function StreakCounter() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function fetchAndUpdateStreak() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's profile with streak data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('streak_count, last_login_date')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching streak:', error);
        return;
      }

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
        await supabase
          .from('profiles')
          .update({
            streak_count: newStreak,
            last_login_date: today
          })
          .eq('id', user.id);
      }

      setStreak(newStreak);
    }

    fetchAndUpdateStreak();
  }, []);

  return (
    <div className="streak-counter">
      <i className="fa-solid fa-fire"></i>
      <span className="streak-number">{streak}</span>
    </div>
  );
}
