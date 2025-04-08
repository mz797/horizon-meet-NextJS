import React, { Suspense } from "react";
import Pagination from "src/components/pagination/Pagination";
import { getEvents } from "src/lib/events";
import { redirect } from "next/navigation";
import EventsGrid from "src/components/events/EventsGrid";
import { getRegistrationByUserId } from "src/lib/registrations";
import { verifySession } from "src/lib/dal";

async function Events() {
  const { userId } = await verifySession();
  if (!userId) redirect("/login");
  const events = await getRegistrationByUserId(userId);
  // if (
  //   !sParams?.count ||
  //   sParams?.count !== count.toString() ||
  //   !["10", "25", "50", "100"].includes(sParams?.rows || "")
  // ) {
  //   redirect(
  //     `/retistrations?page=${Number(sParams?.page) || 0}&count=${
  //       count || 1
  //     }&rows=${sParams?.rows || "10"}`
  //   );
  // }
  return <EventsGrid events={events} />;
}

const RegistrationPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{
    page: string | undefined;
    count: string | undefined;
    rows: string | undefined;
  }>;
}) => {
  const params = await searchParams;
  console.log(params?.page);

  return (
    <div className="mx-2 my-10 md:mx-10 ">
      <div className="flex flex-row justify-between items-center">
        <p className="mb-4 text-4xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">
          Events you're registered in
        </p>
      </div>
      <Suspense fallback={<p>Featching...</p>}>
        <Events />
        {/*<div className="flex items-center justify-center">*/}
        {/*  <Pagination*/}
        {/*    currentPageNumber={Number(params?.page)}*/}
        {/*    pagesNumber={Number(params?.count)}*/}
        {/*    rows={params?.rows}*/}
        {/*  />*/}
        {/*</div>*/}
      </Suspense>
    </div>
  );
};

export default RegistrationPage;
