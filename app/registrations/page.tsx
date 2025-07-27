import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getRegistrationByUserId } from "src/lib/registrations";
import { verifySession } from "src/lib/dal";
const EventsGrid = dynamic(() => import("src/components/events/EventsGrid"));

async function Events() {
	const { userId } = await verifySession();
	if (!userId) redirect("/login");
	const events = await getRegistrationByUserId(userId);

	return <EventsGrid events={events} />;
}

const RegistrationPage = async () => {
	return (
		<div className="mx-2 my-10 md:mx-10 ">
			<div className="flex flex-row justify-between items-center">
				<p className="mb-4 text-4xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">
					Events you're registered in
				</p>
			</div>
			<Suspense fallback={<p>Featching...</p>}>
				<Events />
			</Suspense>
		</div>
	);
};

export default RegistrationPage;
