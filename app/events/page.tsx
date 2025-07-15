import Link from "next/link";
import React, { Suspense } from "react";

import Pagination from "src/components/pagination/Pagination";
import { getEvents } from "src/lib/events";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const EventsGrid = dynamic(() => import("src/components/events/EventsGrid"));

async function Events({
  searchParams,
}: {
  searchParams?: Promise<{
    page: string | undefined;
    count: string | undefined;
    rows: string | undefined;
  }>;
}) {
  const sParams = await searchParams;
  const { events, count } = await getEvents({
    pageNumber: Number(sParams?.page) || 0,
    rows: Number(sParams?.rows) || 10,
  });
  if (
    !sParams?.count ||
    sParams?.count !== count.toString() ||
    !["10", "50", "100", "1000", "10000", "100000", "1000000"].includes(
      sParams?.rows || ""
    )
  ) {
    redirect(
      `/events?page=${Number(sParams?.page) || 0}&count=${count || 1}&rows=${
        sParams?.rows || "10"
      }`
    );
  }
  return <EventsGrid events={events} />;
}

async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page: string | undefined;
    count: string | undefined;
    rows: string | undefined;
  }>;
}) {
  const params = await searchParams;
  console.log(2, params?.page);

  return (
    <div className="mx-2 my-10 md:mx-10 ">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-4 text-4xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">
          Events
        </p>
        <div className="flex items-center justify-center">
          <Pagination
            currentPageNumber={Number(params?.page)}
            pagesNumber={Number(params?.count)}
            rows={params?.rows}
          />
        </div>
        <Link href={"/events/create"} className="btn">
          Add event
        </Link>
      </div>
      <Suspense fallback={<p>Featching...</p>}>
        <Events searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

export default EventsPage;
