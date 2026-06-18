import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Annotation from './pages/Annotation'
import AddProject from './pages/AddProject';
import Credits from './pages/Credits';
import MyReviews from './pages/MyReviews';
import FindPeers from './pages/FindPeers';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        {/* <Route path="/annotation/" element={<Annotation />} /> */}
        <Route path="/annotation/:projectId" element={<Annotation />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/reviews" element={<MyReviews />} />
        <Route path="/peers" element={<FindPeers />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App