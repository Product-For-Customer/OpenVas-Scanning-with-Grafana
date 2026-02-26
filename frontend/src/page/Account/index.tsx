import React from "react";
import Setting from "./Setting";
import Profile from "./Profile";

const Account: React.FC = () => {
  return (
    <div className="w-full">
      {/* Layout: ซ้ายใหญ่ / ขวาเล็ก */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5">
        {/* Left block */}
        <div className="xl:col-span-8">
          <Setting />
        </div>

        {/* Right block */}
        <div className="xl:col-span-4">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Account;