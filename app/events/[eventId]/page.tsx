import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { verifySession } from "src/lib/dal";
import {
  deleteEventById,
  deleteRegistration,
  getEventById,
  registerToEvent,
} from "src/lib/events";
import SubmitButton from "src/components/form/SubmitButton";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const { userId } = await verifySession();

  const event = await getEventById(eventId!);
  console.log(1, event);
  if (!event) {
    return notFound();
  }

  const { title, description, date, image, organizer, registration } = event;
  const userRegistration = registration.find((reg) => reg.userId === userId);

  console.log("registration", registration);
  const toggleSubscribe = async () => {
    "use server";
    if (!!userRegistration) {
      await deleteRegistration(userRegistration.id);
    } else {
      await registerToEvent(eventId, userId);
    }
    revalidatePath(`/events/${eventId}`);
  };
  const deleteEvent = async () => {
    "use server";
    const res = await deleteEventById(eventId);
    if (res.success) redirect("/events");
  };

  return (
    <section className="py-8 bg-white md:py-16 antialiased h-screen">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto relative w-full rounded-md overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl ">
              {title}
            </h1>

            <div className="my-4 sm:items-center sm:gap-4 sm:flex">
              <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl ">
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="flex text-emerald-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>

                <span>By {organizer.name}</span>
              </div>
              <div className="flex text-red-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>

                <span>{registration.length}</span>
              </div>
            </div>

            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
              <form action={toggleSubscribe} className="mb-2">
                <SubmitButton>
                  <div className="flex items-center justify-center">
                    {userRegistration ? (
                      <>
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
                          className="w-5 h-5 -ms-2 me-2"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          <path d="m12 13-1-1 2-2-3-3 2-2" />
                        </svg>
                        Unsubscribe
                      </>
                    ) : (
                      <>
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
                            d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                          />
                        </svg>
                        Subscribe
                      </>
                    )}
                  </div>
                </SubmitButton>
              </form>
              {userId === organizer.id && (
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
              )}
            </div>

            <hr className="my-5 md:mb-8 md:mt-7.5 border-gray-200 " />

            <p className="mb-6 text-gray-500 ">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
