import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Annotation from './pages/Annotation'
import AddProject from './pages/AddProject';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/annotation/:projectId" element={<Annotation />} />
        <Route path="/add-project" element={<AddProject />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App