import Link from "next/link";
import { deleteEventById } from "src/lib/events";
import { redirect } from "next/navigation";
import SubmitButton from "src/components/form/SubmitButton";

const EventActionButtons = async ({ eventId }: { eventId: string }) => {
  const deleteEvent = async () => {
    "use server";
    const res = await deleteEventById(eventId);
    if (res.success) redirect("/events");
  };
  return (
    <>
      <Link
        href={`/events/${eventId}/edit`}
        title="Add to favorites"
        className="flex items-center justify-center btn mb-2"
      >
        <svg
          className="w-5 h-5 -ms-2 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16.862 3.487a2.56 2.56 0 1 1 3.622 3.622L7.5 20.093 3 21l.907-4.5 12.955-13.013Z"
          />
        </svg>
        Edit
      </Link>
      <form action={deleteEvent} className="mb-2">
        <SubmitButton>
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash2-icon lucide-trash-2 w-5 h-5 -ms-2 me-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
            Delete
          </div>
        </SubmitButton>
      </form>
    </>
  );
};

export default EventActionButtons;
