import type { DefineComponent } from 'vue';
import type { KubaiIconData } from 'kubai-icons';

export interface KubaiIconProps {
  size?: number | string;
  color?: string;
  /** Layered: 'color' | 'soft'. Line icons (kubai-icons-vue/line): 'outline' (default), 'line-duo', 'fill' or 'solid-tint'. */
  variant?: 'color' | 'soft' | 'outline' | 'line-duo' | 'fill' | 'solid-tint';
  /** Ink of the badge, in every style: any CSS colour, or 'semantic' for its own colour. */
  badgeColor?: string;
  /** Line icons only: the stroke width, any width above 0. Default 2. */
  strokeWidth?: number | string;
  trigger?: 'hover' | 'parent' | 'none';
  hover?: boolean;
  active?: boolean;
  defaultActive?: boolean;
  title?: string;
}
export type KubaiIconComponent = DefineComponent<KubaiIconProps>;
export declare const KubaiIcon: DefineComponent<KubaiIconProps & { icon: KubaiIconData }>;
export declare function createKubaiIcon(name: string, icon: KubaiIconData): KubaiIconComponent;
