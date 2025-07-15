import dynamic from "next/dynamic";

type Props = {
  events: {
    id: string;
    title: string;
    description: string;
    image: string;
    date: Date;
  }[];
};
const EventCard = dynamic(() => import("./EventCard"));

function EventsGrid({ events }: Props) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3.5 mx-auto my-8 list-none p-0">
      {events.map((event, idx) => (
        <li key={event.id}>
          <EventCard {...event} isFirst={idx === 0} />
        </li>
      ))}
    </ul>
  );
}

export default EventsGrid;
