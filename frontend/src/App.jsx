import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import NoteDetailPage from './pages/NoteDetailPage'
import toast from 'react-hot-toast'

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('autumn');

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <div className="min-h-screen bg-base-100" data-theme={currentTheme}>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage onThemeChange={handleThemeChange} currentTheme={currentTheme} />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App