import AppLayout from '@/components/Applayout'
import { UI_ROUTES } from '@/constants/routes'
import AccessDenied from '@/pages/auth/accessDenied'
import PageNotFound from '@/pages/auth/pageNotFound'
import Master from '@/pages/master'
import FormList from '@/pages/master/components/FormList'
import MyTableComponent from '@/pages/master/components/Test'
import CreateForm from '@/pages/master/createForm'
import DataForm from '@/pages/master/dataCreate'
import DataList from '@/pages/master/dataList'
import MasterDataCrud from '@/pages/master/dataView'
import MasterFormPreview from '@/pages/master/preview'
import PublishForm from '@/pages/master/publish'
import Settings from '@/pages/settings'
import PersistLogin from '@/utils/auth/PersistLogin'
import ProtectedRoute from '@/utils/auth/ProtectRoute'
import { Navigate, Route } from 'react-router-dom'

const AuthenticatedRoutes = (


    <Route element={<PersistLogin />}>
        <Route element={
            <AppLayout />
        }>
            {/* Master module */}
            {/* Master Form Routes */}
            <Route path={UI_ROUTES.MASTER} element={<Master />} />
            <Route path={UI_ROUTES.MASTER_FORM} element={<FormList />} />
            <Route path={UI_ROUTES.MASTER_FORM_CREATE} element={<CreateForm />} />
            <Route path={UI_ROUTES.MASTER_FORM_ACCESS} element={<MyTableComponent />} />
            <Route path={UI_ROUTES.MASTER_FORM_PUBLISH} element={<ProtectedRoute component={PublishForm} roles={['DEVELOPER']} />} />
            <Route path={UI_ROUTES.MASTER_FORM_PREVIEW} element={<MasterFormPreview />} />

            {/* Master Data Routes */}
            <Route path={UI_ROUTES.MASTER_DATA} element={<DataList />} />
            <Route path={UI_ROUTES.MASTER_DATA_CREATE} element={<DataForm />} />
            <Route path={UI_ROUTES.MASTER_DATA_CRUD} element={<MasterDataCrud />} />

            {/* Common Routes */}
            <Route path={UI_ROUTES.APP_SETTINGS} element={<Settings />} />
            <Route path={UI_ROUTES.ACCESS_DENIED} element={<AccessDenied />} />
            <Route path={UI_ROUTES.PAGE_NOT_FOUND} element={<PageNotFound />} />
            {/* <Route path="*" element={<Navigate to={UI_ROUTES.PAGE_NOT_FOUND} replace />} /> */}
            <Route path="*" element={<Navigate to={UI_ROUTES.PAGE_NOT_FOUND} replace />} />
            <Route path="/" element={<Navigate to={UI_ROUTES.MASTER} replace />} />
        </Route>
    </Route>
)

export default AuthenticatedRoutes