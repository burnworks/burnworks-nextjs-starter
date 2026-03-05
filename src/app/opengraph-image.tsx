import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px",
        background: "linear-gradient(130deg, #ede4d7, #f8f3ec 45%, #d7e4cf)",
        color: "#1b1c1d",
        fontFamily: "sans-serif",
      }}
    >
      <p style={{ fontSize: 28, letterSpacing: "0.14em", margin: 0 }}>
        {siteConfig.shortName.toUpperCase()}
      </p>
      <h1
        style={{
          marginTop: 24,
          marginBottom: 0,
          fontSize: 74,
          lineHeight: 1.1,
        }}
      >
        {siteConfig.name}
      </h1>
    </div>,
    {
      ...size,
    },
  );
}
