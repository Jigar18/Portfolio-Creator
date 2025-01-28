"use client";

import CurrentOrganization from "../components/CurrentOrganization";
import NameBlock from "../components/NameBlock";
import ProfileImage from "../components/ProfileImage";

function InfoCard() {
  return (
    <div className="h-40 w-[100%] rounded-2xl flex justify-between mt-[-1rem] items-center p-16">
      <div className="flex">
        <ProfileImage />
        <NameBlock />
      </div>
      <CurrentOrganization />
    </div>
  );
}

export default InfoCard;
