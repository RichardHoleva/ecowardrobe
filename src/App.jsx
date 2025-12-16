import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Intro = lazy(() => import('./pages/Intro.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Wardrobe = lazy(() => import('./pages/Wardrobe.jsx'));
const AddItem = lazy(() => import('./pages/AddItem.jsx'));
const ItemDetail = lazy(() => import('./pages/ItemDetail.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));

const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    color: '#9ca3af' 
  }}>
    Loading...
  </div>
);

export default function App() {
  return (
    <>
      <div className="glow-blur glow1"></div>
      <div className="glow-blur glow2"></div>
      <div className="glow-blur glow3"></div>
      
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}