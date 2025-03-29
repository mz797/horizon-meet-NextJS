import React from "react";
import Link from "next/link";

function GuestNavbar() {
	return (
		<nav className="bg-gray-800">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className=" flex h-16 items-center justify-between">
					<div className=" inset-y-0 left-0 flex items-center sm:hidden"></div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"></div>
					<div className=" flex gap-4  pr-2  sm:ml-6 sm:pr-0">
						<Link
							className="rounded-md bg-white text-sm font-medium text-gray-900 py-2 px-3"
							href={"/login"}>
							Login
						</Link>
						<Link
							className="rounded-md bg-white text-sm font-medium text-gray-900 py-2 px-3"
							href={"/signup"}>
							Signup
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default GuestNavbar;
