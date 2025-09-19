import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DiagonalSectionProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: string;
  angle?: number;
  direction?: "left" | "right";
  topDivider?: boolean;
  bottomDivider?: boolean;
  dividerColor?: string;
}

export default function DiagonalSection({
  children,
  className = "",
  backgroundColor = "bg-cream",
  angle = 2,
  direction = "right",
  topDivider = false,
  bottomDivider = false,
  dividerColor = "bg-white",
}: DiagonalSectionProps) {
  const skewDirection = direction === "left" ? `-${angle}deg` : `${angle}deg`;

  return (
    <div className={cn("relative", className)}>
      {/* Top Diagonal Divider */}
      {topDivider && (
        <div
          className={cn(
            "absolute left-0 right-0 top-0 z-10 h-24",
            dividerColor,
          )}
          style={{
            transform: `skewY(${skewDirection})`,
            transformOrigin: "top left",
          }}
        />
      )}

      {/* Section Background */}
      <div
        className={cn("relative z-0", backgroundColor)}
        style={{
          transform: `skewY(${skewDirection})`,
          transformOrigin: "top left",
        }}
      >
        {/* Content Container - Counter-skew to keep content straight */}
        <div
          style={{
            transform: `skewY(${direction === "left" ? `${angle}deg` : `-${angle}deg`})`,
            transformOrigin: "top left",
          }}
          className="py-24"
        >
          {children}
        </div>
      </div>

      {/* Bottom Diagonal Divider */}
      {bottomDivider && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 z-10 h-24",
            dividerColor,
          )}
          style={{
            transform: `skewY(${skewDirection})`,
            transformOrigin: "bottom left",
          }}
        />
      )}
    </div>
  );
}

// Preset diagonal sections for common use cases
export function HeroDiagonalSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DiagonalSection
      backgroundColor="bg-gradient-to-br from-frostBlue/20 to-cream/50"
      angle={3}
      direction="right"
      bottomDivider
      dividerColor="bg-cream"
      className={className}
    >
      {children}
    </DiagonalSection>
  );
}

export function FeatureDiagonalSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DiagonalSection
      backgroundColor="bg-warmGold/10"
      angle={2}
      direction="left"
      topDivider
      bottomDivider
      dividerColor="bg-cream"
      className={className}
    >
      {children}
    </DiagonalSection>
  );
}

export function TestimonialDiagonalSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DiagonalSection
      backgroundColor="bg-evergreen/5"
      angle={2}
      direction="right"
      topDivider
      dividerColor="bg-cream"
      className={className}
    >
      {children}
    </DiagonalSection>
  );
}
