import React from "react";

type LoaderProps = {
  size?: number;
  text?: string;
  overlay?: boolean;
};

const Loader: React.FC<LoaderProps> = ({
  size = 14,
  text = "LOADING...",
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
        <div className="loader-dots">
          <span className="dot dot-1" />
          <span className="dot dot-2" />
          <span className="dot dot-3" />
          <span className="dot dot-4" />
        </div>

        <div className="loader-text">{text}</div>
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
            background: rgba(15, 23, 42, 0.08);
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
          }

          .loader-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }

          .loader-box {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 0;
            background: transparent;
            box-shadow: none;
            border: none;
          }

          .loader-dots {
            display: flex;
            align-items: flex-end;
            gap: 10px;
            height: 28px;
          }

          .dot {
            width: ${size}px;
            height: ${size}px;
            border-radius: 9999px;
            display: inline-block;
            animation: bounceWave 0.9s ease-in-out infinite;
            transform-origin: center bottom;
          }

          .dot-1 {
            background: #e76f51;
            animation-delay: 0s;
          }

          .dot-2 {
            background: #e9c46a;
            animation-delay: 0.12s;
          }

          .dot-3 {
            background: #5fc0b7;
            animation-delay: 0.24s;
          }

          .dot-4 {
            background: #3d556b;
            animation-delay: 0.36s;
          }

          .loader-text {
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.28em;
            color: #4b6275;
            user-select: none;
          }

          @keyframes bounceWave {
            0%, 100% {
              transform: translateY(0) scale(1);
              opacity: 0.9;
            }
            30% {
              transform: translateY(-8px) scale(1.05);
              opacity: 1;
            }
            60% {
              transform: translateY(0) scale(1);
              opacity: 0.95;
            }
          }

          @media (max-width: 640px) {
            .loader-dots {
              gap: 8px;
              height: 24px;
            }

            .loader-text {
              font-size: 11px;
              letter-spacing: 0.22em;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .dot {
              animation: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;