import { Routes, Route, Navigate } from 'react-router-dom';
import Intro from './pages/Intro.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Wardrobe from './pages/Wardrobe.jsx';
import AddItem from './pages/AddItem.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import Register from './pages/Register.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/wardrobe" element={<Wardrobe />} />
      <Route path="/add" element={<AddItem />} />
      <Route path="/item/:id" element={<ItemDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}