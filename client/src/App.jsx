// App.jsx

import React, { useState } from 'react';
import AssignmentTable from './components/AssignmentTable';
import EmployeeTable from './components/EmployeeTable';
import ProjectTable from './components/ProjectTable';
import FloatingToggleButton from './components/FloatingToggleButton';

export default function App() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-700 text-white py-6 mb-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">Project Dashboard</h1>
      </header>

      {/* Floating toggle button */}
      <FloatingToggleButton
        showInfo={showInfo}
        onClick={() => setShowInfo(prev => !prev)}
      />

      <main className="space-y-12 px-4 pb-12">
        <AssignmentTable />
        {showInfo && (
          <>
            <EmployeeTable />
            <ProjectTable />
          </>
        )}
      </main>
    </div>
  );
}
