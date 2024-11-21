import { useTranslation } from 'react-i18next'
// import { ThemeProvider } from './components/providers/themeProvider';
import Signin from './pages/auth/signin';
import './style/global.css'
import ThemeDataProvider from './contexts/themeContext';
import { ThemeProvider } from 'next-themes';
function App() {
  const { t } = useTranslation();
  return (
    <ThemeProvider attribute="class">
      <ThemeDataProvider >
        <Signin />
      </ThemeDataProvider>
    </ThemeProvider>
  )
}

export default App


