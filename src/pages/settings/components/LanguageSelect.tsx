import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

// Language configuration with localized names and icons
const LANGUAGES = [
  { 
    code: 'en', 
    name: 'English', 
    flag: '🇺🇸'
  },
  { 
    code: 'fr', 
    name: 'Français', 
    flag: '🇫🇷'
  },
  { 
    code: 'ja', 
    name: 'Japanese', 
    flag: 'JA'
  }
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language);

  return (
    <Select 
      value={i18n.language} 
      onValueChange={changeLanguage}
    >
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <SelectValue placeholder="Select Language">
            {currentLanguage?.name}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="flex items-center space-x-2"
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;