"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

const Pagination = ({
  currentPageNumber = 0,
  pagesNumber = 1,
  rows = "10",
}: {
  currentPageNumber?: number;
  pagesNumber?: number;
  rows?: string;
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const onPrevPageClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (currentPageNumber - 1).toString());
    router.push(pathName + "?" + params.toString());
  };
  const onNextPageClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (currentPageNumber + 1).toString());
    router.push(pathName + "?" + params.toString());
  };

  const onRowsPerPageChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("rows", event.target.value);
    router.push(pathName + "?" + params.toString());
  };

  return (
    <div className="flex justify-center items-center gap-8">
      <select
        onChange={onRowsPerPageChanged}
        id="countries"
        defaultValue={rows}
        className="cursor-pointer border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option disabled>Rows per page</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <div className="flex items-center gap-8">
        <button
          disabled={currentPageNumber === 0}
          onClick={onPrevPageClick}
          className="cursor-pointer rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <p className="text-slate-600 text-nowrap">
          Page{" "}
          <strong className="text-slate-800">{currentPageNumber + 1}</strong>{" "}
          of&nbsp;
          <strong className="text-slate-800">{pagesNumber}</strong>
        </p>

        <button
          disabled={currentPageNumber + 1 === pagesNumber}
          onClick={onNextPageClick}
          className="cursor-pointer rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
export default Pagination;
