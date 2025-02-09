
import { LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface SidebarSectionProps {
  label: string;
  icon: LucideIcon;
  isCollapsed: boolean;
  iconProps?: { color: string };
  children?: React.ReactNode;
}

export const SidebarSection = ({ 
  label, 
  icon: Icon, 
  isCollapsed, 
  iconProps = { color: "#ea384c" },
  children 
}: SidebarSectionProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className={`text-gray-500 ${isCollapsed ? "sr-only" : ""}`}
      >
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="px-4 py-2">
          <div className="flex items-center gap-3 text-gray-700">
            <Icon {...iconProps} className="h-5 w-5 shrink-0" />
            {!isCollapsed && children}
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
