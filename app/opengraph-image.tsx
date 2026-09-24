import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TechMan AMT — Better tech. Smarter upgrades.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0d12", color: "white", padding: "72px", fontFamily: "Arial, sans-serif", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, fontWeight: 800 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: "white", color: "#0a0d12", display: "flex", alignItems: "center", justifyContent: "center" }}>T</div>
          TECHMAN <span style={{ color: "#4c7cff" }}>AMT</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ fontSize: 82, lineHeight: .95, letterSpacing: -4, fontWeight: 800 }}>Better tech.<br/><span style={{ color: "#4c7cff" }}>Smarter upgrades.</span></div>
          <div style={{ fontSize: 25, color: "#aeb5c1", marginTop: 28 }}>Phones · Laptops · Gadgets · Creator Tools</div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 18, color: "#c9ced6" }}>
          <span>Clear product condition</span><span>•</span><span>Secure checkout</span><span>•</span><span>Human support</span>
        </div>
      </div>
      <div style={{ position: "absolute", width: 360, height: 360, borderRadius: 180, background: "#1256f3", opacity: .18, right: -70, top: 60 }}/>
    </div>,
    size
  );
}
