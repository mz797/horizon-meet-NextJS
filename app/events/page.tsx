import Link from "next/link";
import React, { Suspense } from "react";

import EventsGrid from "src/components/events/EventsGrid";
import { getEvents } from "src/lib/events";

const Events = async () => {
  const events = await getEvents();
  return <EventsGrid events={events} />;
};

async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="mx-2 my-10 md:mx-10 ">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-4 text-4xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">
          Events
        </p>
        <Link href={"/events/create"} className="btn">
          Add event
        </Link>
      </div>
      <Suspense fallback={<p>Featching...</p>}>
        <Events />
      </Suspense>
    </div>
  );
}

export default EventsPage;
