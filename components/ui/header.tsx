import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <div className="bg-blue-500 text-white">
      <div className="container mx-auto flex flex-row items-center justify-between py-4">
        {/* Logo on the left */}
        <div className="flex items-center">
          <Link href="/">
            <img
              src="https://i.imgur.com/2njCgIJ.png"
              alt="Flock Logo"
              width={150}
              height={50}
            />
          </Link>
        </div>

        {/* Buttons on the right */}
        <nav className="flex items-center space-x-14">
          <Link className="mr-2 border-r-[1px] border-white" href="/creator">
            <Button
              variant="link"
              size="lg"
              className="bg-none text-background-foreground w-40"
            >
              Create New Event
            </Button>
          </Link>

          {/* White line between buttons */}

          <a href="/api/auth/login" className="w-40 mx-2 ">
            {" "}
            <Button
              variant="link"
              size="lg"
              className="bg-none text-background-foreground w-40"
            >
              Login
            </Button>
          </a>
          <a href="/api/auth/logout" className="w-40">
            {" "}
            <Button
              variant="link"
              size="lg"
              className="bg-none text-background-foreground w-40"
            >
              Logout
            </Button>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Header;
