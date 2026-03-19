'use client';

import React, { useState, ReactNode } from 'react';
import { usePopper } from 'react-popper';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <>
      <div 
        ref={setReferenceElement} 
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {visible && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="z-[9999] liquid-glass px-4 py-2 text-[10px] font-black uppercase tracking-widest text-deep-grape shadow-2xl animate-fade-in whitespace-nowrap"
        >
          {content}
        </div>
      )}
    </>
  );
}
