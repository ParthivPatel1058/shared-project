import Strands from "@/components/strands/Strands";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Theme-aware animated light-strand background, mounted once at the app root
 * so it persists across every route. Sits behind all content (z-index: -1,
 * pointer-events: none) and is sampled by the frosted-glass cards via
 * backdrop-filter, producing the "liquid glass" refraction effect.
 *
 * Palette swaps with the theme toggle:
 *  - light: teal / cyan / violet (matches --primary/--gradient/--accent)
 *  - dark:  brighter teal / violet / cyan for contrast on the deep background
 */
export default function LiquidBackground() {
  const { theme } = useTheme();

  const palette =
    theme === "dark"
      ? ["#14B8A6", "#8B5CF6", "#22D3EE"]
      : ["#0D9488", "#7C3AED", "#0891B2"];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Strands
        colors={palette}
        count={3}
        speed={0.4}
        amplitude={1.1}
        waviness={1}
        thickness={0.7}
        glow={2.8}
        taper={3}
        spread={1}
        intensity={theme === "dark" ? 0.32 : 0.45}
        saturation={1.4}
        opacity={theme === "dark" ? 0.5 : 0.7}
        scale={1.9}
      />
    </div>
  );
}
