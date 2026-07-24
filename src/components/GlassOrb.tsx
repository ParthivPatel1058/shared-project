import { useTheme } from "@/contexts/ThemeContext";
import Strands from "@/components/strands/Strands";

export interface GlassOrbProps {
  /** Diameter in px — defaults to 320 */
  size?: number;
  className?: string;
}

/**
 * A refractive glass sphere containing animated light strands.
 * Used as a hero accent on the Home dashboard and Auth Welcome screen.
 * Falls back to a static frosted disc under reduced-motion.
 */
export default function GlassOrb({ size = 320, className = "" }: GlassOrbProps) {
  const { theme } = useTheme();

  const palette =
    theme === "dark"
      ? ["#10B981", "#7C3AED", "#06B6D4"]
      : ["#16A34A", "#EAB308", "#F97316"];

  const reducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if (reducedMotion) {
    return (
      <div
        className={`glass-orb-shadow rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 35% 35%, hsl(var(--glass-bg)), hsl(var(--glass-border)))",
          border: "1px solid hsl(var(--glass-border))",
        }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Strands
        colors={palette}
        count={3}
        speed={0.45}
        amplitude={1}
        waviness={1.1}
        thickness={0.6}
        glow={2.4}
        taper={3}
        spread={1.1}
        intensity={theme === "dark" ? 0.55 : 0.5}
        saturation={1.4}
        opacity={1}
        scale={1.5}
        glass
        refraction={1.2}
        dispersion={1.4}
        glassSize={1}
      />
    </div>
  );
}
