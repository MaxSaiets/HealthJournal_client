import { Outlet } from 'react-router-dom'
import Navbar from "./components/Navbar/Navbar";
import ReminderManager from "./components/Reminders/ReminderManager";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';

function App() {
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    let theme = 'light';
    if (user && user.preferences?.theme) {
      theme = user.preferences.theme;
      localStorage.setItem('selectedTheme', theme);
    } else {
      theme = localStorage.getItem('selectedTheme') || 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [user]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>
      
      <ReminderManager />
    </div>
  )
}

export default App