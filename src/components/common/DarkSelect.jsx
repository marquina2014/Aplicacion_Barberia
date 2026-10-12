import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Componente: DarkSelect
 * Propósito: Selector desplegable propio en negro con borde dorado.
 * Soporta estado bloqueado (disabled) para restringir cambios según rol.
 */
const DarkSelect = ({
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccione...',
  invalid = false,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selected = value !== '' ? options.find((o) => o.value === value) : null;

  const toggle = () => {
    if (disabled) return;
    if (!open && triggerRef.current) {
      const anchor = triggerRef.current.closest('.input-group') || triggerRef.current;
      const r = anchor.getBoundingClientRect();
      const menuHeight = Math.min(240, options.length * 42 + 16);
      const spaceBelow = window.innerHeight - r.bottom;
      const top = spaceBelow < menuHeight + 10 && r.top > menuHeight
        ? Math.max(8, r.top - menuHeight - 6)
        : r.bottom + 6;
      setPos({ top, left: r.left, width: r.width });
    }
    setOpen((o) => !o);
  };

  const choose = (val) => {
    onChange({ target: { value: val } });
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onDown = (e) => {
      if (!triggerRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) close();
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);

  return (
    <div className="dark-select">
      <button
        type="button"
        id={id}
        ref={triggerRef}
        disabled={disabled}
        className={`dark-select-trigger ${open ? 'is-open' : ''} ${invalid ? 'is-invalid' : ''} ${disabled ? 'is-disabled' : ''}`}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? '' : 'dark-select-placeholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <i className={`bi ${disabled ? 'bi-lock-fill' : 'bi-chevron-down'} dark-select-arrow ${open ? 'rotate' : ''}`}></i>
      </button>

      {open && !disabled && createPortal(
        <ul
          ref={menuRef}
          role="listbox"
          className="dark-select-menu"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          {options.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`dark-select-option ${o.value === value ? 'active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(o.value)}
            >
              {o.label}
              {o.value === value && <i className="bi bi-check2"></i>}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
};

export default DarkSelect;
