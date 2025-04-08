"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

export default function ImagePicker({
  label,
  name,
  setValue,
}: {
  label: string;
  name: string;
  setValue: any;
}) {
  const [pickedImage, setPickedImage] = useState<string | null>(null); // Typowanie pickedImage
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef?.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];

    if (!file) {
      setPickedImage(null);
      setValue(name, undefined, { shouldValidate: true });
      return;
    }

    // Ustawiamy file jako wartość
    setValue(name, file, { shouldValidate: true });

    const fileReader = new FileReader();

    fileReader.readAsDataURL(file); // Wczytanie obrazu jako Base64

    fileReader.onload = () => {
      if (fileReader.result) {
        // Gdy obraz jest załadowany, zapisujemy Base64
        setPickedImage(fileReader.result as string);
      }
    };
  };

  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <div className="flex flex-col gap-6 mb-4">
        <button
          className="btn text-gray-950 border-2 border-gray-950 bg-white hover:bg-gray-900 hover:text-white "
          type="button"
          onClick={handleClick}
        >
          Pick an Image
        </button>
        <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg min-w-60 w-full h-40 overflow-hidden relative flex justify-center items-center">
          {!pickedImage && <p className="p-4 m-0 ">No image picked yet</p>}
          {pickedImage && (
            <Image
              className="object-cover"
              fill
              src={pickedImage}
              alt="Image picked by the user"
            />
          )}
        </div>
        <input
          className="hidden"
          type="file"
          id={name}
          accept="image/png, image/jpeg, image/jpg"
          name={name}
          ref={inputRef}
          onChange={handleImageChange}
          required
        />
      </div>
    </div>
  );
}
