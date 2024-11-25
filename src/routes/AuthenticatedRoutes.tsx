import { UI_ROUTES } from '@/constants/routes'
import Master from '@/pages/master'
import PersistLogin from '@/utils/auth/PersistLogin'
import { Route } from 'react-router-dom'

const AuthenticatedRoutes = (
    <Route element={<PersistLogin />}>
        <Route path={UI_ROUTES.MASTER} element={<Master />}></Route>

    </Route>
)

export default AuthenticatedRoutes