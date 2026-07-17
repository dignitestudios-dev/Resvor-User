import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export default function OfflineStatusDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  useEffect(() => {
    // Avoid hydration mismatch by checking navigator.onLine inside useEffect
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      setShowOnlineToast(true);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowOnlineToast(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-dismiss the online toast after 4 seconds
  useEffect(() => {
    if (showOnlineToast) {
      const timer = setTimeout(() => {
        setShowOnlineToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showOnlineToast]);

  return (
    <>
      {/* Offline Alert Modal */}
      {isOffline && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-xs transition-all duration-300 animate-in fade-in">
          <div className="relative w-full max-w-[420px] rounded-[22px] border border-gray-100 bg-white p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Glowing Offline Icon in Red Container */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border-2 border-red-100 text-red-500">
              <WifiOff className="h-9 w-9 animate-pulse" />
            </div>

            {/* Content */}
            <h2 className="mb-2 text-[22px] font-bold tracking-tight text-[#181818]">
              No Internet Connection
            </h2>
            <p className="mb-6 text-[15px] leading-relaxed text-[#565656]">
              Your internet connection has been disconnected. 
              It will automatically disappear once the connection is restored.
            </p>

            {/* Status bar inside card using Primary theme colors (#010067) */}
            <div className="flex items-center justify-center gap-2.5 text-xs text-[#010067] bg-[#010067]/5 border border-[#010067]/10 rounded-[12px] py-3 px-4 font-semibold">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Real-time connection monitoring active...</span>
            </div>
          </div>
        </div>
      )}

      {/* Online Toast Notification using Theme styles */}
      {showOnlineToast && (
        <div className="fixed bottom-5 right-5 z-[99999] max-w-sm w-full pointer-events-auto flex items-center gap-3.5 p-4 rounded-[16px] border border-emerald-100 bg-white text-[#181818] shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
            <Wifi className="h-5 w-5 animate-bounce" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-[#181818]">Back Online!</h4>
            <p className="text-xs text-[#565656] font-normal">Your internet connection has been restored successfully.</p>
          </div>
          <button
            onClick={() => setShowOnlineToast(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold leading-none p-1.5 rounded-lg hover:bg-gray-50"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
