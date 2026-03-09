import type { HTMLAttributes } from 'react';

type Orientation = 'vertical' | 'horizontal';

interface LeafletButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
}

/**
 * LeafletButtonGroup — 將 LeafletButton 組成一個 Leaflet 風格的按鈕群組。
 * orientation="vertical"（預設）：上下排列，首尾按鈕分別有上/下圓角，分隔線在底部。
 * orientation="horizontal"：左右排列，首尾按鈕分別有左/右圓角，分隔線在右側。
 */
function LeafletButtonGroup({
  orientation = 'vertical',
  className = '',
  children,
  ...props
}: LeafletButtonGroupProps) {
  const isVertical = orientation === 'vertical';

  return (
    <div
      className={[
        'leaflet-bar',
        isVertical ? 'flex flex-col' : 'flex flex-row',
        // 重置子 button 的 border-radius，由 group 負責管理
        isVertical
          ? '[&>button]:rounded-none [&>button]:border-b [&>button]:border-r-0 [&>button]:last:border-b-0 [&>button:first-child]:rounded-t-sm [&>button:last-child]:rounded-b-sm'
          : '[&>button]:rounded-none [&>button]:border-r [&>button]:border-b-0 [&>button]:last:border-r-0 [&>button:first-child]:rounded-l-sm [&>button:last-child]:rounded-r-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export default LeafletButtonGroup;
