import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  description: string;
  date: Date;
  image: string;
};

function EventCard({ id, title, date, image }: Props) {
  return (
    <div className="flex flex-col w-full h-full -white border border-gray-200 rounded-lg shadow-sm bg-gray-100 ">
      <div className="relative h-60">
        <Image
          className="object-cover"
          src={image}
          fill
          alt={`Image of ${title} event.`}
        />
      </div>
      <div className="p-5 flex flex-col justify-between flex-grow">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
          {title}
        </h5>
        <div className="flex flex-col">
          <p className="mb-3 font-normal text-gray-700 ">
            {date.toLocaleString("en-EN", { dateStyle: "full" })}
          </p>
          <Link href={`/events/${id}`} className="block btn  ">
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
