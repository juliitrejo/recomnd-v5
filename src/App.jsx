import React, { useState, useEffect } from 'react';
import { saveRecommendation, getRecommendations, deleteRecommendation } from './services/recommendationsService';

const MOOD_THEMES = {
  'Para reflexionar': {
    pillBg: '#EAE4F8',
    pillText: '#3B2D5E',
    stripe: '#C4B5FD',
    sparkle: '#DDD6FE',
    icon: '🧠'
  },
  'Para maratonear': {
    pillBg: '#ffe8e8',
    pillText: '#951d1d',
    stripe: '#feb4b4',
    sparkle: '#ffd5d5',
    icon: '⚡'
  },
  'Para reírse': {
    pillBg: '#FEF3C7',
    pillText: '#78350F',
    stripe: '#FDE68A',
    sparkle: '#FEF08A',
    icon: '☺️'
  },
  'Para inspirarse': {
    pillBg: '#cefec3',
    pillText: '#257112',
    stripe: '#6bfd47',
    sparkle: '#97fe8a',
    icon: '✨'
  },
  'Para Desconectar': {
    pillBg: '#ffe0f8',
    pillText: '#812e68',
    stripe: '#fca5d0',
    sparkle: '#fec7e7',
    icon: '☕'
  },
  'Para asustarse': {
    pillBg: '#e9ecef',
    pillText: '#0F172A',
    stripe: '#636e7f',
    sparkle: '#b5bcc4',
    icon: '👻'
  },
  'Para llorar': {
    pillBg: '#E0E7FF',
    pillText: '#312E81',
    stripe: '#A5B4FC',
    sparkle: '#C7D2FE',
    icon: '🥲'
  }
};

const CATEGORY_ICONS = {
  'Película': '🎬',
  'Serie': '📺',
  'Libro': '📖',
};

export default function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Película');
  const [mood, setMood] = useState('Para reflexionar');
  const [recommender, setRecommender] = useState('');
  const [reason, setReason] = useState('');
  const [filterMood, setFilterMood] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('recomnd-dark-mode') === 'true';
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('recomnd-dark-mode', darkMode);
  }, [darkMode]);

  const fetchData = async () => {
    setLoading(true);
    const data = await getRecommendations();
    setRecommendations(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !recommender.trim()) {
      alert("Completá el título y quién te lo recomendó.");
      return;
    }

    const nuevaRecTemp = {
      id: Date.now().toString(),
      title,
      category,
      mood,
      recommender,
      reason
    };

    setRecommendations([nuevaRecTemp, ...recommendations]);
    setTitle('');
    setRecommender('');
    setReason('');

    try {
      await saveRecommendation({ title, category, mood, recommender, reason });
      fetchData();
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      alert("No se pudo guardar en la base de datos, revisá tu conexión.");
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás segura de eliminar esta recomendación?")) {
      setRecommendations(recommendations.filter(item => item.id !== id));
      try {
        await deleteRecommendation(id);
      } catch (error) {
        fetchData();
      }
    }
  };

  const filteredList = recommendations
    .filter(item => {
      const matchesMood = filterMood === 'Todos' || item.mood === filterMood;
      const matchesSearch =
        (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.recommender || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMood && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'alpha') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

  const inputBaseStyle = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    borderRadius: '0.75rem',
    border: '1px solid #E5DFD9',
    fontSize: '0.9rem',
    backgroundColor: '#FFFFFF',
    color: '#261C38',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const selectBaseStyle = {
    ...inputBaseStyle,
    paddingRight: '2.4rem',
    appearance: 'none',
    backgroundImage: darkMode
      ? `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23F4EFFA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
      : `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23261C38' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.85rem center',
    backgroundSize: '0.95rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: '700',
    marginBottom: '0.35rem',
    color: darkMode ? '#F4EFFA' : '#261C38'
  };

  return (
    <div
      className={darkMode ? 'dark-theme' : ''}
      style={{
        minHeight: '100vh',
        backgroundColor: darkMode ? '#140F1D' : '#F7F2EA',
        backgroundImage: darkMode
          ? `
            radial-gradient(circle at 10% 14%, rgba(124, 58, 237, 0.14) 0%, transparent 38%),
            radial-gradient(circle at 90% 82%, rgba(167, 139, 250, 0.1) 0%, transparent 40%)
          `
          : `
            radial-gradient(circle at 8% 12%, rgba(234, 228, 248, 0.7) 0%, transparent 34%),
            radial-gradient(circle at 92% 22%, rgba(254, 243, 199, 0.55) 0%, transparent 32%),
            radial-gradient(circle at 85% 88%, rgba(234, 228, 248, 0.6) 0%, transparent 38%)
          `,
        color: darkMode ? '#F4EFFA' : '#261C38',
        padding: 'clamp(1.25rem, 3vw, 2.25rem) clamp(1rem, 3vw, 2rem) 4rem',
        position: 'relative',
        overflowX: 'hidden',
        transition: 'background-color 0.25s ease, color 0.25s ease'
      }}
    >
      {/* Trazo decorativo superior derecho */}
      <svg
        width="220"
        height="130"
        viewBox="0 0 220 130"
        fill="none"
        style={{ position: 'absolute', top: 0, right: 0, pointerEvents: 'none', opacity: darkMode ? 0.45 : 0.75 }}
      >
        <path
          d="M15 -10 C 5 45, 70 75, 135 45 C 165 30, 175 10, 195 15"
          stroke="#9F7AEA"
          strokeWidth="1.75"
          fill="none"
        />
        <path
          d="M68 -14 C 58 28, 104 52, 162 24 C 186 12, 202 2, 225 6"
          stroke="#C4B5FD"
          strokeWidth="1.25"
          fill="none"
        />
      </svg>

      {/* Trazos decorativos en los bordes */}
      <svg
        width="190"
        height="150"
        viewBox="0 0 190 150"
        fill="none"
        style={{ position: 'absolute', top: '16rem', left: '-1.5rem', pointerEvents: 'none', opacity: darkMode ? 0.32 : 0.55 }}
      >
        <path
          d="M-10 20 C 35 12, 58 52, 34 92 C 18 118, 48 135, 82 125"
          stroke="#B794F4"
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M-5 55 C 24 48, 38 74, 22 98"
          stroke="#D6BCFA"
          strokeWidth="1.15"
          fill="none"
        />
      </svg>

      <svg
        width="210"
        height="160"
        viewBox="0 0 210 160"
        fill="none"
        style={{ position: 'absolute', bottom: '1rem', right: '-1rem', pointerEvents: 'none', opacity: darkMode ? 0.35 : 0.6 }}
      >
        <path
          d="M35 165 C 55 110, 115 95, 165 125 C 188 138, 205 118, 220 95"
          stroke="#9F7AEA"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M78 168 C 94 128, 138 118, 175 140"
          stroke="#C4B5FD"
          strokeWidth="1.15"
          fill="none"
        />
      </svg>

      <div style={{ maxWidth: '1120px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        
        {/* Header Editorial + Botón Modo Oscuro/Claro */}
        <header
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <h1
                className="serif-title dark-text-main"
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 3.25rem)',
                  fontWeight: '800',
                  margin: 0,
                  letterSpacing: '-0.03em',
                  color: '#261C38',
                  lineHeight: 1.05
                }}
              >
                Recomnd
              </h1>
              <img
                src="/logo-recomnd.png"
                alt="Logo Recomnd"
                style={{
                  height: 'clamp(2.2rem, 4.5vw, 2.5rem)',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p
              className="serif-title dark-text-muted"
              style={{
                color: '#4A3F5C',
                margin: 0,
                fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)'
              }}
            >
              Tu bitácora cultural de películas, series y libros organizada por mood.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="mood-pill-btn dark-surface"
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: '2rem',
              border: '1px solid #E5DFD9',
              backgroundColor: '#FFFFFF',
              color: darkMode ? '#F4EFFA' : '#261C38',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
        </header>

        {/* Barra de Búsqueda Ancha */}
        <div style={{ position: 'relative', marginBottom: '1.35rem', width: '100%' }}>
          <span
            style={{
              position: 'absolute',
              left: '1.15rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: darkMode ? '#C4B5FD' : '#4A3F5C',
              fontSize: '1rem',
              pointerEvents: 'none',
              zIndex: 2
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar título o quien recomendó..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 3.2rem 0.85rem 2.85rem',
              borderRadius: '2rem',
              border: '1px solid #EBE5DF',
              backgroundColor: '#FFFFFF',
              color: '#261C38',
              fontSize: '0.92rem',
              boxShadow: '0 2px 10px rgba(38, 28, 56, 0.03)',
              outline: 'none'
            }}
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              title="Limpiar búsqueda"
              style={{
                position: 'absolute',
                right: '0.55rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2.1rem',
                height: '2.1rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#DDD6FE',
                color: '#261C38',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}
            >
              ✕
            </button>
          ) : (
            <div
              style={{
                position: 'absolute',
                right: '0.55rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2.1rem',
                height: '2.1rem',
                borderRadius: '50%',
                backgroundColor: '#DDD6FE',
                color: '#261C38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                pointerEvents: 'none',
                zIndex: 2
              }}
            >
              →
            </div>
          )}
        </div>

        {/* Barra Horizontal de Filtros ("¿Cómo te sentís?" fijo a la izquierda + scroll solo en las píldoras) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
            <span className="dark-text-main" style={{ fontWeight: '700', fontSize: '0.9rem', color: '#261C38', whiteSpace: 'nowrap' }}>
              ¿Cómo te sentís?
            </span>
            <span className="dark-divider" style={{ width: '1px', height: '1.35rem', backgroundColor: '#E2DBD5' }} />
          </div>

          <div
            className="mood-bar-scroll"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              overflowX: 'auto',
              paddingBottom: '0.35rem',
              paddingTop: '0.15rem',
              WebkitOverflowScrolling: 'touch',
              flex: 1,
              minWidth: 0
            }}
          >
            {Object.entries(MOOD_THEMES).map(([moodName, theme]) => {
              const isSelected = filterMood === moodName;
              return (
                <button
                  key={moodName}
                  type="button"
                  className="mood-pill-btn"
                  onClick={() => setFilterMood(isSelected ? 'Todos' : moodName)}
                  style={{
                    padding: '0.48rem 1rem',
                    borderRadius: '2rem',
                    border: isSelected
                      ? `1.5px solid ${darkMode ? '#F4EFFA' : '#261C38'}`
                      : '1px solid transparent',
                    backgroundColor: theme.pillBg,
                    color: theme.pillText,
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? '700' : '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: isSelected ? '0 3px 10px rgba(38, 28, 56, 0.12)' : 'none'
                  }}
                >
                  <span>{theme.icon}</span>
                  <span>{moodName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Principal: Formulario a la izquierda + Listado a la derecha */}
        <div
          className="recomnd-layout-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(290px, 345px) 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}
        >
          
          {/* Tarjeta de Formulario */}
          <div
            className="sticky-sidebar-form dark-surface"
            style={{
              position: 'sticky',
              top: '1.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '1.25rem',
              border: '1px solid #EBE5DF',
              boxShadow: '0 8px 24px -6px rgba(38, 28, 56, 0.05)',
              overflow: 'hidden'
            }}
          >
            {/* Cabecera Lavanda del Formulario */}
            <div
              className="dark-form-header"
              style={{
                background: 'linear-gradient(135deg, #EAE4F8 0%, #DFD6F6 100%)',
                padding: '1.25rem 1.4rem',
                position: 'relative'
              }}
            >
              <h3
                className="serif-title dark-text-main"
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  margin: '0 0 0.2rem 0',
                  color: '#261C38'
                }}
              >
                Nueva recomendación
              </h3>
              <p
                className="serif-title dark-text-muted"
                style={{
                  margin: 0,
                  fontSize: '0.82rem',
                  color: '#4A3F5C'
                }}
              >
                Anotá antes de que te olvides quién te la pasó.
              </p>
            </div>

            {/* Cuerpo del Formulario */}
            <form onSubmit={handleSubmit} style={{ padding: '1.35rem 1.4rem 1.5rem' }}>
              <div style={{ marginBottom: '0.95rem' }}>
                <label style={labelStyle}>Título *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Crepúsculo, Duna..."
                  required
                  style={inputBaseStyle}
                />
              </div>

              <div style={{ marginBottom: '0.95rem' }}>
                <label style={labelStyle}>Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={selectBaseStyle}
                >
                  <option value="Película">🎬 Película</option>
                  <option value="Serie">📺 Serie</option>
                  <option value="Libro">📖 Libro</option>
                </select>
              </div>

              <div style={{ marginBottom: '0.95rem' }}>
                <label style={labelStyle}>Mood / Ocasión</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  style={selectBaseStyle}
                >
                  {Object.keys(MOOD_THEMES).map((mKey) => (
                    <option key={mKey} value={mKey}>
                      {MOOD_THEMES[mKey].icon} {mKey}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '0.95rem' }}>
                <label style={labelStyle}>¿Quién te lo recomendó? *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={recommender}
                    onChange={(e) => setRecommender(e.target.value)}
                    placeholder="Ej: Jazmín, TikTok..."
                    required
                    style={{ ...inputBaseStyle, paddingLeft: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.35rem' }}>
                <label style={labelStyle}>¿Por qué vale la pena?</label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ej: El giro del final es increíble..."
                    rows="2"
                    style={{ ...inputBaseStyle, paddingLeft: '0.9rem', resize: 'vertical', lineHeight: 1.4 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-plum-primary"
                style={{
                  width: '100%',
                  backgroundColor: '#4f3584',
                  color: '#FFFFFF',
                  padding: '0.82rem 1rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <span>+</span>
                <span>Guardar recomendación</span>
              </button>
            </form>
          </div>

          {/* Columna Derecha: Encabezado + Lista de Tarjetas con límite de altura y scroll */}
          <div style={{ minWidth: 0 }}>
            
            {/* Encabezado de Sección */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.15rem',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h2
                  className="serif-title dark-text-main"
                  style={{
                    fontSize: 'clamp(1.35rem, 2.5vw, 1.65rem)',
                    fontWeight: '800',
                    margin: 0,
                    color: '#261C38'
                  }}
                >
                  Mis Recomendaciones
                </h2>
                <span
                  className="dark-badge-lavender"
                  style={{
                    backgroundColor: '#EAE4F8',
                    color: '#261C38',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '1rem'
                  }}
                >
                  {filteredList.length}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {filterMood !== 'Todos' && (
                  <button
                    onClick={() => setFilterMood('Todos')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: darkMode ? '#C4B5FD' : '#6B46C1',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Mostrar todas
                  </button>
                )}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.42rem 2rem 0.42rem 0.85rem',
                    borderRadius: '2rem',
                    border: '1px solid #E5DFD9',
                    backgroundColor: '#FFFFFF',
                    color: '#261C38',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: darkMode
                      ? `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23F4EFFA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
                      : `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23261C38' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.65rem center',
                    backgroundSize: '0.85rem'
                  }}
                >
                  <option value="recent">Ordenar por: Recientes</option>
                  <option value="alpha">Ordenar por: A - Z</option>
                </select>
              </div>
            </div>

            {/* Estados de carga / vacío */}
            {loading && (
              <div
                className="dark-surface dark-text-muted"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: '1.1rem',
                  textAlign: 'center',
                  border: '1px solid #EBE5DF',
                  color: '#6E657E'
                }}
              >
                Cargando tu bitácora...
              </div>
            )}

            {!loading && filteredList.length === 0 && (
              <div
                className="dark-empty-box"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2.75rem 1.5rem',
                  borderRadius: '1.1rem',
                  textAlign: 'center',
                  border: '1.5px dashed #DDD6FE'
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🍿</div>
                <p className="dark-text-main" style={{ margin: '0 0 0.25rem 0', fontWeight: '700', color: '#261C38' }}>
                  No hay recomendaciones con este filtro
                </p>
                <p className="dark-text-muted" style={{ margin: 0, fontSize: '0.85rem', color: '#6E657E' }}>
                  Probá desactivando el mood seleccionado o agregá una nueva recomendación.
                </p>
              </div>
            )}

          {/* Tarjetas de Recomendaciones (con límite de altura y scroll vertical) */}
            <div
              className="recs-list-scroll"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1rem',
                maxHeight: '610px',
                overflowY: 'auto',
                paddingRight: '0.35rem',
                paddingTop: '0.2rem',
                paddingBottom: '0.35rem'
              }}
            >
              {filteredList.map((item) => {
                const theme = MOOD_THEMES[item.mood] || MOOD_THEMES['Para reflexionar'];
                const catIcon = CATEGORY_ICONS[item.category] || '🎬';
                const initial = (item.recommender || '?').trim().charAt(0).toUpperCase();

                return (
                  <div
                    key={item.id}
                    className="rec-card dark-surface"
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: 'clamp(1rem, 2.5vw, 1.35rem) clamp(1rem, 2.5vw, 1.5rem)',
                      borderRadius: '1.1rem',
                      border: '1px solid #EBE5DF',
                      borderLeft: `6px solid ${theme.stripe}`,
                      boxShadow: '0 4px 14px rgba(38, 28, 56, 0.03)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      {/* Etiquetas superiores */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span
                          className="dark-badge-lavender"
                          style={{
                            fontSize: '0.74rem',
                            backgroundColor: '#EAE4F8',
                            color: '#3B2D5E',
                            padding: '0.24rem 0.7rem',
                            borderRadius: '2rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <span>{catIcon}</span>
                          <span>{item.category}</span>
                        </span>

                        <span
                          style={{
                            fontSize: '0.74rem',
                            backgroundColor: theme.pillBg,
                            color: theme.pillText,
                            padding: '0.24rem 0.75rem',
                            borderRadius: '2rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <span>{theme.icon}</span>
                          <span>{item.mood}</span>
                        </span>
                      </div>

                      {/* Título */}
                      <h4
                        className="serif-title dark-text-main"
                        style={{
                          margin: '0 0 0.5rem 0',
                          fontSize: 'clamp(1.15rem, 2.5vw, 1.3rem)',
                          fontWeight: '800',
                          color: '#261C38',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {item.title}
                      </h4>

                      {/* Recomendador */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: item.reason ? '0.65rem' : 0 }}>
                        <span
                          className="dark-avatar-badge"
                          style={{
                            width: '1.45rem',
                            height: '1.45rem',
                            borderRadius: '50%',
                            backgroundColor: '#FCE7F3',
                            color: '#9D174D',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {initial}
                        </span>
                        <span className="dark-text-muted" style={{ color: '#6E657E', fontSize: 'clamp(0.8rem, 1.8vw, 0.85rem)' }}>
                          Recomendado por <strong className="dark-text-main" style={{ color: '#261C38', fontWeight: '700' }}>{item.recommender}</strong>
                        </span>
                      </div>

                      {/* Cita / Motivo (sin serif, heredando fuente) */}
                      {item.reason && (
                        <p
                          className="dark-text-muted"
                          style={{
                            fontFamily: 'inherit',
                            margin: 0,
                            fontStyle: 'italic',
                            color: '#4A3F5C',
                            fontSize: 'clamp(0.84rem, 1.8vw, 0.9rem)',
                            paddingLeft: '0.65rem',
                            borderLeft: `2.5px solid ${theme.stripe}`,
                            lineHeight: 1.45
                          }}
                        >
                          “{item.reason}”
                        </p>
                      )}
                    </div>

                    {/* Botón Borrar */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn-delete-pill"
                      title="Eliminar recomendación"
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        border: 'none',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '2rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        flexShrink: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      <span>🗑️</span>
                      <span>Borrar</span>
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}