import React, { useEffect, useState } from "react";

type LoaderProps = {
  durationMs?: number;
  forceVisible?: boolean;
};

const Loader: React.FC<LoaderProps> = ({ durationMs = 5000, forceVisible }) => {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof forceVisible === "boolean") {
      setVisible(forceVisible);
      if (!forceVisible) setLeaving(false);
      return;
    }

    setVisible(true);
    setLeaving(false);

    const timer = setTimeout(() => {
      setLeaving(true);
      const hideTimer = setTimeout(() => setVisible(false), 180);
      return () => clearTimeout(hideTimer);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, forceVisible]);

  if (!visible) return null;

  return (
    <div className={`loader-root ${leaving ? "loader-leave" : ""}`} role="status" aria-live="polite">
      <div className="loader-spinner" aria-label="Loading" />

      <style>
        {`
          .loader-root {
            position: fixed;
            inset: 0;
            z-index: 3000;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity .18s ease;
            opacity: 1;
          }

          .loader-root.loader-leave {
            opacity: 0;
          }

          .loader-spinner {
            width: 36px;
            height: 36px;
            border-radius: 9999px;
            border: 3px solid #e5e7eb;   /* gray-200 */
            border-top-color: #9ca3af;    /* gray-400 */
            animation: spin .8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @media (prefers-reduced-motion: reduce) {
            .loader-spinner {
              animation: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;