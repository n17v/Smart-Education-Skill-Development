/**
 * SkillBridge AI - Theme Configuration & Style Injector
 * Injects required styles into <head> with zero external CSS files.
 */

// 1. Configure Tailwind CSS with the brand green palette & Inter font family
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Primary brand color
          600: '#059669', // Dark tone 1
          700: '#047857', // Dark tone 2
          800: '#065f46',
          900: '#064e3b',
        },
      },
      animation: {
        'fade-up': 'fadeUp 550ms cubic-bezier(.2,.7,.3,1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
};

(function injectThemeStyles() {
  const css = `
    /* Gentle floating keyframes for brand background blobs */
    @keyframes blobFloat1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-28px, 32px) scale(1.08); }
    }
    @keyframes blobFloat2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(32px, -24px) scale(1.06); }
    }
    @keyframes blobFloat3 {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-45%, -55%) scale(1.12); }
    }

    .blob-1 { animation: blobFloat1 10s ease-in-out infinite alternate; }
    .blob-2 { animation: blobFloat2 11s ease-in-out infinite alternate; }
    .blob-3 { animation: blobFloat3 9s ease-in-out infinite alternate; }

    /* Auth View Transition */
    .auth-view.is-active {
      display: block !important;
      animation: viewFadeUp 320ms ease forwards;
    }

    @keyframes viewFadeUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Floating Label Inputs */
    .field {
      position: relative;
      width: 100%;
    }

    .field input {
      width: 100%;
      background-color: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 0.75rem; /* 12px */
      padding: 22px 16px 8px 16px;
      font-size: 0.875rem; /* 14px */
      line-height: 1.25rem;
      color: #0f172a;
      outline: none;
      transition: border-color 0.18s ease, box-shadow 0.18s ease;
    }

    .field input:hover {
      border-color: #cbd5e1; /* slate-300 */
    }

    .field input:focus {
      border-color: #10b981; /* brand-500 */
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
    }

    .field label {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.875rem;
      color: #94a3b8; /* slate-400 */
      pointer-events: none;
      transform-origin: left top;
      transition: top 0.18s ease, transform 0.18s ease, color 0.18s ease, font-size 0.18s ease;
    }

    /* Floating active state: input focused OR has non-empty value */
    .field.is-floating label,
    .field input:focus ~ label {
      top: 11px;
      transform: translateY(0) scale(0.85);
      color: #059669; /* brand-600 */
      font-weight: 500;
    }

    /* Primary CTA Button */
    .btn-primary {
      position: relative;
      width: 100%;
      border-radius: 0.75rem; /* 12px */
      padding: 14px 20px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      font-weight: 600;
      font-size: 0.875rem;
      box-shadow: 0 6px 20px -6px rgba(16, 185, 129, 0.5);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
      cursor: pointer;
      border: none;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px -6px rgba(16, 185, 129, 0.6);
      filter: brightness(1.03);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 4px 14px -4px rgba(16, 185, 129, 0.45);
    }

    .btn-primary:disabled {
      opacity: 0.85;
      cursor: not-allowed;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.setAttribute('type', 'text/css');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
})();
