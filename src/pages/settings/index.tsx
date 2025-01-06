import { ThemeColorToggle } from '@/components/shared/ThemeColorToggle';
import ThemeModeToggle from '@/components/shared/ThemeModeToggle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { BreadcrumbItemType } from '@/types/data';
import { useMemo } from 'react'
import LanguageSwitcher from './components/LanguageSelect';
import { useTranslation } from 'react-i18next';


const Settings = () => {
  const updatedRoutes: BreadcrumbItemType[] = useMemo(() => [
    { type: 'page', title: 'Settings', isActive: true },
  ], []);

  useBreadcrumb(updatedRoutes);
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>Preferences</CardHeader>
      <CardContent>

        <div className="grid grid-cols-4 gap-4 justify-center">
          <div className=" p-4">
            <Label>Choose Theme</Label>
          </div>
          <div className=" p-4 col-span-3">
            <ThemeModeToggle />
          </div>
          <div className=" p-4">
            <Label>Choose Color Mode</Label>
          </div>
          <div className=" p-4 col-span-3">
            <ThemeColorToggle />
          </div>
          <div className=" p-4">
            <Label>Choose Language</Label>
          </div>
          <div className=" p-4 col-span-3">
            <LanguageSwitcher />
          </div>

        </div>
      </CardContent>


    </Card>
  )
}

export default Settings