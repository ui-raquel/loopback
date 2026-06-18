import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Annotation from './pages/Annotation'
import AddProject from './pages/AddProject';
import Credits from './pages/Credits';

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
      </Routes>
    </BrowserRouter>
  )
}

export default App