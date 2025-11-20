import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RoomPreviewPage from './pages/RoomPreviewPage';
import JoinPage from './pages/JoinPage';
import DancersPage from './pages/DancersPage';
import LoginPage from './pages/LoginPage';
import MindTalkPage from './pages/MindTalkPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import VideosPage from './pages/VideosPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/room" element={<Layout><RoomPreviewPage /></Layout>} />
      <Route path="/join" element={<Layout><JoinPage /></Layout>} />
      <Route path="/dancers" element={<Layout><DancersPage /></Layout>} />
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/videos" element={<Layout><VideosPage /></Layout>} />
      <Route path="/mindtalk" element={<Layout><MindTalkPage /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
    </Routes>
  );
}

export default App;
