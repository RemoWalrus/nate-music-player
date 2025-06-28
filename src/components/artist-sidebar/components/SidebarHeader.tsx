
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const SidebarHeader = ({ isCollapsed, setIsCollapsed }: SidebarHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-300/50">
      <div className="flex flex-col">
        <div className="flex justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft
              className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <div className={`${isCollapsed ? "mt-2" : "h-32"} w-full flex flex-col items-center justify-center gap-3`}>
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="https://tfuojbdwzypasskvzicv.supabase.co/storage/v1/object/public/graphics/NathanIconai.svg" 
              alt="Nathan Garcia Logo" 
              className={isCollapsed ? "h-8 w-8" : "h-24 w-32"}
            />
          </Link>
          {!isCollapsed && (
            <span className="text-[#ED2024] font-medium text-lg">About Nathan Garcia</span>
          )}
        </div>
      </div>
    </div>
  );
};
