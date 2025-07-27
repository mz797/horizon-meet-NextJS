"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Pagination from "src/components/pagination/Pagination";
import { getEvents } from "src/lib/events";

const EventsGrid = dynamic(() => import("src/components/events/EventsGrid"), {
  ssr: false,
});

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page")) || 0;
  const count = Number(searchParams.get("count")) || 1;
  const rows = searchParams.get("rows") || "10";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const validRows = ["10", "50", "100", "1000", "10000", "25000", "50000"];

      const { events, count: realCount } = await getEvents({
        pageNumber: page,
        rows: Number(rows),
      });

      if (!count || count !== realCount || !validRows.includes(rows)) {
        router.replace(
          `/events/client?page=${page}&count=${realCount}&rows=${rows}`
        );
        return;
      }

      // @ts-ignore
      setEvents(events);
      setLoading(false);
    }

    fetchData();
  }, [page, rows, count, router]);

  return (
    <div className="mx-2 my-10 md:mx-10 ">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-4 text-4xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">
          Events
        </p>
        <div className="flex items-center justify-center">
          <Pagination
            currentPageNumber={page}
            pagesNumber={count}
            rows={rows}
          />
        </div>
        <Link href="/events/create" className="btn">
          Add event
        </Link>
      </div>

      {loading ? <p>Loading events...</p> : <EventsGrid events={events} />}
    </div>
  );
}
