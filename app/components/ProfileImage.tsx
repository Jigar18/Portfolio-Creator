"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProfileImage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // <div className="h-32 w-32 bg-gray-500 flex justify-center items-center rounded-full overflow-hidden">
    <div className="relative">
      <div
        // className="relative rounded-full bg-amber-700 aspect-square w-full h-full max-w-full overflow-hidden"
        className="relative flex shrink-0 overflow-hidden rounded-full size-28"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src="/Profile-Image.jpg"
          alt="Profile Image"
          fill
          // className={`transition-all duration-300 object-cover ${
          //   isHovered ? "blur-sm" : ""
          // }`}
          className={`aspect-square h-full w-full transition-opacity duration-300 ease-in-out group-hover:opacity-0 ${
            isHovered ? "blur-sm" : ""}`}
        />
        {isHovered && (
          <Image
            src="/profile-edit-icon.svg"
            alt="Profile Image Icon"
            width={300}
            height={300}
            className="aspect-square h-20 w-20 absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100 cursor-pointer m-auto"
          />
        )}
      </div>
    </div>
  );
}