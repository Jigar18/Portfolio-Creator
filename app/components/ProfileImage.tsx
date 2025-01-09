"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProfileImage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="h-[80%] w-[16%]">
      <div
        className="relative rounded-[100%] bg-amber-700 h-[100%] w-[8rem] ml-16 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src="/Profile-Image.jpg"
          alt="Profile Image"
          fill
          className={`transition-all duration-300 object-cover ${
            isHovered ? "blur-sm" : ""
          }`}
        />
        {isHovered && (
          <Image
            src="/profile-edit-icon.svg"
            alt="Profile Image Icon"
            width={500}
            height={500}
            className="absolute inset-0 m-auto h-16 w-16 opacity-100 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
