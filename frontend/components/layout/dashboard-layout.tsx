'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/contexts/auth-context';
import { useWebSocket } from '@/lib/contexts/websocket-context';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  Bot, 
  Menu, 
  LogOut, 
  User,
  Users,
  Wifi,
  WifiOff
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { isConnected } = useWebSocket();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard',
    },
    ...(user?.role === 'user' ? [
      {
        name: 'Credit Profile',
        href: '/profile',
        icon: CreditCard,
        current: pathname === '/profile',
      },
    ] : []),
    {
      name: 'Disputes',
      href: '/disputes',
      icon: FileText,
      current: pathname === '/disputes',
    },
    ...(user?.role === 'user' ? [
      {
        name: 'AI Assistant',
        href: '/ai',
        icon: Bot,
        current: pathname === '/ai',
      },
    ] : []),
    ...(user?.role === 'admin' ? [
      {
        name: 'Users',
        href: '/users',
        icon: Users,
        current: pathname === '/users',
      },
    ] : []),
  ];

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={cn("flex h-full w-64 flex-col", className)}>
      <div className="flex h-16 items-center border-b px-4">
        <h1 className="text-2xl font-bold text-blue-600">Credit Veto</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                item.current
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center text-sm text-gray-600">
          {isConnected ? (
            <Wifi className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="mr-2 h-4 w-4 text-red-500" />
          )}
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Header */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}