
import { useState } from "react";
import { ChevronLeft, User, Newspaper } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export const ArtistSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Sidebar
      className={`bg-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-80"
      }`}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="h-16 w-full flex items-center justify-center">
              {/* Logo placeholder - replace with actual SVG */}
              <div className="text-gray-400 text-sm">Logo Space</div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft
              className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className={`text-gray-500 ${isCollapsed ? "sr-only" : ""}`}
          >
            Artist
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 text-gray-700">
                <User className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="space-y-1">
                    <h3 className="font-medium">Nathan Garcia</h3>
                    <p className="text-sm text-gray-500">
                      Mexican singer-songwriter blending traditional and contemporary styles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel
            className={`text-gray-500 ${isCollapsed ? "sr-only" : ""}`}
          >
            Latest News
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Newspaper className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">New Single Release</h4>
                      <p className="text-sm text-gray-500">
                        Latest single "Todo con todo" now available on all platforms.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
