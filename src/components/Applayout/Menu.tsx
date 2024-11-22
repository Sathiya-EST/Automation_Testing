import { NavItem, NavMain } from "./Nav";

export function Menu({ items, ...props }: { items: NavItem[] } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <div className="flex flex-col w-16  border-gray-200 dark:border-gray-800 " {...props}>
        <div className="flex items-center justify-center  rounded-lg ">
          <NavMain items={items} />
        </div>

        <div className="p-4">
          {/* Footer content */}
        </div>
      </div>
    </>
  );
}

export default Menu;