import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	console.log({ isAdmin });

	return (
		<div
			className="flex items-center justify-between h-15 sticky top-0 bg-gray-800 
      backdrop-blur-md z-10"
		>
			{/* Logo and Name (Name hidden in mobile view) */}
			<div className="flex items-center gap-2">
				<img src="/Sonic.png" className="h-24" alt="SonicVibes logo" />
			</div>

			{/* Buttons: Always next to the logo */}
			<div className="flex items-center gap-2 sm:gap-4">
				{isAdmin && (
					<Link
						to={"/admin"}
						className={cn(buttonVariants({ variant: "outline" }), "text-sm sm:text-base")}
					>
						<LayoutDashboardIcon className="size-4 mr-2" />
						Admin Dashboard
					</Link>
				)}

				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>

				<UserButton />
			</div>
		</div>
	);
};

export default Topbar;
