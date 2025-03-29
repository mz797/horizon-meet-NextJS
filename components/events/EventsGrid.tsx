import EventCard from "./EventCard";

type Props = {
	events: {
		id: string;
		title: string;
		description: string;
		image: string;
		date: Date;
	}[];
};
function EventsGrid({ events }: Props) {
	return (
		<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3.5 mx-auto my-8 list-none p-0">
			{events.map((event) => (
				<li key={event.id}>
					<EventCard {...event} />
				</li>
			))}
		</ul>
	);
}

export default EventsGrid;
