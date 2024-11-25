import { UI_ROUTES } from '@/constants/routes'
import LoginPage from '@/pages/auth/signin'
import { Route } from 'react-router-dom'

const UnAuthenticatedRoutes = (
    <>
        <Route path={'/*'} element={<LoginPage />}></Route>
        <Route path={UI_ROUTES.LOGIN} element={<LoginPage />}></Route>
    </>
)

export default UnAuthenticatedRoutes