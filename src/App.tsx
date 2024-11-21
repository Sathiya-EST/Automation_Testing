// import { useTranslation } from 'react-i18next'
// import { ThemeProvider } from './components/providers/themeProvider';
import Signin from './pages/auth/signin';
import './style/global.css'
import ThemeDataProvider from './contexts/themeContext';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import store from './store';


function App() {
  // const { t } = useTranslation();
  return (
    <ThemeProvider attribute="class">
      <ThemeDataProvider >
        <Provider store={store}>
          <Signin />
        </Provider>
      </ThemeDataProvider>
    </ThemeProvider>
  )
}

export default App


