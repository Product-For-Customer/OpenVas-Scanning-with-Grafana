import React from "react";
import {
  FiEdit2,
  FiHome,
  FiBriefcase,
  FiCamera,
  FiMail,
  FiPhone,
  FiGlobe,
  FiSettings,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import type { UserResponse } from "../../../services/user";

type ProfileProps = {
  user: UserResponse;
};

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const fullName =
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Unknown User";

  const itemClass =
    "flex items-center gap-3 text-[14px] text-[#1f2240] dark:text-white/70";

  const iconClass = "text-gray-500 text-[16px] dark:text-white/40";

  const linkClass = [
    "inline-flex items-center gap-3 text-[14px] transition-colors",
    "text-[#1f2240] hover:text-[#6f5be8]",
    "dark:text-white/70 dark:hover:text-[#a99cff]",
  ].join(" ");

  return (
    <aside
      className={[
        "h-full rounded-[22px] border shadow-sm overflow-hidden flex flex-col",
        "border-gray-200/80 bg-[#f7f7f8]",
        "dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:ring-1 dark:ring-white/10",
      ].join(" ")}
    >
      {/* Cover */}
      <div className="relative h-35 sm:h-40 bg-linear-to-r from-pink-100 via-purple-100 to-indigo-100 dark:from-white/10 dark:via-white/5 dark:to-white/10">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-8 top-8 h-20 w-28 rounded-xl bg-pink-200/60 blur-[2px] dark:bg-white/10" />
          <div className="absolute right-10 top-6 h-24 w-36 rounded-2xl bg-indigo-300/30 blur-[2px] dark:bg-white/8" />
          <div className="absolute left-1/3 top-10 h-14 w-14 rounded-full bg-purple-300/40 dark:bg-white/10" />
        </div>

        {/* Avatar */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div
              className={[
                "h-20 w-20 sm:h-24 sm:w-24 rounded-[20px] shadow-md flex items-center justify-center overflow-hidden",
                "bg-white ring-4 ring-[#f7f7f8]",
                "dark:bg-white/10 dark:ring-4 dark:ring-white/5 dark:shadow-none",
              ].join(" ")}
            >
              {user.profile ? (
                <img
                  src={user.profile}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[42px]">🧑🏻‍💻</span>
              )}
            </div>

            <button
              type="button"
              className={[
                "absolute right-0 bottom-0 h-7 w-7 rounded-full border shadow flex items-center justify-center",
                "bg-[#ede9fe] text-[#6f5be8] border-white",
                "dark:bg-white/10 dark:text-white/80 dark:border-white/10 dark:shadow-none",
              ].join(" ")}
              aria-label="Change avatar"
            >
              <FiCamera className="text-[14px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main profile info */}
      <div className="px-5 sm:px-6 pt-14 pb-5 text-center">
        <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240] dark:text-white/85">
          {fullName}
        </h3>

        <p className="mt-1 text-[13px] text-gray-500 dark:text-white/45">
          {user.role || "No role"}
        </p>
      </div>

      {/* Sections */}
      <div className="px-5 sm:px-6 pb-6 space-y-5 flex-1">
        {/* About */}
        <div className="border-t border-gray-200/80 pt-5 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[16px] font-semibold text-[#1f2240] dark:text-white/85">
              About
            </h4>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors dark:text-white/35 dark:hover:text-white/65"
              aria-label="Edit about"
            >
              <FiEdit2 className="text-[15px]" />
            </button>
          </div>

          <ul className="space-y-3">
            <li className={itemClass}>
              <FiHome className={iconClass} />
              <span>
                {user.location ? `Lives in ${user.location}` : "No location"}
              </span>
            </li>

            <li className={itemClass}>
              <FiBriefcase className={iconClass} />
              <span>
                {user.position ? `Works as ${user.position}` : "No position"}
              </span>
            </li>

            <li className={itemClass}>
              <FiMail className={iconClass} />
              <span>{user.email || "No email"}</span>
            </li>

            <li className={itemClass}>
              <FiPhone className={iconClass} />
              <span>{user.phone_number || "No phone number"}</span>
            </li>
          </ul>
        </div>

        {/* Other */}
        <div className="border-t border-gray-200/80 pt-5 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[16px] font-semibold text-[#1f2240] dark:text-white/85">
              Other
            </h4>
          </div>

          <ul className="space-y-3">
            <li>
              <a
                href="https://openvaswebv1.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <FiGlobe className={iconClass} />
                <span className="text-blue-500">www.openvas.com</span>
              </a>
            </li>

            <li>
              <Link to="/admin/service" className={linkClass}>
                <FiSettings className={iconClass} />
                <span className="text-blue-500">Service</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Profile;