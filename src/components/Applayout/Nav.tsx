import React from 'react';
import { Popover, PopoverContent } from '../ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';

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
  return (
    <div className="py-4">
      <div className="space-y-2">
        {items.map((item) => {
          const IconComponent = item.icon;

          return (
            <div key={item.title} className="relative">
              <div className="group relative">
                <Popover>
                  <PopoverTrigger
                    className={`
                      flex items-center gap-3 cursor-pointer outline-none p-2 rounded-md hover:bg-gray-100 
                      dark:hover:bg-gray-700 transition-all duration-200 ease-in-out
                      ${item.isActive ? 'text-primary bg-primary/10' : 'text-gray-700 dark:text-gray-200'}
                    `}
                  >
                    <IconComponent className="w-5 h-6" />
                    {/* <span className="font-medium">{item.title}</span> */}
                  </PopoverTrigger>

                  {item.items && item.items.length > 0 && (
                    <PopoverContent className="flex flex-col p-2 bg-card text-cardForeground w-48">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem.title}
                          href={subItem.url}
                          className="py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        >
                          {subItem.title}
                        </a>
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
