import React from "react";
import {
  FiEdit2,
  FiHome,
  FiBriefcase,
  FiGlobe,
  FiCamera,
} from "react-icons/fi";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";

const chipData = ["UI Design", "Research", "Figma", "Creative Idea", "Animation"];

const Profile: React.FC = () => {
  return (
    <aside className="rounded-[22px] border border-gray-200/80 bg-[#f7f7f8] shadow-sm overflow-hidden">
      {/* Cover */}
      <div className="relative h-35 sm:h-40 bg-linear-to-r from-pink-100 via-purple-100 to-indigo-100">
        {/* pseudo cover pattern */}
        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-8 top-8 h-20 w-28 rounded-xl bg-pink-200/60 blur-[2px]" />
          <div className="absolute right-10 top-6 h-24 w-36 rounded-2xl bg-indigo-300/30 blur-[2px]" />
          <div className="absolute left-1/3 top-10 h-14 w-14 rounded-full bg-purple-300/40" />
        </div>

        {/* Avatar */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[20px] bg-white shadow-md ring-4 ring-[#f7f7f8] flex items-center justify-center text-[42px]">
              🧑🏻‍💻
            </div>

            <button
              type="button"
              className="absolute right-0 bottom-0 h-7 w-7 rounded-full bg-[#ede9fe] text-[#6f5be8] border border-white shadow flex items-center justify-center"
              aria-label="Change avatar"
            >
              <FiCamera className="text-[14px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main profile info */}
      <div className="px-5 sm:px-6 pt-14 pb-5 text-center">
        <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240]">
          Jonathon Smith
        </h3>
        <p className="mt-2 text-[14px] text-[#1f2240]">
          Don’t Care Everybody&apos;s Word 🔥
        </p>
        <p className="mt-1 text-[13px] text-gray-500">
          UI/IX - Student at Academie 🧑🏻‍🎓
        </p>
      </div>

      {/* Sections */}
      <div className="px-5 sm:px-6 pb-6 space-y-5">
        {/* Skill */}
        <div className="border-t border-gray-200/80 pt-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[16px] font-semibold text-[#1f2240]">Skill</h4>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Edit skill"
            >
              <FiEdit2 className="text-[15px]" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {chipData.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-full bg-[#ede9fe] px-3 py-1 text-[12px] font-medium text-[#6f5be8]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="border-t border-gray-200/80 pt-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[16px] font-semibold text-[#1f2240]">About</h4>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Edit about"
            >
              <FiEdit2 className="text-[15px]" />
            </button>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[14px] text-[#1f2240]">
              <FiHome className="text-gray-500 text-[16px]" />
              <span>Lives in 1901 Thornridge</span>
            </li>
            <li className="flex items-center gap-3 text-[14px] text-[#1f2240]">
              <FiBriefcase className="text-gray-500 text-[16px]" />
              <span>Works at ebay</span>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="border-t border-gray-200/80 pt-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[16px] font-semibold text-[#1f2240]">Social</h4>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Edit social"
            >
              <FiEdit2 className="text-[15px]" />
            </button>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[14px] text-[#1f2240]">
              <FiGlobe className="text-gray-500 text-[16px]" />
              <span>Website.com</span>
            </li>
            <li className="flex items-center gap-3 text-[14px] text-[#1f2240]">
              <FaXTwitter className="text-gray-500 text-[15px]" />
              <span>Twitter</span>
            </li>
            <li className="flex items-center gap-3 text-[14px] text-[#1f2240]">
              <FaFacebook className="text-gray-500 text-[15px]" />
              <span>Facebook</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Profile;