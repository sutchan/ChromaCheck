// components/test/ChildShapeIcon.tsx — 儿童模式图形图标（SVG，继承 currentColor）
// chromacheck v1.7.9
import React from 'react';
import type { ChildShape } from '@/lib/questions/child';

export interface ChildShapeIconProps {
  shape: ChildShape;
  size?: number;
}

/** 与 ChildPlate 的点阵图形保持形状一致，供选项按钮复用 */
export function ChildShapeIcon({ shape, size = 28 }: ChildShapeIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true,
  } as const;

  switch (shape) {
    case 'circle':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case 'square':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      );
    case 'triangle':
      return (
        <svg {...common}>
          <path d="M12 3.2 21 20H3z" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 21s-7.6-4.7-9.3-9.2C1.1 8.1 3.2 5 6.3 5c2 0 3.4 1.1 4.2 2.3.8-1.2 2.2-2.3 4.2-2.3 3.1 0 5.2 3.1 3.6 6.8C19.6 16.3 12 21 12 21z" />
        </svg>
      );
    case 'cross':
      return (
        <svg {...common}>
          <path d="M9.2 3h5.6v6.2H21v5.6h-6.2V21H9.2v-6.2H3V9.2h6.2z" />
        </svg>
      );
    default:
      return null;
  }
}
