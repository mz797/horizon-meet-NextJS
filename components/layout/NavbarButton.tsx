"use client";

import React from "react";
import { useFormStatus } from "react-dom";

function NavbarButton({ label }: { label: string }) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			className="rounded-md bg-white text-sm font-medium text-gray-900 py-2 px-3">
			{pending ? "Pending..." : label}
		</button>
	);
}

export default NavbarButton;
