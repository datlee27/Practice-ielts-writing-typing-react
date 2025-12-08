import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { MockTestPage } from './pages/MockTestPage';
import { CustomPromptPage } from './pages/CustomPromptPage';
import { TestReportPage } from './pages/TestReportPage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/mock-test" element={<MockTestPage />} />
      <Route path="/custom-prompt" element={<CustomPromptPage />} />
      <Route path="/report" element={<TestReportPage />} />
      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
