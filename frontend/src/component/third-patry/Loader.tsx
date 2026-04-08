import React from "react";

type LoaderProps = {
  width?: number;
  height?: number;
  overlay?: boolean;
};

const Loader: React.FC<LoaderProps> = ({
  width = 14,
  height = 58,
  overlay = true,
}) => {
  return (
    <div className={overlay ? "loader-overlay" : "loader-wrap"}>
      <div
        className="loader-box"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="loader-bars">
          <span className="bar bar-1" />
          <span className="bar bar-2" />
          <span className="bar bar-3" />
          <span className="bar bar-4" />
          <span className="bar bar-5" />
        </div>
      </div>

      <style>
        {`
          .loader-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
              radial-gradient(circle at top, rgba(168, 85, 247, 0.05), transparent 35%),
              radial-gradient(circle at bottom, rgba(59, 130, 246, 0.05), transparent 35%),
              rgba(15, 23, 42, 0.08);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }

          .loader-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }

          .loader-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            background: transparent;
            border: none;
            box-shadow: none;
          }

          .loader-bars {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            height: ${height + 20}px;
          }

          .bar {
            display: inline-block;
            width: ${width}px;
            height: ${height}px;
            border-radius: 9999px;
            transform-origin: center center;
            animation: stretchBar 1.45s ease-in-out infinite;
            box-shadow:
              0 0 10px rgba(99, 102, 241, 0.16),
              0 0 18px rgba(59, 130, 246, 0.10);
            will-change: transform, opacity;
          }

          .bar-1 {
            background: linear-gradient(180deg, #67e8f9 0%, #38bdf8 100%);
            animation-delay: 0s;
          }

          .bar-2 {
            background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
            animation-delay: 0.14s;
          }

          .bar-3 {
            background: linear-gradient(180deg, #818cf8 0%, #6366f1 100%);
            animation-delay: 0.28s;
          }

          .bar-4 {
            background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
            animation-delay: 0.42s;
          }

          .bar-5 {
            background: linear-gradient(180deg, #c084fc 0%, #a855f7 100%);
            animation-delay: 0.56s;
          }

          @keyframes stretchBar {
            0%, 100% {
              transform: scaleY(0.48);
              opacity: 0.76;
            }
            20% {
              transform: scaleY(1.08);
              opacity: 0.95;
            }
            40% {
              transform: scaleY(0.62);
              opacity: 0.84;
            }
            60% {
              transform: scaleY(1.32);
              opacity: 1;
            }
            80% {
              transform: scaleY(0.72);
              opacity: 0.9;
            }
          }

          @media (max-width: 640px) {
            .loader-bars {
              gap: 10px;
              height: ${Math.max(height, 48)}px;
            }

            .bar {
              width: ${Math.max(width - 2, 8)}px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .bar {
              animation: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;