"use client";

import { useState } from "react";

export default function CollectorNote() {
  const [note, setNote] = useState<string>("");
  return (
    <div className="flex flex-col justify-between h-full py-4">
      <div className="flex flex-col gap-4 grow">
        <h1>Leave a note for the artist (optional)</h1>
        <div>
          What do you want the artist to draw, write or sign? Who do you want
          them to make it out to?
        </div>
        <div className="flex flex-row w-full">
          <div className="grow">
            <label htmlFor="search" className="sr-only">
              enter address
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              maxLength={140}
              className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-white bg-neutral-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              defaultValue={""}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
