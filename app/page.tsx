import { redirect } from "next/navigation";

export default function Home() {
  redirect("/events");
  return <div></div>;
}
