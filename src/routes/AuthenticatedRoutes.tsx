import AppLayout from '@/components/Applayout'
import { UI_ROUTES } from '@/constants/routes'
import Master from '@/pages/master'
import PersistLogin from '@/utils/auth/PersistLogin'
import { Route } from 'react-router-dom'

const AuthenticatedRoutes = (


    <Route element={<PersistLogin />}>
        <Route element={
            <AppLayout />
        }>
            <Route path={UI_ROUTES.MASTER} element={<Master />}></Route>
        </Route>
    </Route>
)

export default AuthenticatedRoutes