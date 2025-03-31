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
  const [pickedImage, setPickedImage] = useState();
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePickCick = () => {
    inputRef?.current?.click();
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    console.log("IS FILE?", file instanceof File);
    console.log(file);
    if (!file) {
      setPickedImage(null);
      setValue(name, undefined, { shouldValidate: true });

      return;
    }
    setValue(name, file, { shouldValidate: true });
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      //tutaj znajduje się wynik z readAsDataURL
      setPickedImage(fileReader.result);
      console.log(1);
      console.log(fileReader.result);
    };
  };

  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <div className="flex items-start gap-6 mb-4">
        <div className="w-40 h-40 border border-gray-900 flex justify-center items-center text-center text-gray-900 relative">
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
        <button
          className="border-0 py-2 px-6 bg-amber-50 rounded-xs cursor-pointer hover:bg-amber-100"
          type="button"
          onClick={handlePickCick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
