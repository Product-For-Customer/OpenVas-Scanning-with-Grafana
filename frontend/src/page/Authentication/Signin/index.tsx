import React, { useState } from "react";
import { message } from "antd";
import {
  FiShield,
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Login } from "../../../services/auth";
import { useAuth } from "../../../contexts/AuthContext";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { refreshMe } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const inputClass = [
    "w-full h-12 rounded-2xl border pl-11 pr-12 text-[14px] outline-none transition-all duration-200",
    "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400",
    "focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100/80",
    "dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30",
    "dark:focus:border-cyan-400/30 dark:focus:ring-cyan-500/10",
  ].join(" ");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("กรุณากรอก Email และ Password");
      return;
    }

    try {
      setSubmitting(true);

      const res = await Login({ email, password });

      await refreshMe();

      const role = (res?.user?.role ?? "").toLowerCase();

      if (role === "admin") {
        message.success("login success");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate("/admin", { replace: true });
      } else {
        setError("บัญชีนี้ไม่มีสิทธิ์ Admin");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Login ไม่สำเร็จ กรุณาลองใหม่";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f8fc] dark:bg-[#07101b]">
      <div className="w-full min-h-screen p-0 sm:p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10">
        <div
          className={[
            "w-full min-h-screen sm:min-h-[calc(100vh-24px)] md:min-h-[calc(100vh-32px)] lg:min-h-[calc(100vh-48px)] xl:min-h-[calc(100vh-64px)] 2xl:min-h-[calc(100vh-80px)]",
            "overflow-hidden",
            "rounded-none sm:rounded-3xl sm:border border-slate-200/80 bg-[#fbfbfd]",
            "shadow-none sm:shadow-[0_18px_60px_rgba(15,23,42,0.06)]",
            "dark:bg-[#08111f] dark:border-white/10 dark:shadow-none",
          ].join(" ")}
        >
          <div className="grid w-full min-h-full grid-cols-1 xl:grid-cols-[1.25fr_0.95fr] 2xl:grid-cols-[1.35fr_0.95fr]">
            {/* LEFT SIDE : ทำให้เหมือนตัวอย่าง (มี SVG) และแสดงเฉพาะ xl+ */}
            <section className="relative hidden xl:flex min-h-full w-full items-center justify-center px-5 py-10 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-24">
              {/* soft glow only */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[12%] top-[14%] h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/10 2xl:h-56 2xl:w-56" />
                <div className="absolute right-[12%] top-[18%] h-52 w-52 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10 2xl:h-64 2xl:w-64" />
                <div className="absolute bottom-[10%] left-[28%] h-40 w-40 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/10 2xl:h-52 2xl:w-52" />
              </div>

              <div className="relative z-10 flex w-full max-w-190 xl:max-w-205 2xl:max-w-230 flex-col items-center text-center">
                <div
                  className={[
                    "mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2",
                    "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
                    "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
                  ].join(" ")}
                >
                  <FiShield className="text-[15px]" />
                  <span className="text-[13px] sm:text-[14px] font-semibold tracking-wide">
                    Secure Network Access
                  </span>
                </div>

                {/* NETWORK ILLUSTRATION (ตามตัวอย่าง) */}
                <div className="w-full max-w-155 xl:max-w-165 2xl:max-w-175">
                  <svg
                    viewBox="0 0 760 520"
                    className="w-full h-auto"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="network security illustration"
                  >
                    <defs>
                      <linearGradient id="mainLine" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>

                      <linearGradient id="cardGlow" x1="0" y1="0" x2="1" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#0ea5e9"
                          stopOpacity="0.14"
                        />
                        <stop
                          offset="100%"
                          stopColor="#8b5cf6"
                          stopOpacity="0.14"
                        />
                      </linearGradient>

                      <radialGradient
                        id="centerGlow"
                        cx="50%"
                        cy="50%"
                        r="50%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#22d3ee"
                          stopOpacity="0.22"
                        />
                        <stop
                          offset="100%"
                          stopColor="#22d3ee"
                          stopOpacity="0"
                        />
                      </radialGradient>
                    </defs>

                    {/* outer soft platform */}
                    <rect
                      x="180"
                      y="104"
                      width="400"
                      height="250"
                      rx="30"
                      fill="url(#cardGlow)"
                      stroke="url(#mainLine)"
                      strokeOpacity="0.35"
                      strokeWidth="1.6"
                    />

                    {/* center hub */}
                    <circle cx="380" cy="228" r="92" fill="url(#centerGlow)" />
                    <circle
                      cx="380"
                      cy="228"
                      r="72"
                      stroke="#22d3ee"
                      strokeOpacity="0.78"
                      strokeWidth="2.3"
                    />
                    <circle
                      cx="380"
                      cy="228"
                      r="46"
                      stroke="#38bdf8"
                      strokeOpacity="0.65"
                      strokeWidth="2"
                    />
                    <circle
                      cx="380"
                      cy="228"
                      r="20"
                      fill="#22d3ee"
                      fillOpacity="0.12"
                      stroke="#22d3ee"
                      strokeWidth="2"
                    />

                    {/* shield inside */}
                    <path
                      d="M380 198L401 208V228C401 244 390 255 380 260C370 255 359 244 359 228V208L380 198Z"
                      fill="#0ea5e9"
                      fillOpacity="0.16"
                      stroke="#22d3ee"
                      strokeWidth="2"
                    />
                    <path
                      d="M372 228L378 234L390 221"
                      stroke="#22d3ee"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* connection lines */}
                    <path
                      d="M380 156V102"
                      stroke="url(#mainLine)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                    />
                    <path
                      d="M445 191L520 146"
                      stroke="url(#mainLine)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                    />
                    <path
                      d="M451 267L540 304"
                      stroke="url(#mainLine)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                    />
                    <path
                      d="M315 267L226 304"
                      stroke="url(#mainLine)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                    />
                    <path
                      d="M315 191L240 146"
                      stroke="url(#mainLine)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                    />

                    {/* top server node */}
                    <g>
                      <rect
                        x="334"
                        y="44"
                        width="92"
                        height="56"
                        rx="16"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <rect
                        x="350"
                        y="62"
                        width="46"
                        height="8"
                        rx="4"
                        fill="#22d3ee"
                      />
                      <rect
                        x="350"
                        y="76"
                        width="34"
                        height="6"
                        rx="3"
                        fill="#c4b5fd"
                      />
                      <circle
                        cx="405"
                        cy="67"
                        r="6"
                        fill="#8b5cf6"
                        fillOpacity="0.15"
                      />
                      <circle cx="405" cy="67" r="3.2" fill="#8b5cf6" />
                    </g>

                    {/* top-right monitor */}
                    <g>
                      <rect
                        x="520"
                        y="106"
                        width="108"
                        height="68"
                        rx="18"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <rect
                        x="538"
                        y="126"
                        width="54"
                        height="8"
                        rx="4"
                        fill="#38bdf8"
                      />
                      <rect
                        x="538"
                        y="140"
                        width="72"
                        height="6"
                        rx="3"
                        fill="#BAE6FD"
                      />
                      <path
                        d="M540 157L553 145L566 151L580 134L594 142"
                        stroke="#8b5cf6"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>

                    {/* bottom-right threat card */}
                    <g>
                      <rect
                        x="536"
                        y="278"
                        width="112"
                        height="76"
                        rx="18"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <circle
                        cx="562"
                        cy="316"
                        r="13"
                        fill="#ef4444"
                        fillOpacity="0.12"
                      />
                      <path
                        d="M562 309V317"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="562" cy="322" r="1.8" fill="#ef4444" />
                      <rect
                        x="582"
                        y="306"
                        width="40"
                        height="8"
                        rx="4"
                        fill="#ef4444"
                      />
                      <rect
                        x="582"
                        y="320"
                        width="28"
                        height="6"
                        rx="3"
                        fill="#fecaca"
                      />
                    </g>

                    {/* bottom-left device card */}
                    <g>
                      <rect
                        x="116"
                        y="278"
                        width="110"
                        height="76"
                        rx="18"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <rect
                        x="136"
                        y="302"
                        width="46"
                        height="8"
                        rx="4"
                        fill="#22d3ee"
                      />
                      <rect
                        x="136"
                        y="316"
                        width="62"
                        height="6"
                        rx="3"
                        fill="#c4b5fd"
                      />
                      <circle
                        cx="192"
                        cy="306"
                        r="9"
                        stroke="#22d3ee"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M198 312L205 319"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* top-left chat/info card */}
                    <g>
                      <rect
                        x="126"
                        y="106"
                        width="102"
                        height="68"
                        rx="18"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <rect
                        x="146"
                        y="126"
                        width="44"
                        height="8"
                        rx="4"
                        fill="#8b5cf6"
                      />
                      <rect
                        x="146"
                        y="140"
                        width="62"
                        height="6"
                        rx="3"
                        fill="#ddd6fe"
                      />
                      <rect
                        x="146"
                        y="151"
                        width="50"
                        height="6"
                        rx="3"
                        fill="#dbeafe"
                      />
                    </g>

                    {/* center bottom dashboard */}
                    <g>
                      <rect
                        x="292"
                        y="374"
                        width="176"
                        height="74"
                        rx="20"
                        fill="#ffffff"
                        stroke="#D6E4F0"
                        className="dark:fill-[#0b1728] dark:stroke-white/10"
                      />
                      <rect
                        x="315"
                        y="397"
                        width="58"
                        height="8"
                        rx="4"
                        fill="#22d3ee"
                      />
                      <rect
                        x="315"
                        y="411"
                        width="84"
                        height="6"
                        rx="3"
                        fill="#BAE6FD"
                      />
                      <rect
                        x="315"
                        y="423"
                        width="66"
                        height="6"
                        rx="3"
                        fill="#DDD6FE"
                      />
                      <circle
                        cx="425"
                        cy="410"
                        r="14"
                        fill="#0ea5e9"
                        fillOpacity="0.12"
                      />
                      <path
                        d="M419 410L424 415L432 405"
                        stroke="#22d3ee"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>

                    {/* floating mini nodes */}
                    <circle
                      cx="95"
                      cy="228"
                      r="24"
                      fill="#E0F2FE"
                      className="dark:fill-cyan-500/10"
                    />
                    <circle
                      cx="666"
                      cy="228"
                      r="24"
                      fill="#EDE9FE"
                      className="dark:fill-violet-500/10"
                    />
                    <circle
                      cx="260"
                      cy="436"
                      r="20"
                      fill="#DBEAFE"
                      className="dark:fill-sky-500/10"
                    />

                    <circle cx="95" cy="228" r="7" fill="#22d3ee" />
                    <circle cx="666" cy="228" r="7" fill="#8b5cf6" />
                    <circle cx="260" cy="436" r="6" fill="#60a5fa" />

                    {/* side decorative connections */}
                    <path
                      d="M119 228C148 228 176 228 206 228"
                      stroke="#22d3ee"
                      strokeOpacity="0.7"
                      strokeWidth="2.5"
                      strokeDasharray="6 7"
                    />
                    <path
                      d="M554 228C586 228 612 228 642 228"
                      stroke="#8b5cf6"
                      strokeOpacity="0.7"
                      strokeWidth="2.5"
                      strokeDasharray="6 7"
                    />

                    {/* decorative dots */}
                    <circle
                      cx="286"
                      cy="82"
                      r="4"
                      fill="#22d3ee"
                      fillOpacity="0.85"
                    />
                    <circle
                      cx="474"
                      cy="82"
                      r="3.5"
                      fill="#8b5cf6"
                      fillOpacity="0.85"
                    />
                    <circle
                      cx="214"
                      cy="380"
                      r="4"
                      fill="#60a5fa"
                      fillOpacity="0.85"
                    />
                    <circle
                      cx="550"
                      cy="384"
                      r="4"
                      fill="#22d3ee"
                      fillOpacity="0.85"
                    />
                  </svg>
                </div>

                <h1 className="mt-4 text-[28px] sm:text-[36px] lg:text-[42px] 2xl:text-[48px] font-bold tracking-tight text-slate-900 dark:text-white">
                  Welcome back!
                </h1>

                <p className="mt-4 max-w-140 xl:max-w-155 2xl:max-w-175 text-[14px] sm:text-[16px] 2xl:text-[17px] leading-7 2xl:leading-8 text-slate-600 dark:text-white/60">
                  Access your secured scanning environment, monitor network
                  activity, and continue investigating vulnerabilities from one
                  centralized dashboard.
                </p>
              </div>
            </section>

            {/* RIGHT SIDE : mobile แสดงเต็มจอ */}
            <section className="relative flex min-h-screen xl:min-h-full w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute right-[14%] top-[16%] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl 2xl:h-52 2xl:w-52" />
                <div className="absolute left-[8%] bottom-[10%] h-36 w-36 rounded-full bg-violet-500/10 blur-3xl 2xl:h-48 2xl:w-48" />
              </div>

              <div className="relative z-10 w-full max-w-full sm:max-w-140 xl:max-w-135 2xl:max-w-155">
                <div
                  className={[
                    "rounded-3xl sm:rounded-[28px] p-5 sm:p-6 md:p-8 2xl:p-9",
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
                      Protected Sign In
                    </span>
                  </div>

                  <h2 className="text-[28px] sm:text-[34px] 2xl:text-[38px] font-bold tracking-tight text-slate-900 dark:text-white">
                    Sign In
                  </h2>

                  <p className="mt-2 text-[14px] 2xl:text-[15px] text-slate-500 dark:text-white/55">
                    Welcome Back! Log in to your account
                  </p>

                  {error ? (
                    <div
                      className={[
                        "mt-4 rounded-2xl border px-4 py-3 text-[13px]",
                        "border-red-200 bg-red-50 text-red-700",
                        "dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
                      ].join(" ")}
                    >
                      {error}
                    </div>
                  ) : null}

                  <form className="mt-7 space-y-5" onSubmit={onSubmit}>
                    {/* Email */}
                    <div>
                      <label className="mb-2 block text-[14px] font-medium text-slate-700 dark:text-white/75">
                        Email
                      </label>
                      <div className="relative">
                        <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-white/35" />
                        <input
                          type="email"
                          placeholder="admin@example.com"
                          className={inputClass}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="mb-2 block text-[14px] font-medium text-slate-700 dark:text-white/75">
                        Password
                      </label>
                      <div className="relative">
                        <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-white/35" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className={inputClass}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
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

                    {/* actions */}
                    <div className="flex flex-col gap-3 text-[13px] sm:flex-row sm:items-center sm:justify-between">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-slate-500 dark:text-white/55">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-300 dark:border-white/10 dark:bg-white/5"
                        />
                        <span>Remember Me</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-left font-medium text-violet-600 transition hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200 sm:text-right"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* submit */}
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
                        submitting ? "opacity-70 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      <span>{submitting ? "Signing In..." : "Sign In"}</span>
                      <FiArrowRight className="text-[18px] transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>

                    {/* or */}
                    <div className="flex items-center gap-4 py-1">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                      <span className="text-[13px] text-slate-400 dark:text-white/35">
                        OR
                      </span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                    </div>

                    {/* footer */}
                    <div className="pt-1 text-center text-[14px] text-slate-500 dark:text-white/55">
                      Don&apos;t have an account yet?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="font-semibold text-violet-600 transition hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200"
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>

                  {/* bottom status */}
                  <div
                    className={[
                      "mt-6 rounded-2xl px-4 py-3",
                      "bg-slate-50 border border-slate-200",
                      "dark:bg-white/4 dark:border-white/10",
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
                        </span>
                        <span className="text-[12px] font-medium text-slate-700 dark:text-white/75">
                          Secure authentication channel active
                        </span>
                      </div>
                    </div>
                  </div>

                  {remember ? (
                    <div className="mt-3 text-[12px] text-slate-400 dark:text-white/35">
                      Remember Me ใช้ได้เพียง UI ตอนนี้ (ระบบ cookie จะจัดการ
                      session เอง)
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;