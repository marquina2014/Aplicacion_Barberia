import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getLocalDateISO } from '../../utils/dateUtils';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const pad = (n) => String(n).padStart(2, '0');
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

/**
 * Componente: DarkDatePicker
 * Propósito: Selector de fecha propio (reemplaza <input type="date">, cuyo
 * calendario nativo no se puede estilizar). Calendario negro con acentos dorados.
 * Mantiene la interfaz del input nativo: onChange({ target: { value: 'YYYY-MM-DD' } }).
 *
 * @param {Object} props
 * @param {string} [props.id] - Id del botón (permite que la etiqueta lo active)
 * @param {string} props.value - Fecha seleccionada en formato YYYY-MM-DD ('' = vacío)
 * @param {Function} props.onChange - Recibe un evento simulado { target: { value } }
 * @param {string} [props.min] - Fecha mínima permitida (YYYY-MM-DD)
 * @param {string} [props.max] - Fecha máxima permitida (YYYY-MM-DD)
 */
const DarkDatePicker = ({ id, value, onChange, min, max }) => {
  const todayISO = getLocalDateISO();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: 0, m: 0 });
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popRef = useRef(null);

  // Abre el calendario en el mes de la fecha elegida (o el mes actual) y calcula su posición
  const toggle = () => {
    if (!open && triggerRef.current) {
      const [y, m] = (value || todayISO).split('-').map(Number);
      setView({ y, m: m - 1 });
      const r = triggerRef.current.getBoundingClientRect();
      const width = Math.min(310, window.innerWidth - 16);
      const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
      const top = r.bottom + 6 + 340 > window.innerHeight ? Math.max(8, r.top - 346) : r.bottom + 6;
      setPos({ top, left, width });
    }
    setOpen((o) => !o);
  };

  const pick = (iso) => { onChange({ target: { value: iso } }); setOpen(false); };
  const shift = (delta) => setView(({ y, m }) => {
    const d = new Date(y, m + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  // Cierra al hacer clic fuera, con Escape o al redimensionar / hacer scroll en la página
  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onDown = (e) => {
      if (!triggerRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) close();
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

  // Celdas del mes: huecos iniciales (semana inicia en lunes) + días
  const offset = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const total = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const [vy, vm, vd] = value ? value.split('-') : [];
  const label = value ? `${vd}/${vm}/${vy}` : 'dd/mm/aaaa';

  return (
    <>
      <button
        type="button" id={id} ref={triggerRef} onClick={toggle}
        className={`dark-select-trigger ${open ? 'is-open' : ''}`}
      >
        <span className={value ? '' : 'dark-select-placeholder'}>{label}</span>
        <i className="bi bi-calendar3 dark-select-arrow"></i>
      </button>

      {open && createPortal(
        <div ref={popRef} className="dark-calendar" style={{ top: pos.top, left: pos.left, width: pos.width }}>
          <div className="dark-calendar-head">
            <button type="button" className="dark-calendar-nav" onClick={() => shift(-1)}><i className="bi bi-chevron-left"></i></button>
            <strong>{MESES[view.m]} {view.y}</strong>
            <button type="button" className="dark-calendar-nav" onClick={() => shift(1)}><i className="bi bi-chevron-right"></i></button>
          </div>
          <div className="dark-calendar-grid">
            {DIAS.map((d, i) => <span key={i} className="dark-calendar-dow">{d}</span>)}
            {cells.map((day, i) => {
              if (!day) return <span key={`e${i}`} />;
              const iso = toISO(view.y, view.m, day);
              const disabled = (min && iso < min) || (max && iso > max);
              const cls = `dark-calendar-day ${iso === value ? 'selected' : ''} ${iso === todayISO ? 'today' : ''}`;
              return <button key={iso} type="button" className={cls} disabled={disabled} onClick={() => pick(iso)}>{day}</button>;
            })}
          </div>
          <div className="dark-calendar-foot">
            <button type="button" onClick={() => pick('')}>Borrar</button>
            <button type="button" onClick={() => pick(todayISO)}>Hoy</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DarkDatePicker;
