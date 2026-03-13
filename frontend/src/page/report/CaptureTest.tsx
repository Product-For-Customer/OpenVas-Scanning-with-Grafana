import React from "react";

const CaptureTest: React.FC = () => {
  return (
    <div
      id="capture-root"
      style={{
        minHeight: "100vh",
        margin: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 40%, #eef2ff 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "900px",
          minHeight: "420px",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
          padding: "48px",
          border: "1px solid #dbeafe",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "#eff6ff",
            color: "#0369a1",
            border: "1px solid #bae6fd",
            fontSize: "14px",
            fontWeight: 600,
            width: "fit-content",
          }}
        >
          OpenVAS Report Preview
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "56px",
            lineHeight: 1.1,
            color: "#0f172a",
            fontWeight: 800,
          }}
        >
          Hello Test Capture
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "22px",
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          หน้านี้ใช้สำหรับทดสอบการแคปภาพจาก backend Go ด้วย chromedp
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#0f172a",
              fontWeight: 600,
            }}
          >
            Frontend Route Ready
          </div>
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              background: "#ecfeff",
              border: "1px solid #a5f3fc",
              color: "#155e75",
              fontWeight: 600,
            }}
          >
            Capture Target OK
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptureTest;