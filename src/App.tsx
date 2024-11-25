import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UnAuthenticatedRoutes from './routes/unAuthenticatedRoutes';
import AuthenticatedRoutes from './routes/authenticatedRoutes';
import AppProviders from './contexts/AppProvider';
function App() {
  // const { t } = useTranslation();
  return (
    <AppProviders>
      <Router>
        <Routes>
          {UnAuthenticatedRoutes}
          {AuthenticatedRoutes}
        </Routes>
      </Router>
    </AppProviders>
  )
}

export default App


