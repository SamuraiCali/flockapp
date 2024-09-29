// components/Header.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md w-full">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <img
              src="https://i.imgur.com/2njCgIJ.png"
              alt="Flock Logo"
              width={150}
              height={50}
            />
          </Link>
          {/* Vertical line separator */}
          <div className="h-8 w-px bg-white mx-4" />
        </div>
        <nav className="flex space-x-4">
          <Link href="/creator">
            <Button variant="default" size="sm">
              Create New Event
            </Button>
          </Link>
          <a href="/api/auth/login" className="text-sm">
            Login
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
