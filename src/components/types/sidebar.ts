
export interface SidebarSection {
  id: string;
  label: string;
  icon: string;
  content: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
