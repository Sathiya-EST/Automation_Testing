import { UI_ROUTES } from '@/constants/routes'
import ChangePassword from '@/pages/auth/changePassword'
import ForgotPassword from '@/pages/auth/forgotPassword'
import LoginPage from '@/pages/auth/signin'
import { Route } from 'react-router-dom'

const UnAuthenticatedRoutes = (
    <>
        {/* <Route path={'/*'} element={<LoginPage />}></Route> */}
        <Route path={UI_ROUTES.LOGIN} element={<LoginPage />}></Route>
        <Route path={UI_ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />}></Route>
        <Route path={UI_ROUTES.CHANGE_PASSWORD} element={<ChangePassword />}></Route>
    </>
)

export default UnAuthenticatedRoutes