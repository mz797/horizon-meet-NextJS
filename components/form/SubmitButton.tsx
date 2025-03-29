"use client";

import { useFormStatus } from "react-dom";
import { ReactNode } from "react";

function SubmitButton({ children }: { children?: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn w-full">
      {pending ? "..." : children}
    </button>
  );
}

export default SubmitButton;
