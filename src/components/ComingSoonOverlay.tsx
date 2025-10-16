import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Camera, Gamepad2 } from "lucide-react";

type IconType = "game" | "calendar" | "camera";

interface ComingSoonOverlayProps {
  title: string;
  description: string;
  icon?: IconType;
  primaryLabel?: string;
  secondaryLabel?: string;
}

const iconMap: Record<IconType, ReactNode> = {
  game: <Gamepad2 className="h-8 w-8 text-white" />,
  calendar: <Calendar className="h-8 w-8 text-white" />,
  camera: <Camera className="h-8 w-8 text-white" />
};

export function ComingSoonOverlay({
  title,
  description,
  icon = "game",
  primaryLabel = "Get Notified",
  secondaryLabel = "Follow Updates"
}: ComingSoonOverlayProps) {
  return (
    <>
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/80 backdrop-blur-md z-10" />

      {/* Card Overlay */}
      <div className="absolute inset-0 flex items-start justify-center z-20 px-4 pt-32">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 w-full max-w-2xl text-center shadow-[0_20px_80px_-20px_rgba(0,0,0,0.35)] border border-orange-200/70">
          <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 grid place-items-center shadow-lg shadow-orange-500/30">
            {iconMap[icon]}
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-orange-800 mb-3">
            {title}
          </h3>
          <p className="text-base md:text-lg text-orange-700/90 leading-relaxed mb-7">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button className="h-11 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md">
              {primaryLabel}
            </Button>
            <Button variant="outline" className="h-11 px-6 rounded-xl border-orange-300 text-orange-700 bg-white/60 hover:bg-white">
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComingSoonOverlay;


