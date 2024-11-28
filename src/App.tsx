import { BrowserRouter as Router, Routes } from 'react-router-dom';
import AppProviders from './contexts/AppProvider';
import UnAuthenticatedRoutes from './routes/UnAuthenticatedRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
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


