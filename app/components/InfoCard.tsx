"use client";

import CurrentOrganization from "./CurrentOrganization";
import NameBlock from "./NameBlock";
import ProfileImage from "./ProfileImage";

function InfoCard() {
  return (
    <div className="h-40 w-[90%] rounded-2xl mt-[1.3rem] flex items-center">
      <ProfileImage />
      <NameBlock />
      <CurrentOrganization />
    </div>
  );
}

export default InfoCard;
