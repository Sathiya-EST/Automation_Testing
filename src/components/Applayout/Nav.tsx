import React, { useState } from 'react';
import { Popover, PopoverContent } from '../ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate
import { Button } from '../ui/button';

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const handleNavigation = (url: string) => {
    navigate(url);
    setOpenPopover(false);
  };

  return (
    <div className="py-4">
      <div className="space-y-2">
        {items.map((item) => {
          const IconComponent = item.icon;

          return (
            <div key={item.title} className="relative">
              <div className="group relative">
                <Popover>
                  <PopoverTrigger asChild>
                    {item.items && item.items.length > 0 ? (
                      <Button
                        variant={'ghost'}
                        className={`flex items-center gap-3 cursor-pointer outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out
                          ${item.isActive ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-200'}`}
                      // onClick={() => handleNavigation(item.url)}
                      >
                        <IconComponent className="w-5 h-6" />
                      </Button>
                    ) : (
                      <div
                        className={`flex items-center gap-3 cursor-pointer outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out
                          ${item.isActive ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-200'}`}
                        onClick={() => handleNavigation(item.url)}
                      >
                        <IconComponent className="w-5 h-6" />
                      </div>
                    )}
                  </PopoverTrigger>

                  {item.items && item.items.length > 0 && (
                    <PopoverContent className="flex flex-col p-2 bg-card text-cardForeground w-48">
                      {item.items.map((subItem) => (
                        <div
                          key={subItem.title}
                          className="cursor-pointer py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                          onClick={() => handleNavigation(subItem.url)}
                        >
                          {subItem.title}
                        </div>
                      ))}
                    </PopoverContent>
                  )}
                </Popover>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
