import { useState } from 'react'
import MainContent from './components/MainContent.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 px-4 py-5 lg:px-8">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <MainContent />
        </main>
      </div>
    </div>
  )
}

export default App