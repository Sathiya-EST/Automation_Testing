import AppLayout from '@/components/Applayout'
import { UI_ROUTES } from '@/constants/routes'
import Master from '@/pages/master'
import FormList from '@/pages/master/components/FormList'
import MyTableComponent from '@/pages/master/components/Test'
import CreateForm from '@/pages/master/createForm'
import PersistLogin from '@/utils/auth/PersistLogin'
import { Route } from 'react-router-dom'

const AuthenticatedRoutes = (


    <Route element={<PersistLogin />}>
        <Route element={
            <AppLayout />
        }>
            <Route path={UI_ROUTES.MASTER} element={<Master />}>
                <Route path="form/:moduleId" element={<FormList />} />
            </Route>
            <Route path={UI_ROUTES.MASTER_FORM_CREATE} element={<CreateForm />} />
            <Route path={UI_ROUTES.MASTER_FORM_ACCESS} element={<MyTableComponent />} />
        </Route>
    </Route>
)

export default AuthenticatedRoutes