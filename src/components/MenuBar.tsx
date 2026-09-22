import { useEffect, useRef, useState } from 'react';

interface MenuItem {
  label: string;
  caret?: boolean;
  brand?: boolean;
  items?: string[];
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Steam', caret: true, brand: true, items: ['Cuenta', 'Ajustes', 'Cambiar de usuario', 'Salir'] },
  { label: 'Ver', items: ['Modo compacto', 'Modo grande', 'Pantalla completa'] },
  { label: 'Amigos', caret: true, items: ['Lista de amigos', 'Añadir amigo', 'Invitar a jugar'] },
  { label: 'Productos', caret: true, items: ['Tienda', 'Biblioteca', 'Comunidad'] },
  { label: 'Ayuda', caret: true, items: ['Centro de ayuda', 'Informar de un error', 'Acerca de'] },
];

export const MenuBar: React.FC = () => {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openLabel) return;
    const onPointerDown = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setOpenLabel(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [openLabel]);

  const toggle = (label: string) => setOpenLabel((current) => (current === label ? null : label));

  return (
    <div
      className="menu-bar"
      role="menubar"
      aria-label="Menú de la aplicación"
      ref={barRef}
    >
      {MENU_ITEMS.map((item) => {
        const open = openLabel === item.label;
        return (
          <span
            key={item.label}
            className={`menu-item${item.brand ? ' menu-item-brand' : ''}${open ? ' open' : ''}`}
            role="menuitem"
            aria-haspopup={item.items ? 'true' : undefined}
            aria-expanded={open}
            tabIndex={0}
            onClick={() => toggle(item.label)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggle(item.label);
              }
            }}
          >
            {item.brand && (
              <img
                className="menu-logo"
                src={`${import.meta.env.BASE_URL}logo/logo.svg`}
                alt=""
                aria-hidden="true"
              />
            )}
            {item.label}
            {item.caret && (
              <span className="menu-caret" aria-hidden="true">
                ▾
              </span>
            )}
            {item.items && open && (
              <span className="menu-dropdown" role="menu">
                {item.items.map((entry) => (
                  <span key={entry} className="menu-dropdown-item" role="menuitem" tabIndex={-1}>
                    {entry}
                  </span>
                ))}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};