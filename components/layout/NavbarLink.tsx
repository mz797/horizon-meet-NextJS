"use client";

import Link, { LinkProps } from "next/link";
import React, { FC, HTMLProps } from "react";
import { usePathname } from "next/navigation";

const NavbarLink: FC<LinkProps & HTMLProps<HTMLAnchorElement>> = ({
  children,
  href,
  ...rest
}) => {
  const path = usePathname();
  console.log(5, path, href);
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 text-white ${
        path === href ? "bg-gray-700 hover:text-white" : ""
      }`}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default NavbarLink;
