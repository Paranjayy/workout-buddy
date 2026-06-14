import React from 'react'

interface GooeyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'accent'
}

export const GooeyButton: React.FC<GooeyButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <>
      <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>

      <button 
        className={`gooey-btn gooey-btn--${variant} ${className}`}
        {...props}
      >
        <span className="gooey-btn__content">{children}</span>
        <div className="gooey-btn__blobs">
          <div className="gooey-btn__blob"></div>
          <div className="gooey-btn__blob"></div>
          <div className="gooey-btn__blob"></div>
          <div className="gooey-btn__blob"></div>
        </div>
      </button>

      <style>{`
        .gooey-btn {
          position: relative;
          padding: var(--sp-3) var(--sp-6);
          font-size: var(--fs-sm);
          font-weight: 700;
          color: #fff;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1;
          transition: transform 0.2s var(--ease-out);
        }
        
        .gooey-btn:hover {
          transform: scale(1.05);
        }
        
        .gooey-btn:active {
          transform: scale(0.98);
        }

        .gooey-btn__content {
          position: relative;
          z-index: 2;
        }

        .gooey-btn__blobs {
          position: absolute;
          inset: 0;
          z-index: 0;
          filter: url('#goo');
          background: var(--clr-accent);
          border-radius: var(--r-md);
        }

        .gooey-btn--accent .gooey-btn__blobs {
          background: var(--clr-amber);
        }
        
        .gooey-btn--ghost .gooey-btn__blobs {
          background: var(--clr-surface-2);
        }
        .gooey-btn--ghost {
          color: var(--clr-text);
        }

        .gooey-btn__blob {
          position: absolute;
          background: inherit;
          width: 30%;
          height: 100%;
          border-radius: 50%;
          top: 0;
          transition: transform 0.4s var(--ease-out);
        }

        .gooey-btn__blob:nth-child(1) { left: 0; }
        .gooey-btn__blob:nth-child(2) { left: 25%; }
        .gooey-btn__blob:nth-child(3) { left: 50%; }
        .gooey-btn__blob:nth-child(4) { left: 75%; }

        .gooey-btn:hover .gooey-btn__blob:nth-child(1) { transform: translate(-20%, -30%) scale(1.5); }
        .gooey-btn:hover .gooey-btn__blob:nth-child(2) { transform: translate(10%, 40%) scale(1.4); }
        .gooey-btn:hover .gooey-btn__blob:nth-child(3) { transform: translate(-10%, -40%) scale(1.6); }
        .gooey-btn:hover .gooey-btn__blob:nth-child(4) { transform: translate(20%, 30%) scale(1.5); }
      `}</style>
    </>
  )
}
