import React, { useState } from "react";
import { FiCheckCircle, FiTrash2, FiBold, FiItalic, FiUnderline } from "react-icons/fi";
import { BsTypeH1 } from "react-icons/bs";
import { MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";
import { BiLinkAlt, BiImageAdd } from "react-icons/bi";

const Setting: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "Jonathon",
    lastName: "Smith",
    email: "debra.holt@example.com",
    phone: "(907) 555-0101",
    location: "1901 Thornridge",
    country: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save account settings:", form);
    // TODO: call API here
  };

  const onCancel = () => {
    setForm({
      firstName: "Jonathon",
      lastName: "Smith",
      email: "debra.holt@example.com",
      phone: "(907) 555-0101",
      location: "1901 Thornridge",
      country: "",
      description: "",
    });
  };

  const toolbarBtnClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors";

  return (
    <section className="rounded-[22px] border border-gray-200/80 bg-[#f7f7f8] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-gray-200/80">
        <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240]">
          Account Settings
        </h2>
      </div>

      {/* Body */}
      <form onSubmit={onSave} className="p-5 sm:p-6">
        {/* Grid fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block mb-2 text-[13px] font-medium text-[#374151]">
              First Name
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              type="text"
              className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 text-[14px] text-gray-700 outline-none focus:ring-2 focus:ring-[#7a67ea]/25 focus:border-[#7a67ea]"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-2 text-[13px] font-medium text-[#374151]">
              Last Name
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              type="text"
              className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 text-[14px] text-gray-700 outline-none focus:ring-2 focus:ring-[#7a67ea]/25 focus:border-[#7a67ea]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-[13px] font-medium text-[#374151]">
              Email Address
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 text-[14px] text-gray-700 outline-none focus:ring-2 focus:ring-[#7a67ea]/25 focus:border-[#7a67ea]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-[13px] font-medium text-[#374151]">
              Phone No
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="text"
              className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 text-[14px] text-gray-700 outline-none focus:ring-2 focus:ring-[#7a67ea]/25 focus:border-[#7a67ea]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 text-[13px] font-medium text-[#374151]">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              type="text"
              className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 text-[14px] text-gray-700 outline-none focus:ring-2 focus:ring-[#7a67ea]/25 focus:border-[#7a67ea]"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block mb-2 text-[13px] font-medium text-[#374151]">
              Country
            </label>
            <div className="relative">
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full h-11 appearance-none rounded-xl border border-gray-300 bg-white px-4 pr-10 text-[14px] text-gray-500 outline-none focus:ring-2 focus:ring-[#7a67ea]/25 focus:border-[#7a67ea]"
              >
                <option value="">Select Country</option>
                <option value="Thailand">Thailand</option>
                <option value="United States">United States</option>
                <option value="Japan">Japan</option>
                <option value="Singapore">Singapore</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Fake Rich Text Editor */}
        <div className="mt-5 rounded-xl border border-gray-300 bg-white overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-[#f8fafc] px-2 py-2">
            <button type="button" className={toolbarBtnClass} title="Bold">
              <FiBold className="text-[15px]" />
            </button>
            <button type="button" className={toolbarBtnClass} title="Italic">
              <FiItalic className="text-[15px]" />
            </button>
            <button type="button" className={toolbarBtnClass} title="Underline">
              <FiUnderline className="text-[15px]" />
            </button>
            <button type="button" className={toolbarBtnClass} title="Heading">
              <BsTypeH1 className="text-[15px]" />
            </button>

            <div className="mx-1 h-6 w-px bg-gray-200" />

            <button type="button" className={toolbarBtnClass} title="Bulleted list">
              <MdFormatListBulleted className="text-[18px]" />
            </button>
            <button type="button" className={toolbarBtnClass} title="Numbered list">
              <MdFormatListNumbered className="text-[18px]" />
            </button>

            <div className="mx-1 h-6 w-px bg-gray-200" />

            <button type="button" className={toolbarBtnClass} title="Insert link">
              <BiLinkAlt className="text-[18px]" />
            </button>
            <button type="button" className={toolbarBtnClass} title="Insert image">
              <BiImageAdd className="text-[18px]" />
            </button>
          </div>

          {/* Text area */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={9}
            placeholder="Write your description here..."
            className="w-full resize-y min-h-47.5 bg-white px-4 py-3 text-[15px] text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>

        {/* Footer buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="
              inline-flex items-center gap-2 rounded-xl
              bg-[#6f5be8] hover:bg-[#624de0]
              text-white font-semibold text-[14px]
              px-4 py-2.5 transition-colors
            "
          >
            <FiCheckCircle className="text-[16px]" />
            Save Changes
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="
              inline-flex items-center gap-2 rounded-xl
              bg-[#f4d7d1] hover:bg-[#efcbc3]
              text-[#d94a38] font-semibold text-[14px]
              px-4 py-2.5 transition-colors
            "
          >
            <FiTrash2 className="text-[16px]" />
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default Setting;