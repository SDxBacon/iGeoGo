import type { ButtonHTMLAttributes } from 'react';

type LeafletButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * LeafletButton — 外觀與 Leaflet 原生控制按鈕（.leaflet-bar a）一致的按鈕元件。
 * 使用在 MapBottomRightControls 等自訂 Leaflet control 內。
 */
function LeafletButton({ className = '', children, ...props }: LeafletButtonProps) {
  return (
    <button
      className={[
        'flex h-[30px] w-[30px] items-center justify-center',
        'border-b border-[#ccc] bg-white text-[#333]',
        'text-xl leading-none',
        'cursor-pointer no-underline',
        'hover:bg-[#f4f4f4] hover:text-[#333]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        'last:border-b-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}

export default LeafletButton;
