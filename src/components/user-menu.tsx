'use client';

import { LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useNextAuth } from '@/hooks/use-next-auth';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Loading from '@/components/custom/custom-loading';

export function UserMenu() {
  const { logout, user } = useNextAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  // Lấy chữ cái đầu của tên để làm fallback
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <>
      <Loading loading={isLoggingOut}/>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 outline-none hover:bg-gray-100 p-2 rounded-md transition text-left">
          <Avatar className="size-9">
            <AvatarFallback className="bg-[#238C98] text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start overflow-hidden">
            <p className="text-sm font-medium truncate max-w-[120px]">{user.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role || 'Admin'}</p>
          </div>
          <ChevronDown className="size-4 text-gray-600 flex-shrink-0" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.email || 'Admin User'}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
            <LogOut className="mr-2 size-4" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}