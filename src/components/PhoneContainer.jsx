import React from "react";
import { Wifi, Battery, Signal } from "lucide-react";

export default function PhoneContainer({ children, nav }) {
  const timeStr = "09:41";

  return (
    <div className="min-h-screen bg-[#F2E7EB] flex items-center justify-center p-4 sm:p-6 select-none font-albert">
      {/* Outer Phone Shell */}
      <div className="relative w-[393px] h-[820px] bg-[#FDF5F8] rounded-[48px] shadow-mamaeStrong border-[7px] border-[#3D2B33]/8 overflow-hidden flex flex-col">
        
        {/* Simulated Top Status Bar */}
        <div className="w-full h-11 px-6 pt-3 flex items-center justify-between text-[#3D2B33] text-[13px] font-bold z-30 select-none bg-[#FDF5F8]/70 backdrop-blur-md shrink-0">
          <span>{timeStr}</span>
          {/* Top Speaker/Camera Notch Mockup */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[110px] h-[24px] bg-[#3D2B33]/5 rounded-full flex items-center justify-center">
            <div className="w-12 h-1 bg-[#3D2B33]/12 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5 text-[#3D2B33]/70">
            <Signal size={12} strokeWidth={2.5} />
            <Wifi size={12} strokeWidth={2.5} />
            <Battery size={14} strokeWidth={2.5} />
          </div>
        </div>

        {/* Dynamic Screen Content Wrapper */}
        <div className="flex-1 overflow-y-auto scrollbar-none pb-[88px] relative bg-[#FDF5F8]">
          {children}
        </div>

        {/* Fixed Navigation Bar */}
        {nav}

        {/* Simulated Bottom Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[130px] h-1.5 bg-[#3D2B33]/12 rounded-full z-40 pointer-events-none" />
      </div>
    </div>
  );
}
