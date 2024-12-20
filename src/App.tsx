import { BrowserRouter as Router, Routes } from 'react-router-dom';
import AppProviders from './contexts/AppProvider';
import UnAuthenticatedRoutes from './routes/UnAuthenticatedRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
function App() {
  return (
    <AppProviders>
      <Router
        future={{
          v7_startTransition: true,
        }}
      >
        <Routes>
          {UnAuthenticatedRoutes}
          {AuthenticatedRoutes}
        </Routes>
      </Router>
    </AppProviders>
  )
}

export default App


