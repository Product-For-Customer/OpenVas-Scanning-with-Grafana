import React, { useState } from "react";
import {
  FiShield,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiActivity,
  FiRadio,
  FiCpu,
  FiMapPin,
  FiPhone,
  FiBriefcase,
} from "react-icons/fi";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { SendOTPForSignUp } from "../../../services";
import ModalOTPSignUp from "../../../Model/ModalOTPSignUp";

type SignUpFormData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: string;
  position: string;
};

const Index: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);

  const [pendingSignupData, setPendingSignupData] = useState<SignUpFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    location: "",
    position: "",
  });

  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    location: "",
    position: "",
  });

  const inputClass = [
    "w-full h-12 rounded-2xl border pl-11 pr-12 text-[14px] outline-none transition-all duration-200",
    "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400",
    "focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100/80",
    "dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30",
    "dark:focus:border-cyan-400/30 dark:focus:ring-cyan-500/10",
  ].join(" ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      message.error("กรุณากรอก First Name");
      return false;
    }
    if (!formData.last_name.trim()) {
      message.error("กรุณากรอก Last Name");
      return false;
    }
    if (!formData.email.trim()) {
      message.error("กรุณากรอก Email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      message.error("รูปแบบ Email ไม่ถูกต้อง");
      return false;
    }
    if (!formData.password.trim()) {
      message.error("กรุณากรอก Password");
      return false;
    }
    if (formData.password.length < 8) {
      message.error("Password ต้องมีอย่างน้อย 8 ตัวอักษร");
      return false;
    }
    if (!formData.phone_number.trim()) {
      message.error("กรุณากรอก Phone Number");
      return false;
    }
    if (!formData.location.trim()) {
      message.error("กรุณากรอก Location");
      return false;
    }
    if (!formData.position.trim()) {
      message.error("กรุณากรอก Position");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: SignUpFormData = {
      email: formData.email.trim(),
      password: formData.password,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone_number: formData.phone_number.trim(),
      location: formData.location.trim(),
      position: formData.position.trim(),
    };

    try {
      setSubmitting(true);

      // สำคัญ: ตอนกด Sign Up ให้ส่งแค่ OTP ก่อน
      const result = await SendOTPForSignUp({
        email: payload.email,
      });

      if (!result) {
        message.error("ไม่สามารถส่ง OTP ได้");
        return;
      }

      if (result.error) {
        message.error(result.error);
        return;
      }

      setPendingSignupData(payload);
      setOtpOpen(true);
      message.success(result.message || "ส่ง OTP สำเร็จ กรุณายืนยันอีเมล");
    } catch (error: any) {
      console.error("Send OTP error:", error);
      message.error(
        error?.response?.data?.error ||
          error?.message ||
          "เกิดข้อผิดพลาดในการส่ง OTP"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerified = () => {
    setOtpOpen(false);

    setFormData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      location: "",
      position: "",
    });

    setPendingSignupData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      location: "",
      position: "",
    });

    setShowPassword(false);
    navigate("/");
  };

  const handleGoSignIn = () => {
    navigate("/");
  };

  return (
    <>
      <div className="w-full min-h-screen bg-[#f7f8fc] dark:bg-[#07101b]">
        <div className="w-full min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
          <div
            className={[
              "w-full min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)] lg:min-h-[calc(100vh-64px)]",
              "rounded-3xl sm:rounded-[28px] overflow-hidden",
              "border border-slate-200/80 bg-[#fbfbfd]",
              "shadow-[0_18px_60px_rgba(15,23,42,0.06)]",
              "dark:bg-[#08111f] dark:border-white/10 dark:shadow-none",
            ].join(" ")}
          >
            <div className="grid w-full min-h-full grid-cols-1 xl:grid-cols-[1.08fr_0.92fr]">
              {/* LEFT SIDE */}
              <section className="relative flex min-h-110 w-full items-center justify-center px-5 py-10 sm:px-8 md:px-10 lg:px-14 xl:min-h-full">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute left-[10%] top-[10%] h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
                  <div className="absolute right-[10%] top-[22%] h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
                  <div className="absolute bottom-[10%] left-[30%] h-44 w-44 rounded-full bg-sky-500/10 blur-3xl" />
                </div>

                <div className="relative z-10 flex w-full max-w-190 flex-col items-center text-center">
                  <div
                    className={[
                      "mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2",
                      "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
                      "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
                    ].join(" ")}
                  >
                    <FiShield className="text-[15px]" />
                    <span className="text-[13px] sm:text-[14px] font-semibold tracking-wide">
                      Network Scanning Onboarding
                    </span>
                  </div>

                  <div className="w-full max-w-160">
                    <svg
                      viewBox="0 0 760 520"
                      className="w-full h-auto"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label="network onboarding illustration"
                    >
                      <defs>
                        <linearGradient
                          id="mainStrokeSignUp"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="50%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>

                        <linearGradient
                          id="panelGlowSignUp"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#0ea5e9"
                            stopOpacity="0.14"
                          />
                          <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                            stopOpacity="0.16"
                          />
                        </linearGradient>

                        <radialGradient id="scanRingGlow" cx="50%" cy="50%" r="50%">
                          <stop
                            offset="0%"
                            stopColor="#22d3ee"
                            stopOpacity="0.20"
                          />
                          <stop
                            offset="100%"
                            stopColor="#22d3ee"
                            stopOpacity="0"
                          />
                        </radialGradient>
                      </defs>

                      <rect
                        x="148"
                        y="96"
                        width="458"
                        height="272"
                        rx="34"
                        fill="url(#panelGlowSignUp)"
                        stroke="url(#mainStrokeSignUp)"
                        strokeOpacity="0.32"
                        strokeWidth="1.6"
                      />

                      <rect
                        x="274"
                        y="150"
                        width="212"
                        height="132"
                        rx="24"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />

                      <rect
                        x="274"
                        y="150"
                        width="212"
                        height="26"
                        rx="24"
                        fill="#EEF6FF"
                        className="dark:fill-white/5"
                      />
                      <circle cx="294" cy="163" r="3.5" fill="#22d3ee" />
                      <circle cx="307" cy="163" r="3.5" fill="#60a5fa" />
                      <circle cx="320" cy="163" r="3.5" fill="#8b5cf6" />

                      <circle cx="380" cy="222" r="46" fill="url(#scanRingGlow)" />
                      <circle
                        cx="380"
                        cy="222"
                        r="34"
                        stroke="#22d3ee"
                        strokeOpacity="0.8"
                        strokeWidth="2.2"
                      />
                      <circle
                        cx="380"
                        cy="222"
                        r="20"
                        stroke="#38bdf8"
                        strokeOpacity="0.65"
                        strokeWidth="1.8"
                      />
                      <circle cx="380" cy="222" r="6" fill="#22d3ee" />
                      <path
                        d="M380 222L401 206"
                        stroke="#22d3ee"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                      <circle cx="401" cy="206" r="4.2" fill="#22d3ee" />

                      <rect
                        x="320"
                        y="296"
                        width="122"
                        height="74"
                        rx="20"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <circle cx="347" cy="333" r="12" fill="#8b5cf6" fillOpacity="0.14" />
                      <path
                        d="M347 330C349.8 330 352 327.8 352 325C352 322.2 349.8 320 347 320C344.2 320 342 322.2 342 325C342 327.8 344.2 330 347 330Z"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                      />
                      <path
                        d="M339 344C341.5 338.7 346 336 347 336C348 336 352.5 338.7 355 344"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <rect x="365" y="324" width="46" height="8" rx="4" fill="#22d3ee" />
                      <rect x="365" y="338" width="32" height="6" rx="3" fill="#BAE6FD" />

                      <path
                        d="M380 48L415 64V96C415 122 397 139 380 146C363 139 345 122 345 96V64L380 48Z"
                        fill="#0ea5e9"
                        fillOpacity="0.12"
                        stroke="#22d3ee"
                        strokeWidth="2"
                      />
                      <path
                        d="M368 96L377 105L394 86"
                        stroke="#22d3ee"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M380 150V146"
                        stroke="url(#mainStrokeSignUp)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M334 197L242 152"
                        stroke="url(#mainStrokeSignUp)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="8 8"
                      />
                      <path
                        d="M426 197L520 152"
                        stroke="url(#mainStrokeSignUp)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="8 8"
                      />
                      <path
                        d="M336 247L234 300"
                        stroke="url(#mainStrokeSignUp)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="8 8"
                      />
                      <path
                        d="M424 247L530 300"
                        stroke="url(#mainStrokeSignUp)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="8 8"
                      />

                      <rect
                        x="176"
                        y="116"
                        width="112"
                        height="74"
                        rx="20"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <rect x="196" y="139" width="48" height="8" rx="4" fill="#22d3ee" />
                      <rect x="196" y="153" width="72" height="6" rx="3" fill="#BAE6FD" />
                      <circle cx="253" cy="143" r="9" fill="#0ea5e9" fillOpacity="0.12" />
                      <circle cx="253" cy="143" r="4" fill="#22d3ee" />

                      <rect
                        x="472"
                        y="116"
                        width="118"
                        height="76"
                        rx="20"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <rect x="493" y="139" width="52" height="8" rx="4" fill="#8b5cf6" />
                      <rect x="493" y="153" width="74" height="6" rx="3" fill="#DDD6FE" />
                      <path
                        d="M493 169L506 160L518 166L532 152L547 160"
                        stroke="#8b5cf6"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <rect
                        x="162"
                        y="274"
                        width="122"
                        height="82"
                        rx="22"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <circle cx="191" cy="315" r="13" fill="#22d3ee" fillOpacity="0.14" />
                      <path
                        d="M191 308V322"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M184 315H198"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <rect x="212" y="306" width="44" height="8" rx="4" fill="#22d3ee" />
                      <rect x="212" y="320" width="30" height="6" rx="3" fill="#BAE6FD" />

                      <rect
                        x="486"
                        y="274"
                        width="122"
                        height="82"
                        rx="22"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <circle cx="517" cy="315" r="13" fill="#ef4444" fillOpacity="0.12" />
                      <path
                        d="M517 308V317"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="517" cy="322" r="1.8" fill="#ef4444" />
                      <rect x="538" y="306" width="44" height="8" rx="4" fill="#ef4444" />
                      <rect x="538" y="320" width="32" height="6" rx="3" fill="#fecaca" />

                      <circle cx="108" cy="222" r="23" fill="#E0F2FE" className="dark:fill-cyan-500/10" />
                      <circle cx="652" cy="222" r="23" fill="#EDE9FE" className="dark:fill-violet-500/10" />
                      <circle cx="256" cy="406" r="18" fill="#DBEAFE" className="dark:fill-sky-500/10" />
                      <circle cx="504" cy="406" r="18" fill="#ECFEFF" className="dark:fill-cyan-500/10" />

                      <circle cx="108" cy="222" r="7" fill="#22d3ee" />
                      <circle cx="652" cy="222" r="7" fill="#8b5cf6" />
                      <circle cx="256" cy="406" r="5.5" fill="#60a5fa" />
                      <circle cx="504" cy="406" r="5.5" fill="#22d3ee" />

                      <path
                        d="M131 222C154 222 170 222 194 222"
                        stroke="#22d3ee"
                        strokeOpacity="0.75"
                        strokeWidth="2.5"
                        strokeDasharray="6 7"
                      />
                      <path
                        d="M566 222C591 222 606 222 629 222"
                        stroke="#8b5cf6"
                        strokeOpacity="0.75"
                        strokeWidth="2.5"
                        strokeDasharray="6 7"
                      />

                      <circle cx="214" cy="92" r="4" fill="#22d3ee" fillOpacity="0.85" />
                      <circle cx="545" cy="92" r="3.5" fill="#8b5cf6" fillOpacity="0.85" />
                      <circle cx="317" cy="430" r="4" fill="#60a5fa" fillOpacity="0.85" />
                      <circle cx="445" cy="430" r="4" fill="#22d3ee" fillOpacity="0.85" />
                    </svg>
                  </div>

                  <h1 className="mt-4 text-[28px] sm:text-[36px] lg:text-[42px] font-bold tracking-tight text-slate-900 dark:text-white">
                    Create secure access
                  </h1>

                  <p className="mt-4 max-w-140 text-[14px] sm:text-[16px] leading-7 text-slate-600 dark:text-white/60">
                    Register your account to start scanning assets, tracking
                    suspicious activity, and managing network security from one
                    professional dashboard.
                  </p>

                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <div
                      className={[
                        "inline-flex items-center gap-2 rounded-2xl px-4 py-3",
                        "bg-slate-50 border border-slate-200 text-slate-700",
                        "dark:bg-white/4 dark:border-white/10 dark:text-white/75",
                      ].join(" ")}
                    >
                      <FiRadio className="text-cyan-500 text-[18px]" />
                      <span className="text-[14px] font-medium">Live Scan Ready</span>
                    </div>

                    <div
                      className={[
                        "inline-flex items-center gap-2 rounded-2xl px-4 py-3",
                        "bg-slate-50 border border-slate-200 text-slate-700",
                        "dark:bg-white/4 dark:border-white/10 dark:text-white/75",
                      ].join(" ")}
                    >
                      <FiCpu className="text-sky-500 text-[18px]" />
                      <span className="text-[14px] font-medium">Protected Access</span>
                    </div>

                    <div
                      className={[
                        "inline-flex items-center gap-2 rounded-2xl px-4 py-3",
                        "bg-slate-50 border border-slate-200 text-slate-700",
                        "dark:bg-white/4 dark:border-white/10 dark:text-white/75",
                      ].join(" ")}
                    >
                      <FiActivity className="text-violet-500 text-[18px]" />
                      <span className="text-[14px] font-medium">Threat Visibility</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* RIGHT SIDE */}
              <section className="relative flex min-h-140 w-full items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-10">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute right-[12%] top-[14%] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
                  <div className="absolute left-[8%] bottom-[10%] h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-130">
                  <div
                    className={[
                      "rounded-[28px] p-5 sm:p-6 md:p-8",
                      "border border-slate-200/80 bg-white",
                      "shadow-[0_18px_60px_rgba(15,23,42,0.07)]",
                      "dark:bg-[#0b1320]/90 dark:border-white/10 dark:shadow-none",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5",
                        "bg-violet-50 text-violet-700 border border-violet-200/80",
                        "dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-400/20",
                      ].join(" ")}
                    >
                      <FiShield className="text-[13px]" />
                      <span className="text-[12px] font-semibold tracking-wide">
                        Secure Registration
                      </span>
                    </div>

                    <h2 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-slate-900 dark:text-white">
                      Sign Up
                    </h2>

                    <p className="mt-2 text-[14px] text-slate-500 dark:text-white/55">
                      Welcome! Create your scanning account
                    </p>

                    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[14px] font-medium text-slate-700 dark:text-white/75">
                            First Name
                          </label>
                          <div className="relative">
                            <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-white/35" />
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange}
                              placeholder="Debra"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-[14px] font-medium text-slate-700 dark:text-white/75">
                            Last Name
                          </label>
                          <div className="relative">
                            <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-white/35" />
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleChange}
                              placeholder="Holt"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[14px] font-medium text-slate-700 dark:text-white/75">
                          Email
                        </label>
                        <div className="relative">
                          <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-white/35" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="debra.holt@example.com"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[14px] font-medium text-slate-700 dark:text-white/75">
                          Password
                        </label>
                        <div className="relative">
                          <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-white/35" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:text-white/35 dark:hover:text-white/70"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <FiEyeOff className="text-[18px]" />
                            ) : (
                              <FiEye className="text-[18px]" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[14px] font-medium text-slate-700 dark:text-white/75">
                            Phone Number
                          </label>
                          <div className="relative">
                            <FiPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-white/35" />
                            <input
                              type="text"
                              name="phone_number"
                              value={formData.phone_number}
                              onChange={handleChange}
                              placeholder="0812345678"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-[14px] font-medium text-slate-700 dark:text-white/75">
                            Location
                          </label>
                          <div className="relative">
                            <FiMapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-white/35" />
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleChange}
                              placeholder="Thailand"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[14px] font-medium text-slate-700 dark:text-white/75">
                          Position
                        </label>
                        <div className="relative">
                          <FiBriefcase className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-white/35" />
                          <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            placeholder="Security Analyst"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className={[
                          "group inline-flex w-full items-center justify-center gap-2 rounded-2xl h-12 sm:h-13 px-6",
                          "bg-linear-to-r from-cyan-500 via-sky-500 to-violet-500",
                          "text-white text-[15px] sm:text-[16px] font-semibold",
                          "shadow-[0_12px_32px_rgba(14,165,233,0.24)]",
                          "hover:scale-[1.01] active:scale-[0.99] transition-all duration-200",
                          "focus:outline-none focus:ring-4 focus:ring-cyan-200/60",
                          "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100",
                        ].join(" ")}
                      >
                        <span>{submitting ? "Sending OTP..." : "Sign Up"}</span>
                        <FiArrowRight className="text-[18px] transition-transform duration-200 group-hover:translate-x-0.5" />
                      </button>

                      <div className="pt-1 text-center text-[14px] text-slate-500 dark:text-white/55">
                        Have an account?{" "}
                        <button
                          type="button"
                          onClick={handleGoSignIn}
                          className="font-semibold text-violet-600 transition hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <ModalOTPSignUp
        open={otpOpen}
        signupData={pendingSignupData}
        onClose={() => setOtpOpen(false)}
        onVerified={handleVerified}
      />
    </>
  );
};

export default Index;