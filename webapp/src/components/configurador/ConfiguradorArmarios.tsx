/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';

// ============================================
// RESTRICCIONES DEL CONFIGURADOR - CYDMA
// ============================================

const RESTRICCIONES = {
  dimensiones: {
    altoMin: 200, altoMax: 240,
    anchoMin: 40, anchoMax: 360,
    fondoMin: 45, fondoMax: 70,
  },
  grosores: {
    lateral: 19, trasero: 10, divisor: 19,
    balda: 19, puertaBatiente: 19, puertaCorredera: 16,
  },
  correderas: {
    anchoHojaMin: 70, anchoHojaMax: 110,
    hojasMin: 2, hojasMax: 4,
    solapamiento: 10, retranqueoCarril: 9,
    rangos: [
      { min: 140, max: 220, hojas: 2 },
      { min: 221, max: 330, hojas: 3 },
      { min: 331, max: 440, hojas: 4 },
    ]
  },
  batientes: {
    anchoHojaMin: 35, anchoHojaMax: 60,
    hojasMin: 1, hojasMax: 6,
    holguraEntreHojas: 3, holguraHojaLateral: 3,
  },
  modulos: { anchoMin: 35, anchoMax: 120 },
  maletero: { alturaMin: 40, alturaMax: 60, tieneDivisiones: false },
  interior: { alturaBarraLarga: 140, alturaBarraCorta: 100, separacionMinima: 10 },
  zocalo: { opcional: true, alturaDefecto: 10, retranqueo: 3, regulable: true },
};

// ============================================
// CÁLCULOS DE ESTRUCTURA
// ============================================

const calcularEstructuraBatientes = (anchoCm: number) => {
  const anchoHojaMin = RESTRICCIONES.batientes.anchoHojaMin;
  const anchoHojaMax = RESTRICCIONES.batientes.anchoHojaMax;
  const grosorDivisor = RESTRICCIONES.grosores.divisor / 10;

  let hojas = Math.round(anchoCm / 55);
  hojas = Math.max(1, Math.min(6, hojas));
  let anchoHoja = anchoCm / hojas;
  while (anchoHoja > anchoHojaMax && hojas < 6) { hojas++; anchoHoja = anchoCm / hojas; }
  while (anchoHoja < anchoHojaMin && hojas > 1) { hojas--; anchoHoja = anchoCm / hojas; }

  let modulos: number;
  if (anchoCm <= 120) modulos = 1;
  else if (anchoCm <= 240) modulos = 2;
  else modulos = 3;

  const anchoInterior = anchoCm - (RESTRICCIONES.grosores.lateral / 10 * 2);
  const anchoModuloBase = (anchoInterior - (grosorDivisor * (modulos - 1))) / modulos;
  const anchosModulos = Array(modulos).fill(anchoModuloBase);
  const anchoHojaFinal = anchoCm / hojas;
  const anchosHojas = Array(hojas).fill(anchoHojaFinal);

  return { modulos, hojas, anchoHoja: anchoHojaFinal, anchosModulos, anchosHojas };
};

const calcularEstructuraCorrederas = (anchoCm: number) => {
  const rangos = RESTRICCIONES.correderas.rangos;
  const grosorDivisor = RESTRICCIONES.grosores.divisor / 10;

  let hojas = 2;
  for (const rango of rangos) {
    if (anchoCm >= rango.min && anchoCm <= rango.max) { hojas = rango.hojas; break; }
  }
  if (anchoCm < 140) hojas = 2;
  else if (anchoCm > 440) hojas = 4;

  const solapamiento = RESTRICCIONES.correderas.solapamiento;
  const anchoTotalHojas = anchoCm + (solapamiento * (hojas - 1));
  const anchoHoja = anchoTotalHojas / hojas;

  let modulos: number;
  if (anchoCm <= 150) modulos = 1;
  else if (anchoCm <= 250) modulos = 2;
  else modulos = 3;

  const anchoInterior = anchoCm - (RESTRICCIONES.grosores.lateral / 10 * 2);
  const anchoModuloBase = (anchoInterior - (grosorDivisor * (modulos - 1))) / modulos;
  const anchosModulos = Array(modulos).fill(anchoModuloBase);

  let carriles: { frontal: number; trasero: number };
  if (hojas === 2) carriles = { frontal: 1, trasero: 1 };
  else if (hojas === 3) carriles = { frontal: 2, trasero: 1 };
  else carriles = { frontal: 2, trasero: 2 };

  return { modulos, hojas, anchoHoja, anchosModulos, carriles, retranqueo: RESTRICCIONES.correderas.retranqueoCarril };
};

const getAperturaBatientes = (hojas: number): string[] => {
  const aperturas: Record<number, string[]> = {
    1: ['derecha'], 2: ['izquierda', 'derecha'],
    3: ['izquierda', 'derecha', 'derecha'],
    4: ['izquierda', 'derecha', 'izquierda', 'derecha'],
    5: ['izquierda', 'derecha', 'derecha', 'izquierda', 'derecha'],
    6: ['izquierda', 'derecha', 'izquierda', 'derecha', 'izquierda', 'derecha'],
  };
  return aperturas[hojas] || aperturas[2];
};

const validarConfiguracion = (config: any, estructura: any) => {
  const errores: string[] = [];
  const { dimensiones, tipoPuertas, maletero, alturaMaletero } = config;
  if (dimensiones.alto < RESTRICCIONES.dimensiones.altoMin || dimensiones.alto > RESTRICCIONES.dimensiones.altoMax) errores.push(`Alto: ${RESTRICCIONES.dimensiones.altoMin}–${RESTRICCIONES.dimensiones.altoMax} cm`);
  if (dimensiones.ancho < RESTRICCIONES.dimensiones.anchoMin || dimensiones.ancho > RESTRICCIONES.dimensiones.anchoMax) errores.push(`Ancho: ${RESTRICCIONES.dimensiones.anchoMin}–${RESTRICCIONES.dimensiones.anchoMax} cm`);
  if (dimensiones.fondo < RESTRICCIONES.dimensiones.fondoMin || dimensiones.fondo > RESTRICCIONES.dimensiones.fondoMax) errores.push(`Fondo: ${RESTRICCIONES.dimensiones.fondoMin}–${RESTRICCIONES.dimensiones.fondoMax} cm`);
  if (maletero && (alturaMaletero < RESTRICCIONES.maletero.alturaMin || alturaMaletero > RESTRICCIONES.maletero.alturaMax)) errores.push(`Maletero: ${RESTRICCIONES.maletero.alturaMin}–${RESTRICCIONES.maletero.alturaMax} cm`);
  if (tipoPuertas === 'batientes' && estructura) {
    if (estructura.anchoHoja < RESTRICCIONES.batientes.anchoHojaMin) errores.push(`Hoja muy estrecha (${estructura.anchoHoja.toFixed(1)}cm)`);
    if (estructura.anchoHoja > RESTRICCIONES.batientes.anchoHojaMax) errores.push(`Hoja muy ancha (${estructura.anchoHoja.toFixed(1)}cm)`);
  }
  if (tipoPuertas === 'correderas' && estructura) {
    if (estructura.anchoHoja < RESTRICCIONES.correderas.anchoHojaMin) errores.push(`Hoja corredera muy estrecha`);
    if (estructura.anchoHoja > RESTRICCIONES.correderas.anchoHojaMax) errores.push(`Hoja corredera muy ancha`);
  }
  return errores;
};

// ============================================
// DATOS PROFESIONALES
// ============================================

const ACABADOS_EXTERIOR = [
  { id: 'blanco-premium', nombre: 'Blanco Premium', ref: 'W1000', hex: '#F8F8F8', textura: 'liso' },
  { id: 'blanco-alaska', nombre: 'Blanco Alaska', ref: '', hex: '#FAFAFA', textura: 'liso' },
  { id: 'gris-platino', nombre: 'Gris Platino', ref: 'U708', hex: '#C4C4C4', textura: 'liso' },
  { id: 'antracita', nombre: 'Antracita', ref: 'U963', hex: '#3D3D3D', textura: 'liso' },
  { id: 'negro-grafito', nombre: 'Negro Grafito', ref: 'U999', hex: '#1C1C1C', textura: 'liso' },
  { id: 'roble-natural', nombre: 'Roble Natural', ref: 'H3170', hex: '#C8A87C', textura: 'madera' },
  { id: 'roble-bardolino', nombre: 'Roble Bardolino', ref: 'H1145', hex: '#B89B72', textura: 'madera' },
  { id: 'nogal-aida', nombre: 'Nogal Aida', ref: 'H3704', hex: '#6B4423', textura: 'madera' },
  { id: 'olmo-toscana', nombre: 'Olmo Toscana', ref: 'H1710', hex: '#A08060', textura: 'madera' },
  { id: 'roble-halifax', nombre: 'Roble Halifax', ref: 'H1180', hex: '#8C7355', textura: 'madera' },
];

const ACABADOS_INTERIOR = [
  { id: 'blanco-liso', nombre: 'Blanco Liso', hex: '#F5F5F5', textura: 'liso' },
  { id: 'lino-cancun', nombre: 'Lino Cancún', hex: '#E8E4DC', textura: 'textil', popular: true },
  { id: 'textil-cactus', nombre: 'Textil Cactus', hex: '#E0DCD4', textura: 'textil', popular: true },
  { id: 'textil-coral', nombre: 'Textil Coral', hex: '#F0E8E0', textura: 'textil' },
  { id: 'fresno-cancun', nombre: 'Fresno Cancún', hex: '#DCD4C8', textura: 'madera' },
  { id: 'gris-claro', nombre: 'Gris Claro', hex: '#D8D8D8', textura: 'liso' },
];

const TIRADORES = [
  { id: 'ninguno', nombre: 'Sin tirador (push)', precio: 0 },
  { id: 'uñero', nombre: 'Uñero fresado', precio: 15 },
  { id: 'asa-128', nombre: 'Asa 128mm Inox', precio: 12 },
  { id: 'asa-192', nombre: 'Asa 192mm Inox', precio: 14 },
  { id: 'asa-negro', nombre: 'Asa 128mm Negro', precio: 14 },
];

const ELEMENTOS_INTERIOR: Record<string, any> = {
  'cajonera-3': { nombre: 'Cajonera 3 cajones', categoria: 'cajonera', altura: 54, descripcion: '3×16cm + zócalo', precio: 175, cajones: [16, 16, 16], zocalo: 6 },
  'cajonera-4': { nombre: 'Cajonera 4 cajones', categoria: 'cajonera', altura: 70, descripcion: '4×16cm + zócalo', precio: 210, cajones: [16, 16, 16, 16], zocalo: 6 },
  'cajonera-5': { nombre: 'Cajonera 5 cajones', categoria: 'cajonera', altura: 86, descripcion: '5×16cm + zócalo', precio: 245, cajones: [16, 16, 16, 16, 16], zocalo: 6 },
  'cajonera-mixta': { nombre: 'Cajonera mixta', categoria: 'cajonera', altura: 58, descripcion: '2×10 + 2×18cm', precio: 195, cajones: [18, 18, 10, 10], zocalo: 2 },
  'barra-simple': { nombre: 'Barra de colgar', categoria: 'barra', altura: 4, descripcion: 'Ovalada 30×15mm', precio: 28 },
  'barra-doble': { nombre: 'Doble barra', categoria: 'barra-doble', altura: 4, descripcion: 'Superior + inferior', precio: 52 },
  'balda': { nombre: 'Balda regulable', categoria: 'balda', altura: 2, descripcion: 'Tablero 19mm', precio: 22 },
  'estanteria-4': { nombre: 'Módulo 4 baldas', categoria: 'estanteria', altura: 120, descripcion: 'Espaciado 30cm', precio: 85, numBaldas: 4 },
  'zapatero-ext': { nombre: 'Zapatero extraíble', categoria: 'zapatero', altura: 48, descripcion: '3 bandejas (~12 pares)', precio: 115, niveles: 3 },
  'zapatero-fijo': { nombre: 'Zapatero rejilla', categoria: 'zapatero', altura: 75, descripcion: '5 niveles (~18 pares)', precio: 75, niveles: 5 },
  'pantalonero': { nombre: 'Pantalonero extraíble', categoria: 'pantalonero', altura: 58, descripcion: '12 barras cromadas', precio: 135 },
  'corbatero': { nombre: 'Corbatero lateral', categoria: 'accesorio', altura: 32, descripcion: '32 ganchos', precio: 48 },
};

const PRECIOS = {
  estructuraBase: 320, porM2: 85,
  puertas: { batientes: 95, correderas: 145, plegables: 175 } as Record<string, number>,
  maletero: 28, iluminacion: 95, espejo: 165,
};

// ============================================
// CSS-IN-JS STYLES
// ============================================

const CSS = `
/* Configurador Armarios - Integrado con tema global CYDMA */

* { box-sizing: border-box; margin: 0; padding: 0; }

.cfg-app {
  /* Variables heredadas del tema global */
  --bg: hsl(var(--background));
  --surface: hsl(var(--card));
  --surface-alt: hsl(var(--secondary));
  --border: hsl(var(--border));
  --border-light: hsl(var(--border) / 0.6);
  --text: hsl(var(--foreground));
  --text-secondary: hsl(var(--muted-foreground));
  --text-muted: hsl(var(--muted-foreground) / 0.7);
  --accent: hsl(var(--accent));
  --accent-light: hsl(var(--accent) / 0.7);
  --accent-bg: hsl(var(--accent) / 0.1);
  --accent-bg-hover: hsl(var(--accent) / 0.15);
  --success: #3A7D44;
  --success-bg: #F0F7F1;
  --warning: #C4710C;
  --warning-bg: #FEF7ED;
  --error: #C62828;
  --error-bg: #FFF5F5;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03);
  --radius-sm: calc(var(--radius) * 0.75);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) * 1.5);
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Tipografía heredada del tema */
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.cfg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  z-index: 10;
}
.cfg-logo {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.cfg-logo-mark {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 3px;
  color: var(--text);
}
.cfg-logo-divider {
  width: 1px;
  height: 16px;
  background: var(--border);
  align-self: center;
}
.cfg-logo-sub {
  font-size: 11px;
  font-weight: 400;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}
.cfg-price-block {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.cfg-price-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 400;
}
.cfg-price-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.5px;
}
.cfg-price-currency {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* MAIN LAYOUT */
.cfg-main {
  display: flex;
  flex: 1;
  height: calc(100vh - 56px);
}

/* SIDEBAR */
.cfg-sidebar {
  width: 310px;
  min-width: 310px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.cfg-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  padding: 0 4px;
}
.cfg-tab {
  flex: 1;
  padding: 12px 4px 10px;
  border: none;
  background: transparent;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  border-bottom: 2px solid transparent;
  transition: all var(--transition);
  white-space: nowrap;
}
.cfg-tab:hover { color: var(--text-secondary); }
.cfg-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.cfg-panel {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
.cfg-panel::-webkit-scrollbar { width: 4px; }
.cfg-panel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* SECTION */
.cfg-section { display: flex; flex-direction: column; gap: 16px; }
.cfg-section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

/* FIELD */
.cfg-field { display: flex; flex-direction: column; gap: 6px; }
.cfg-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cfg-label-value {
  font-weight: 600;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

/* SLIDER */
.cfg-slider-wrap { position: relative; padding: 4px 0; }
.cfg-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  outline: none;
  cursor: pointer;
  transition: background var(--transition);
}
.cfg-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid var(--accent);
  cursor: grab;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
}
.cfg-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 0 0 4px hsl(var(--accent) / 0.15);
}
.cfg-slider::-webkit-slider-thumb:active { cursor: grabbing; }
.cfg-slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* BUTTONS */
.cfg-btn-group { display: flex; gap: 6px; }
.cfg-btn-option {
  flex: 1;
  padding: 10px 8px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition);
  text-align: center;
}
.cfg-btn-option:hover { border-color: var(--accent-light); background: var(--surface-alt); }
.cfg-btn-option.active {
  border-color: var(--accent);
  background: var(--accent-bg);
  color: var(--accent);
  font-weight: 600;
}

/* OPTION CARD */
.cfg-option-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
  transition: all var(--transition);
  text-align: left;
  width: 100%;
}
.cfg-option-card:hover { border-color: var(--accent-light); background: var(--surface-alt); }
.cfg-option-card.active {
  border-color: var(--accent);
  background: var(--accent-bg);
}
.cfg-option-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}
.cfg-option-price {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 400;
}

/* SELECT */
.cfg-select {
  padding: 10px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  color: var(--text);
  cursor: pointer;
  transition: border-color var(--transition);
  width: 100%;
}
.cfg-select:focus { outline: none; border-color: var(--accent); }

/* COLOR PALETTE */
.cfg-palette {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.cfg-color-swatch {
  aspect-ratio: 1;
  border: 2.5px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}
.cfg-color-swatch::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
  pointer-events: none;
}
.cfg-color-swatch:hover { transform: scale(1.08); box-shadow: var(--shadow-md); }
.cfg-color-swatch.active {
  border-color: var(--text);
  transform: scale(1.06);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.cfg-color-swatch.popular { box-shadow: 0 0 0 1px var(--accent), inset 0 0 0 1px rgba(0,0,0,0.08); }
.cfg-color-check {
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.cfg-color-name {
  font-size: 10px;
  color: var(--text-muted);
  text-align: center;
  margin-top: 4px;
}

/* CHECKBOX */
.cfg-checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  cursor: pointer;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  transition: all var(--transition);
}
.cfg-checkbox-label:hover { border-color: var(--accent-light); }
.cfg-checkbox-label.checked {
  border-color: var(--accent);
  background: var(--accent-bg);
}
.cfg-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
  cursor: pointer;
}

/* INFO BOX */
.cfg-info {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--surface-alt);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
  line-height: 1.6;
}
.cfg-info strong { color: var(--text); font-weight: 600; }
.cfg-info-row { display: flex; justify-content: space-between; align-items: center; }
.cfg-info-blue {
  background: #EDF4FC;
  border-color: #D0E3F7;
  color: #2B5EA7;
  font-size: 11px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
}

/* ACCORDION */
.cfg-accordion {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: all var(--transition);
}
.cfg-accordion + .cfg-accordion { margin-top: 6px; }
.cfg-accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: none;
  background: var(--surface-alt);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition);
}
.cfg-accordion-header:hover { background: var(--accent-bg); }
.cfg-accordion-header.active {
  background: var(--accent);
  color: white;
}
.cfg-accordion-arrow {
  font-size: 10px;
  transition: transform var(--transition);
}
.cfg-accordion-header.active .cfg-accordion-arrow { transform: rotate(90deg); }
.cfg-accordion-content {
  padding: 6px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cfg-element-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: var(--surface);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all var(--transition);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
.cfg-element-add:hover { background: var(--accent-bg); border-color: var(--accent-light); }
.cfg-element-add-name { font-size: 12px; font-weight: 500; color: var(--text); }
.cfg-element-add-desc { font-size: 10px; color: var(--text-muted); margin-top: 1px; }
.cfg-element-add-price { font-size: 11px; font-weight: 600; color: var(--success); white-space: nowrap; }

/* ELEMENT LIST */
.cfg-element-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
}
.cfg-element-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: var(--surface-alt);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
  gap: 8px;
}
.cfg-element-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.cfg-element-name { font-size: 12px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cfg-element-pos { font-size: 10px; color: var(--text-muted); font-variant-numeric: tabular-nums; }
.cfg-element-controls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.cfg-mini-slider { width: 50px; height: 3px; cursor: pointer; accent-color: var(--accent); }
.cfg-remove-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: var(--error);
  color: white;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  flex-shrink: 0;
}
.cfg-remove-btn:hover { background: #B71C1C; transform: scale(1.1); }
.cfg-empty-msg {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  padding: 20px 12px;
  font-style: italic;
}
.cfg-badge {
  background: var(--accent);
  color: white;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

/* EXTRA TOGGLE */
.cfg-extra {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
}
.cfg-extra:hover { border-color: var(--accent-light); }
.cfg-extra.checked { border-color: var(--accent); background: var(--accent-bg); }
.cfg-extra-content {
  display: flex;
  justify-content: space-between;
  flex: 1;
  font-size: 13px;
  align-items: center;
}
.cfg-extra-price { font-weight: 600; color: var(--success); font-size: 12px; }

/* WARNINGS */
.cfg-warnings {
  margin-top: 16px;
  padding: 10px 14px;
  background: var(--warning-bg);
  border: 1px solid #F5D69E;
  border-radius: var(--radius-md);
}
.cfg-warnings-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--warning);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.cfg-warnings-item { font-size: 11px; color: var(--warning); line-height: 1.5; }

/* VISUALIZER */
.cfg-visualizer {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  gap: 12px;
  min-width: 0;
}
.cfg-viz-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cfg-viz-views { display: flex; gap: 4px; }
.cfg-viz-btn {
  padding: 8px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition);
}
.cfg-viz-btn:hover { border-color: var(--accent-light); }
.cfg-viz-btn.active {
  border-color: var(--accent);
  background: var(--accent);
  color: white;
}
.cfg-viz-toggle {
  padding: 8px 16px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: white;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}
.cfg-viz-toggle:hover { opacity: 0.85; }
.cfg-viz-canvas {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  position: relative;
}
.cfg-viz-dims {
  display: flex;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
.cfg-viz-dims span { opacity: 0.6; }

/* SUMMARY STRIP */
.cfg-summary {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 8px 0;
}
.cfg-summary-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--surface-alt);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid var(--border-light);
}
.cfg-summary-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
}
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ConfiguradorArmarios() {
  const [config, setConfig] = useState({
    dimensiones: { alto: 240, ancho: 220, fondo: 60 },
    tipoPuertas: 'batientes',
    acabadoExterior: 'roble-natural',
    acabadoInterior: 'lino-cancun',
    tirador: 'asa-128',
    maletero: true,
    alturaMaletero: 40,
    elementosInterior: [
      { id: 1, tipo: 'barra-simple', modulo: 0, posicionY: 160 },
      { id: 2, tipo: 'zapatero-fijo', modulo: 0, posicionY: 0 },
      { id: 3, tipo: 'cajonera-4', modulo: 1, posicionY: 0 },
      { id: 4, tipo: 'barra-simple', modulo: 1, posicionY: 155 },
    ],
    extras: { iluminacion: false, espejo: false },
  });

  const [vistaActiva, setVistaActiva] = useState('interior');
  const [puertasAbiertas, setPuertasAbiertas] = useState(true);
  const [moduloSeleccionado, setModuloSeleccionado] = useState(0);
  const [seccionActiva, setSeccionActiva] = useState('dimensiones');
  const [categoriaAbierta, setCategoriaAbierta] = useState<string | null>('cajonera');

  const estructura = useMemo(() => {
    return config.tipoPuertas === 'correderas'
      ? calcularEstructuraCorrederas(config.dimensiones.ancho)
      : calcularEstructuraBatientes(config.dimensiones.ancho);
  }, [config.dimensiones.ancho, config.tipoPuertas]);

  const erroresValidacion = useMemo(() => validarConfiguracion(config, estructura), [config, estructura]);

  const updateConfig = useCallback((path: string, value: any) => {
    setConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = newConfig;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      if (path === 'dimensiones.ancho') {
        const nuevaEstructura = newConfig.tipoPuertas === 'correderas'
          ? calcularEstructuraCorrederas(value)
          : calcularEstructuraBatientes(value);
        newConfig.elementosInterior = newConfig.elementosInterior.filter((el: any) => el.modulo < nuevaEstructura.modulos);
      }
      return newConfig;
    });
  }, []);

  const precio = useMemo(() => {
    const { dimensiones, tipoPuertas, elementosInterior, maletero, tirador, extras } = config;
    const m2 = (dimensiones.alto * dimensiones.ancho) / 10000;
    let total = PRECIOS.estructuraBase + m2 * PRECIOS.porM2;
    total += estructura.hojas * PRECIOS.puertas[tipoPuertas];
    elementosInterior.forEach((el: any) => { const info = ELEMENTOS_INTERIOR[el.tipo]; if (info) total += info.precio; });
    if (tipoPuertas === 'batientes') {
      const tiradorInfo = TIRADORES.find(t => t.id === tirador);
      total += (tiradorInfo?.precio || 0) * estructura.hojas;
    }
    if (maletero) total += PRECIOS.maletero * estructura.modulos;
    if (extras.iluminacion) total += PRECIOS.iluminacion;
    if (extras.espejo) total += PRECIOS.espejo;
    return Math.round(total);
  }, [config, estructura]);

  const addElemento = useCallback((tipo: string) => {
    const nuevoId = Math.max(0, ...config.elementosInterior.map(e => e.id)) + 1;
    const info = ELEMENTOS_INTERIOR[tipo];
    const posY = ['barra', 'barra-doble'].includes(info?.categoria) ? 160 : 0;
    setConfig(prev => ({
      ...prev,
      elementosInterior: [...prev.elementosInterior, { id: nuevoId, tipo, modulo: moduloSeleccionado, posicionY: posY }]
    }));
  }, [moduloSeleccionado, config.elementosInterior]);

  const removeElemento = useCallback((id: number) => {
    setConfig(prev => ({ ...prev, elementosInterior: prev.elementosInterior.filter(e => e.id !== id) }));
  }, []);

  const updateElementoPosicion = useCallback((id: number, posicionY: number) => {
    setConfig(prev => ({
      ...prev,
      elementosInterior: prev.elementosInterior.map(e => e.id === id ? { ...e, posicionY: Math.max(0, posicionY) } : e)
    }));
  }, []);

  const acabadoExt = ACABADOS_EXTERIOR.find(a => a.id === config.acabadoExterior);
  const acabadoInt = ACABADOS_INTERIOR.find(a => a.id === config.acabadoInterior);
  const alturaUtil = config.dimensiones.alto - (config.maletero ? config.alturaMaletero : 0);

  const tabs = [
    { id: 'dimensiones', label: 'Medidas' },
    { id: 'estructura', label: 'Puertas' },
    { id: 'acabados', label: 'Acabados' },
    { id: 'interior', label: 'Interior' },
    { id: 'extras', label: 'Extras' },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="cfg-app">
        <header className="cfg-header">
          <div className="cfg-logo">
            <span className="cfg-logo-mark">CYDMA</span>
            <div className="cfg-logo-divider" />
            <span className="cfg-logo-sub">Configurador de Armarios</span>
          </div>
          <div className="cfg-price-block">
            <span className="cfg-price-label">Estimación</span>
            <span className="cfg-price-value">{precio.toLocaleString('es-ES')}</span>
            <span className="cfg-price-currency">€</span>
          </div>
        </header>

        <div className="cfg-main">
          <aside className="cfg-sidebar">
            <nav className="cfg-tabs">
              {tabs.map(t => (
                <button key={t.id} className={`cfg-tab ${seccionActiva === t.id ? 'active' : ''}`} onClick={() => setSeccionActiva(t.id)}>
                  {t.label}
                </button>
              ))}
            </nav>
            <div className="cfg-panel">
              {seccionActiva === 'dimensiones' && <SeccionDimensiones config={config} updateConfig={updateConfig} />}
              {seccionActiva === 'estructura' && <SeccionEstructura config={config} updateConfig={updateConfig} estructura={estructura} />}
              {seccionActiva === 'acabados' && <SeccionAcabados config={config} updateConfig={updateConfig} />}
              {seccionActiva === 'interior' && (
                <SeccionInterior config={config} alturaUtil={alturaUtil} moduloSeleccionado={moduloSeleccionado}
                  setModuloSeleccionado={setModuloSeleccionado} addElemento={addElemento} removeElemento={removeElemento}
                  updateElementoPosicion={updateElementoPosicion} categoriaAbierta={categoriaAbierta}
                  setCategoriaAbierta={setCategoriaAbierta} estructura={estructura} />
              )}
              {seccionActiva === 'extras' && <SeccionExtras config={config} updateConfig={updateConfig} />}

              {erroresValidacion.length > 0 && (
                <div className="cfg-warnings">
                  <div className="cfg-warnings-title">⚠ Atención</div>
                  {erroresValidacion.map((err, i) => (
                    <div key={i} className="cfg-warnings-item">• {err}</div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <main className="cfg-visualizer">
            <div className="cfg-viz-toolbar">
              <div className="cfg-viz-views">
                {[{ id: 'frontal', label: 'Alzado' }, { id: 'interior', label: 'Interior' }, { id: '3d', label: '3D' }].map(v => (
                  <button key={v.id} className={`cfg-viz-btn ${vistaActiva === v.id ? 'active' : ''}`} onClick={() => setVistaActiva(v.id)}>{v.label}</button>
                ))}
              </div>
              <button className="cfg-viz-toggle" onClick={() => setPuertasAbiertas(!puertasAbiertas)}>
                {puertasAbiertas ? '◇ Cerrar puertas' : '◆ Abrir puertas'}
              </button>
            </div>

            <div className="cfg-viz-canvas">
              {vistaActiva === '3d' ? (
                <Render3D config={config} acabadoExt={acabadoExt} acabadoInt={acabadoInt} puertasAbiertas={puertasAbiertas} estructura={estructura} />
              ) : (
                <RenderTecnico config={config} vistaActiva={vistaActiva} puertasAbiertas={puertasAbiertas}
                  moduloSeleccionado={moduloSeleccionado} setModuloSeleccionado={setModuloSeleccionado}
                  acabadoExt={acabadoExt} acabadoInt={acabadoInt} updateElementoPosicion={updateElementoPosicion}
                  removeElemento={removeElemento} alturaUtil={alturaUtil} estructura={estructura} />
              )}
            </div>

            <div className="cfg-viz-dims">
              {config.dimensiones.ancho} × {config.dimensiones.alto} × {config.dimensiones.fondo} cm
              {config.maletero && <><span>|</span> Maletero: {config.alturaMaletero}cm</>}
              <span>|</span> {estructura.modulos} mód. · {estructura.hojas} hojas
            </div>

            <div className="cfg-summary">
              <div className="cfg-summary-chip">
                <div className="cfg-summary-dot" style={{ background: acabadoExt?.hex }} />
                {acabadoExt?.nombre}
              </div>
              <div className="cfg-summary-chip">
                <div className="cfg-summary-dot" style={{ background: acabadoInt?.hex }} />
                {acabadoInt?.nombre}
              </div>
              <div className="cfg-summary-chip">
                {config.tipoPuertas === 'batientes' ? 'Batientes' : 'Correderas'}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// ============================================
// RENDER TÉCNICO 2D (SVG)
// ============================================

function RenderTecnico({ config, vistaActiva, puertasAbiertas, moduloSeleccionado, setModuloSeleccionado, acabadoExt, acabadoInt, updateElementoPosicion, removeElemento, alturaUtil, estructura }: any) {
  const { dimensiones, tipoPuertas, elementosInterior, maletero, alturaMaletero, tirador } = config;
  const { modulos, hojas } = estructura;
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<any>(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartPos, setDragStartPos] = useState(0);

  const escala = 1.5;
  const anchoSVG = dimensiones.ancho * escala;
  const altoSVG = dimensiones.alto * escala;
  const padding = 70;
  const anchoModulo = anchoSVG / modulos;
  const anchoHoja = anchoSVG / hojas;
  const grosorTablero = 19 * escala / 10;
  const colorEstructura = acabadoExt?.hex || '#C8A87C';
  const colorInterior = acabadoInt?.hex || '#E8E4DC';
  const alturaMaleteroSVG = maletero ? alturaMaletero * escala : 0;

  const handleMouseDown = (e: React.MouseEvent, elemento: any) => {
    if (moduloSeleccionado !== elemento.modulo) return;
    e.preventDefault(); e.stopPropagation();
    setDragging(elemento); setDragStartY(e.clientY); setDragStartPos(elemento.posicionY);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const deltaY = dragStartY - e.clientY;
    const deltaCm = deltaY / escala;
    const newPos = Math.round(dragStartPos + deltaCm);
    const info = ELEMENTOS_INTERIOR[dragging.tipo];
    const maxPos = alturaUtil - (info?.altura || 50);
    updateElementoPosicion(dragging.id, Math.max(0, Math.min(maxPos, newPos)));
  }, [dragging, dragStartY, dragStartPos, escala, alturaUtil, updateElementoPosicion]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const posToSVG = (posY: number, altura: number = 0) => altoSVG - (posY * escala) - (altura * escala);

  const Cota = ({ x1, y1, x2, y2, valor, horizontal = true, offset = 25 }: any) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    if (horizontal) {
      return (
        <g fontSize="9" fill="#8B8580" fontFamily="DM Sans, sans-serif" fontWeight="500">
          <line x1={x1} y1={y1 + offset} x2={x2} y2={y2 + offset} stroke="#C4BFB8" strokeWidth={0.5} />
          <line x1={x1} y1={y1 + offset - 4} x2={x1} y2={y1 + offset + 4} stroke="#C4BFB8" strokeWidth={0.5} />
          <line x1={x2} y1={y2 + offset - 4} x2={x2} y2={y2 + offset + 4} stroke="#C4BFB8" strokeWidth={0.5} />
          <text x={midX} y={y1 + offset + 12} textAnchor="middle">{valor}</text>
        </g>
      );
    } else {
      return (
        <g fontSize="9" fill="#8B8580" fontFamily="DM Sans, sans-serif" fontWeight="500">
          <line x1={x1 - offset} y1={y1} x2={x2 - offset} y2={y2} stroke="#C4BFB8" strokeWidth={0.5} />
          <line x1={x1 - offset - 4} y1={y1} x2={x1 - offset + 4} y2={y1} stroke="#C4BFB8" strokeWidth={0.5} />
          <line x1={x2 - offset - 4} y1={y2} x2={x2 - offset + 4} y2={y2} stroke="#C4BFB8" strokeWidth={0.5} />
          <text x={x1 - offset - 6} y={midY + 3} textAnchor="end">{valor}</text>
        </g>
      );
    }
  };

  const renderElemento = (el: any, xOffset: number) => {
    const info = ELEMENTOS_INTERIOR[el.tipo];
    if (!info) return null;
    const isSelected = moduloSeleccionado === el.modulo;
    const isDragging2 = dragging?.id === el.id;
    const alturaEl = info.altura * escala;
    const yBase = posToSVG(el.posicionY, 0);
    const yTop = posToSVG(el.posicionY, info.altura);
    const margen = grosorTablero + 3;
    const anchoEl = anchoModulo - margen * 2;
    const strokeColor = isDragging2 ? '#2979FF' : (isSelected ? '#8B7355' : '#BBB');
    const strokeWidth = isDragging2 ? 2 : 1;

    const wrapElement = (children: React.ReactNode) => (
      <g key={el.id} style={{ cursor: isSelected ? (isDragging2 ? 'grabbing' : 'grab') : 'pointer' }}
        onMouseDown={(e) => handleMouseDown(e, el)} onClick={() => !isSelected && setModuloSeleccionado(el.modulo)}>
        {children}
        {isSelected && (
          <>
            <rect x={xOffset + anchoEl + margen - 4} y={yTop + alturaEl/2 - 10} width={26} height={16} rx={4} fill="#2979FF" />
            <text x={xOffset + anchoEl + margen + 9} y={yTop + alturaEl/2 + 1} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="DM Sans" fontWeight="600">{el.posicionY}</text>
            <g onClick={(e: React.MouseEvent) => { e.stopPropagation(); removeElemento(el.id); }} style={{ cursor: 'pointer' }}>
              <circle cx={xOffset + margen + 8} cy={yTop + alturaEl/2} r={8} fill="#C62828" />
              <text x={xOffset + margen + 8} y={yTop + alturaEl/2 + 3.5} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">×</text>
            </g>
          </>
        )}
      </g>
    );

    if (info.categoria === 'cajonera') {
      const cajones = info.cajones || [16, 16, 16];
      const zocalo = info.zocalo || 6;
      return wrapElement(
        <g>
          <rect x={xOffset + margen} y={yTop} width={anchoEl} height={alturaEl} fill={colorInterior} stroke={strokeColor} strokeWidth={strokeWidth} rx={1} />
          <rect x={xOffset + margen + 2} y={yBase - zocalo * escala} width={anchoEl - 4} height={zocalo * escala - 1} fill={colorInterior} stroke="#CCC" strokeWidth={0.5} />
          {cajones.map((altCaj: number, idx: number) => {
            const yTopCaj = yBase - zocalo * escala - cajones.slice(0, idx + 1).reduce((a: number, b: number) => a + b, 0) * escala;
            const hCaj = altCaj * escala - 2;
            return (
              <g key={idx}>
                <rect x={xOffset + margen + 2} y={yTopCaj + 1} width={anchoEl - 4} height={hCaj} fill={colorInterior} stroke="#AAA" strokeWidth={0.5} rx={0.5} />
                <rect x={xOffset + anchoModulo/2 - 15} y={yTopCaj + hCaj - 5} width={30} height={3} rx={1.5} fill="#999" />
              </g>
            );
          })}
        </g>
      );
    }

    if (info.categoria === 'barra') {
      const yBarra = yBase - 2 * escala;
      return wrapElement(
        <g>
          <rect x={xOffset + margen + 4} y={yBarra - 15} width={6} height={18} fill="#999" rx={1} />
          <rect x={xOffset + anchoEl + margen - 10} y={yBarra - 15} width={6} height={18} fill="#999" rx={1} />
          <ellipse cx={xOffset + anchoModulo/2} cy={yBarra} rx={(anchoEl - 20) / 2} ry={4} fill="#B0B0B0" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx={xOffset + anchoModulo/2} cy={yBarra - 1} rx={(anchoEl - 25) / 2} ry={1.5} fill="#D0D0D0" opacity={0.5} />
        </g>
      );
    }

    if (info.categoria === 'barra-doble') {
      return wrapElement(
        <g>
          {[168, 83].map((posY, i) => {
            const yB = posToSVG(posY, 0);
            return (
              <g key={i}>
                <rect x={xOffset + margen + 4} y={yB - 15} width={6} height={18} fill="#999" rx={1} />
                <rect x={xOffset + anchoEl + margen - 10} y={yB - 15} width={6} height={18} fill="#999" rx={1} />
                <ellipse cx={xOffset + anchoModulo/2} cy={yB} rx={(anchoEl - 20) / 2} ry={4} fill="#B0B0B0" stroke={strokeColor} strokeWidth={strokeWidth} />
              </g>
            );
          })}
        </g>
      );
    }

    if (info.categoria === 'balda') {
      return wrapElement(
        <g>
          <rect x={xOffset + margen} y={yBase - 3} width={anchoEl} height={5} fill={colorInterior} stroke={strokeColor} strokeWidth={strokeWidth} rx={0.5} />
          <rect x={xOffset + margen + 2} y={yBase - 3} width={5} height={8} fill="#999" rx={0.5} />
          <rect x={xOffset + anchoEl + margen - 7} y={yBase - 3} width={5} height={8} fill="#999" rx={0.5} />
        </g>
      );
    }

    if (info.categoria === 'estanteria') {
      const numBaldas = info.numBaldas || 4;
      const espaciado = alturaEl / numBaldas;
      return wrapElement(
        <g>
          <rect x={xOffset + margen} y={yTop} width={grosorTablero} height={alturaEl} fill={colorInterior} stroke={strokeColor} strokeWidth={0.5} />
          <rect x={xOffset + anchoEl + margen - grosorTablero} y={yTop} width={grosorTablero} height={alturaEl} fill={colorInterior} stroke={strokeColor} strokeWidth={0.5} />
          {Array.from({ length: numBaldas }).map((_, i) => (
            <rect key={i} x={xOffset + margen} y={yTop + (numBaldas - i - 1) * espaciado} width={anchoEl} height={3} fill={colorInterior} stroke="#AAA" strokeWidth={0.5} />
          ))}
          <rect x={xOffset + margen} y={yBase - 3} width={anchoEl} height={3} fill={colorInterior} stroke={strokeColor} strokeWidth={0.5} />
        </g>
      );
    }

    if (info.categoria === 'zapatero') {
      const niveles = info.niveles || 3;
      const espaciado = alturaEl / niveles;
      return wrapElement(
        <g>
          <rect x={xOffset + margen} y={yTop} width={anchoEl} height={alturaEl} fill={colorInterior} stroke={strokeColor} strokeWidth={strokeWidth} rx={1} />
          {Array.from({ length: niveles }).map((_, i) => {
            const yNivel = yBase - (i + 0.5) * espaciado / escala * escala;
            return (
              <g key={i}>
                <line x1={xOffset + margen + 6} y1={yNivel + 4} x2={xOffset + anchoEl + margen - 6} y2={yNivel - 3} stroke="#888" strokeWidth={2} strokeLinecap="round" />
                <line x1={xOffset + anchoEl + margen - 8} y1={yNivel - 3} x2={xOffset + anchoEl + margen - 8} y2={yNivel + 6} stroke="#888" strokeWidth={1.5} strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      );
    }

    if (info.categoria === 'pantalonero') {
      const numBarras = 10;
      const espacioBarras = (alturaEl - 12) / numBarras;
      return wrapElement(
        <g>
          <rect x={xOffset + margen} y={yTop} width={anchoEl} height={alturaEl} fill={colorInterior} stroke={strokeColor} strokeWidth={strokeWidth} rx={1} />
          {Array.from({ length: numBarras }).map((_, i) => (
            <line key={i} x1={xOffset + margen + 8} y1={yBase - 8 - i * espacioBarras / escala * escala} x2={xOffset + anchoEl + margen - 8} y2={yBase - 8 - i * espacioBarras / escala * escala} stroke="#888" strokeWidth={1.5} strokeLinecap="round" />
          ))}
          <rect x={xOffset + anchoModulo/2 - 12} y={yTop + 3} width={24} height={6} rx={3} fill="#888" />
        </g>
      );
    }

    return wrapElement(
      <rect x={xOffset + margen} y={yTop} width={anchoEl} height={alturaEl} fill={colorInterior} stroke={strokeColor} strokeWidth={strokeWidth} rx={2} />
    );
  };

  const getAperturaBatiente = (_index: number, total: number) => {
    const aperturas = getAperturaBatientes(total);
    return aperturas[_index] || 'derecha';
  };

  const getCarrilCorredera = (index: number, total: number) => {
    if (total === 2) return index;
    if (total === 3) return index < 2 ? 1 : 0;
    if (total === 4) return index % 2;
    return index % 2;
  };

  const renderPuertas = () => {
    const puertas: React.ReactNode[] = [];
    const alturaPuerta = altoSVG;

    if (tipoPuertas === 'correderas') {
      const puertasOrdenadas = Array.from({ length: hojas }, (_, i) => ({
        index: i, carril: getCarrilCorredera(i, hojas)
      })).sort((a, b) => a.carril - b.carril);

      puertasOrdenadas.forEach(({ index: i, carril }) => {
        const xBase = i * anchoHoja;
        let offset = 0;
        if (puertasAbiertas) {
          const centroArmario = anchoSVG / 2;
          const centroPuerta = xBase + anchoHoja / 2;
          const direccion = centroPuerta < centroArmario ? 1 : -1;
          offset = direccion * anchoHoja * 0.7;
        }
        const sombra = carril === 1 ? 'drop-shadow(2px 2px 3px rgba(0,0,0,0.12))' : 'none';
        puertas.push(
          <g key={i} style={{ filter: sombra }}>
            <rect x={xBase + offset + 2} y={grosorTablero} width={anchoHoja - 4} height={alturaPuerta - grosorTablero * 2} fill={colorEstructura} stroke="#33333380" strokeWidth={0.8} rx={1} />
            <rect x={xBase + offset + 12} y={grosorTablero + 10} width={anchoHoja - 24} height={alturaPuerta - grosorTablero * 2 - 20} fill="none" stroke="#00000008" strokeWidth={0.5} rx={0.5} />
          </g>
        );
      });
    } else if (tipoPuertas === 'batientes') {
      for (let i = 0; i < hojas; i++) {
        const xBase = i * anchoHoja;
        const apertura = getAperturaBatiente(i, hojas);
        const abreIzq = apertura === 'izquierda';
        const xPivot = abreIzq ? xBase + 2 : xBase + anchoHoja - 2;
        puertas.push(
          <g key={i} style={{
            transformOrigin: `${xPivot}px ${alturaPuerta/2}px`,
            transform: puertasAbiertas ? `perspective(600px) rotateY(${abreIzq ? -55 : 55}deg)` : 'none',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <rect x={xBase + 2} y={grosorTablero} width={anchoHoja - 4} height={alturaPuerta - grosorTablero * 2} fill={colorEstructura} stroke="#33333380" strokeWidth={0.8} rx={1} />
            <rect x={xBase + 12} y={grosorTablero + 10} width={anchoHoja - 24} height={alturaPuerta - grosorTablero * 2 - 20} fill="none" stroke="#00000008" strokeWidth={0.5} rx={0.5} />
            {tirador !== 'ninguno' && (
              <rect x={abreIzq ? xBase + anchoHoja - 16 : xBase + 12} y={alturaPuerta / 2 - 25} width={3} height={50} fill="#777" rx={1.5} />
            )}
          </g>
        );
      }
    }
    return puertas;
  };

  const mostrarInterior = vistaActiva === 'interior' || (vistaActiva === 'frontal' && puertasAbiertas);

  return (
    <svg ref={svgRef} viewBox={`-${padding} -30 ${anchoSVG + padding + 40} ${altoSVG + 75}`} style={{ maxWidth: '100%', maxHeight: '100%', userSelect: 'none' }}>
      <defs>
        <filter id="armario-shadow" x="-5%" y="-5%" width="110%" height="115%">
          <feDropShadow dx="2" dy="4" stdDeviation="8" floodOpacity="0.08" />
        </filter>
        <linearGradient id="interior-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorInterior} stopOpacity="1" />
          <stop offset="100%" stopColor={colorInterior} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <g filter="url(#armario-shadow)">
        <rect x={0} y={0} width={anchoSVG} height={altoSVG} fill="#FAFAFA" stroke="#444" strokeWidth={0.8} rx={1} />
        <rect x={grosorTablero} y={grosorTablero} width={anchoSVG - grosorTablero*2} height={altoSVG - grosorTablero*2} fill="url(#interior-bg)" stroke="none" />

        <rect x={0} y={0} width={grosorTablero} height={altoSVG} fill={colorEstructura} stroke="#44444480" strokeWidth={0.6} rx={0.5} />
        <rect x={anchoSVG - grosorTablero} y={0} width={grosorTablero} height={altoSVG} fill={colorEstructura} stroke="#44444480" strokeWidth={0.6} rx={0.5} />
        <rect x={0} y={0} width={anchoSVG} height={grosorTablero} fill={colorEstructura} stroke="#44444480" strokeWidth={0.6} rx={0.5} />
        <rect x={0} y={altoSVG - grosorTablero} width={anchoSVG} height={grosorTablero} fill={colorEstructura} stroke="#44444480" strokeWidth={0.6} rx={0.5} />

        {maletero && (
          <>
            <rect x={grosorTablero} y={alturaMaleteroSVG - 2} width={anchoSVG - grosorTablero*2} height={4} fill={colorInterior} stroke="#44444450" strokeWidth={0.5} />
            <text x={anchoSVG/2} y={alturaMaleteroSVG/2 + 3} textAnchor="middle" fontSize="9" fill="#AAA" fontFamily="DM Sans" fontWeight="500">MALETERO</text>
          </>
        )}

        {Array.from({ length: modulos - 1 }).map((_, i) => (
          <rect key={i} x={(i + 1) * anchoModulo - grosorTablero/2} y={alturaMaleteroSVG} width={grosorTablero} height={altoSVG - alturaMaleteroSVG - grosorTablero} fill={colorInterior} stroke="#44444450" strokeWidth={0.5} />
        ))}

        {mostrarInterior && elementosInterior.map((el: any) => renderElemento(el, el.modulo * anchoModulo))}

        {mostrarInterior && (
          <rect x={moduloSeleccionado * anchoModulo + grosorTablero + 1} y={alturaMaleteroSVG + 3} width={anchoModulo - grosorTablero*2 - 2} height={altoSVG - alturaMaleteroSVG - grosorTablero - 6} fill="none" stroke="#8B7355" strokeWidth={1.5} strokeDasharray="8 4" opacity={0.4} rx={2} />
        )}

        {mostrarInterior && Array.from({ length: modulos }).map((_, i) => (
          <rect key={`click-${i}`} x={i * anchoModulo} y={alturaMaleteroSVG} width={anchoModulo} height={altoSVG - alturaMaleteroSVG} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => setModuloSeleccionado(i)} />
        ))}

        {vistaActiva === 'frontal' && renderPuertas()}
      </g>

      <g>
        <Cota x1={0} y1={altoSVG} x2={anchoSVG} y2={altoSVG} valor={`${dimensiones.ancho}`} horizontal offset={30} />
        <Cota x1={0} y1={0} x2={0} y2={altoSVG} valor={`${dimensiones.alto}`} horizontal={false} offset={40} />
        {Array.from({ length: modulos }).map((_, i) => (
          <Cota key={`mod-${i}`} x1={i * anchoModulo} y1={altoSVG} x2={(i + 1) * anchoModulo} y2={altoSVG} valor={`${Math.round(dimensiones.ancho / modulos)}`} horizontal offset={15} />
        ))}
        {maletero && (
          <>
            <Cota x1={anchoSVG} y1={alturaMaleteroSVG} x2={anchoSVG} y2={altoSVG} valor={`${alturaUtil}`} horizontal={false} offset={-30} />
            <Cota x1={anchoSVG} y1={0} x2={anchoSVG} y2={alturaMaleteroSVG} valor={`${alturaMaletero}`} horizontal={false} offset={-30} />
          </>
        )}
      </g>

      <text x={anchoSVG / 2} y={-12} textAnchor="middle" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="600" fill="#8B8580" letterSpacing="1">
        {vistaActiva === 'frontal' ? 'ALZADO FRONTAL' : 'SECCIÓN INTERIOR'}
      </text>
    </svg>
  );
}

// ============================================
// RENDER 3D
// ============================================

function Render3D({ config, acabadoExt, acabadoInt, puertasAbiertas, estructura }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const armarioGroupRef = useRef<THREE.Group | null>(null);
  const environmentRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  const [rotation, setRotation] = useState({ x: 0.12, y: -0.25 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f4f1);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(32, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 8, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);
    const fillLight = new THREE.DirectionalLight(0xffeedd, 0.3);
    fillLight.position.set(-4, 4, -3);
    scene.add(fillLight);

    const environmentGroup = new THREE.Group();
    scene.add(environmentGroup);
    environmentRef.current = environmentGroup;

    const armarioGroup = new THREE.Group();
    scene.add(armarioGroup);
    armarioGroupRef.current = armarioGroup;

    const container = containerRef.current;
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      isInitializedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (armarioGroupRef.current) {
      armarioGroupRef.current.rotation.x = rotation.x;
      armarioGroupRef.current.rotation.y = rotation.y;
    }
    if (environmentRef.current) environmentRef.current.rotation.y = rotation.y;
  }, [rotation]);

  useEffect(() => {
    if (!armarioGroupRef.current || !environmentRef.current) return;
    const armarioGroup = armarioGroupRef.current;
    const envGroup = environmentRef.current;

    while (armarioGroup.children.length > 0) {
      const child = armarioGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m: any) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
      armarioGroup.remove(child);
    }
    while (envGroup.children.length > 0) {
      const child = envGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      envGroup.remove(child);
    }

    const { dimensiones, tipoPuertas, elementosInterior, maletero, alturaMaletero, extras, tirador } = config;
    const { modulos, hojas } = estructura;
    const scale = 0.01;
    const w = dimensiones.ancho * scale;
    const h = dimensiones.alto * scale;
    const d = dimensiones.fondo * scale;
    const thickness = 0.019;
    const maleteroH = maletero ? alturaMaletero * scale : 0;

    // Environment
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ color: 0xd5d0c8, roughness: 0.85 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -h / 2 - 0.005;
    floor.receiveShadow = true;
    envGroup.add(floor);

    const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), new THREE.MeshStandardMaterial({ color: 0xe8e4df, roughness: 0.9 }));
    wall.position.set(0, 0.5, -d / 2 - 0.2);
    envGroup.add(wall);

    const matExterior = new THREE.MeshStandardMaterial({ color: acabadoExt?.hex || '#C8A87C', roughness: acabadoExt?.textura === 'madera' ? 0.6 : 0.3, metalness: 0.02 });
    const matInterior = new THREE.MeshStandardMaterial({ color: acabadoInt?.hex || '#E8E4DC', roughness: 0.5 });
    const matMetal = new THREE.MeshStandardMaterial({ color: '#A0A0A0', roughness: 0.2, metalness: 0.8 });
    const matFondo = new THREE.MeshStandardMaterial({ color: new THREE.Color(acabadoInt?.hex || '#E8E4DC').multiplyScalar(0.92), roughness: 0.6 });

    // Back panel
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(w - thickness * 2, h - thickness * 2, thickness / 3), matFondo);
    backPanel.position.set(0, 0, -d / 2 + thickness / 6);
    armarioGroup.add(backPanel);

    // Structure panels
    const topPanel = new THREE.Mesh(new THREE.BoxGeometry(w, thickness, d), matExterior);
    topPanel.position.set(0, h / 2 - thickness / 2, 0); topPanel.castShadow = true;
    armarioGroup.add(topPanel);

    const bottomPanel = new THREE.Mesh(new THREE.BoxGeometry(w, thickness, d), matExterior);
    bottomPanel.position.set(0, -h / 2 + thickness / 2, 0); bottomPanel.castShadow = true;
    armarioGroup.add(bottomPanel);

    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(thickness, h, d), matExterior);
    leftPanel.position.set(-w / 2 + thickness / 2, 0, 0); leftPanel.castShadow = true;
    armarioGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(thickness, h, d), matExterior);
    rightPanel.position.set(w / 2 - thickness / 2, 0, 0); rightPanel.castShadow = true;
    armarioGroup.add(rightPanel);

    if (maletero) {
      const maleteroShelf = new THREE.Mesh(new THREE.BoxGeometry(w - thickness * 2, thickness, d - thickness), matInterior);
      maleteroShelf.position.set(0, h / 2 - maleteroH - thickness / 2, thickness / 2);
      armarioGroup.add(maleteroShelf);
    }

    const moduleWidth = w / modulos;
    for (let i = 1; i < modulos; i++) {
      const divider = new THREE.Mesh(new THREE.BoxGeometry(thickness, h - thickness * 2 - maleteroH, d - thickness), matInterior);
      divider.position.set(-w / 2 + moduleWidth * i, -maleteroH / 2, thickness / 2);
      armarioGroup.add(divider);
    }

    const interiorDepth = d - thickness;
    const zInteriorBase = -d / 2 + thickness;

    elementosInterior.forEach((el: any) => {
      const info = ELEMENTOS_INTERIOR[el.tipo];
      if (!info) return;
      const moduleX = -w / 2 + moduleWidth * el.modulo + moduleWidth / 2;
      const baseY = -h / 2 + thickness + el.posicionY * scale;
      const elementWidth = moduleWidth - thickness * 3;

      if (info.categoria === 'cajonera') {
        const cajones = info.cajones || [16, 16, 16];
        const zocalo = info.zocalo || 6;
        let currentY = baseY + zocalo * scale;
        const cajonDepth = interiorDepth * 0.75;
        cajones.forEach((cajonH: number) => {
          const cajonHeight = cajonH * scale * 0.85;
          const cajon = new THREE.Mesh(new THREE.BoxGeometry(elementWidth * 0.9, cajonHeight, cajonDepth), matInterior);
          cajon.position.set(moduleX, currentY + cajonH * scale / 2, zInteriorBase + cajonDepth / 2 + 0.01);
          armarioGroup.add(cajon);
          const handle = new THREE.Mesh(new THREE.BoxGeometry(elementWidth * 0.2, 0.005, 0.01), matMetal);
          handle.position.set(moduleX, currentY + cajonH * scale * 0.4, zInteriorBase + cajonDepth + 0.015);
          armarioGroup.add(handle);
          currentY += cajonH * scale;
        });
      }

      if (info.categoria === 'barra') {
        const barY = baseY + 0.02;
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, elementWidth - 0.02, 12), matMetal);
        bar.rotation.z = Math.PI / 2;
        bar.position.set(moduleX, barY, zInteriorBase + interiorDepth * 0.4);
        armarioGroup.add(bar);
        [-1, 1].forEach(side => {
          const support = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.025, 0.015), matMetal);
          support.position.set(moduleX + side * (elementWidth / 2 - 0.015), barY - 0.008, zInteriorBase + interiorDepth * 0.4);
          armarioGroup.add(support);
        });
      }

      if (info.categoria === 'barra-doble') {
        [165, 80].forEach(posY => {
          const barY = -h / 2 + thickness + posY * scale;
          const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, elementWidth - 0.02, 12), matMetal);
          bar.rotation.z = Math.PI / 2;
          bar.position.set(moduleX, barY, zInteriorBase + interiorDepth * 0.4);
          armarioGroup.add(bar);
        });
      }

      if (info.categoria === 'estanteria') {
        const numShelves = info.numBaldas || 4;
        const spacing = info.altura * scale / numShelves;
        const shelfDepth = interiorDepth * 0.85;
        for (let i = 0; i <= numShelves; i++) {
          const shelf = new THREE.Mesh(new THREE.BoxGeometry(elementWidth, thickness / 2, shelfDepth), matInterior);
          shelf.position.set(moduleX, baseY + i * spacing, zInteriorBase + shelfDepth / 2 + 0.01);
          armarioGroup.add(shelf);
        }
      }

      if (info.categoria === 'zapatero') {
        const levels = info.niveles || 3;
        const spacing = info.altura * scale / levels;
        const rackDepth = interiorDepth * 0.5;
        for (let i = 0; i < levels; i++) {
          const rack = new THREE.Mesh(new THREE.BoxGeometry(elementWidth * 0.85, 0.003, rackDepth), matMetal);
          rack.rotation.x = -0.15;
          rack.position.set(moduleX, baseY + (i + 0.5) * spacing, zInteriorBase + rackDepth / 2 + 0.02);
          armarioGroup.add(rack);
        }
      }

      if (info.categoria === 'pantalonero') {
        const numBars = 10;
        const spacing = (info.altura * scale - 0.01) / numBars;
        for (let i = 0; i < numBars; i++) {
          const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, elementWidth * 0.8, 8), matMetal);
          bar.rotation.z = Math.PI / 2;
          bar.position.set(moduleX, baseY + 0.01 + i * spacing, zInteriorBase + interiorDepth * 0.3);
          armarioGroup.add(bar);
        }
      }

      if (info.categoria === 'balda') {
        const shelfDepth = interiorDepth * 0.85;
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(elementWidth, thickness, shelfDepth), matInterior);
        shelf.position.set(moduleX, baseY, zInteriorBase + shelfDepth / 2 + 0.01);
        armarioGroup.add(shelf);
      }
    });

    // Doors
    const doorWidth = w / hojas - 0.005;
    const doorHeight = h - thickness * 2;
    const hojaWidth = w / hojas;

    const getApertura = (index: number, total: number) => {
      if (total === 1) return 'derecha';
      if (total === 2) return index === 0 ? 'izquierda' : 'derecha';
      if (total === 3) return index === 0 ? 'izquierda' : 'derecha';
      if (total === 4) return (index === 0 || index === 2) ? 'izquierda' : 'derecha';
      if (total === 5) return (index === 0 || index === 3) ? 'izquierda' : 'derecha';
      return index % 2 === 0 ? 'izquierda' : 'derecha';
    };

    const getCarril = (index: number, total: number) => {
      if (total === 2) return index;
      if (total === 3) return index < 2 ? 1 : 0;
      if (total === 4) return index % 2;
      return index % 2;
    };

    if (tipoPuertas === 'correderas') {
      for (let i = 0; i < hojas; i++) {
        const doorX = -w / 2 + hojaWidth * i + hojaWidth / 2;
        const carril = getCarril(i, hojas);
        let offsetX = 0;
        if (puertasAbiertas) { offsetX = (doorX < 0 ? 1 : -1) * hojaWidth * 0.65; }
        const zOffset = carril === 1 ? 0.006 : 0;
        const door = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, thickness / 2), matExterior);
        door.position.set(doorX + offsetX, 0, d / 2 + zOffset);
        door.castShadow = true;
        armarioGroup.add(door);
        if (tirador !== 'ninguno') {
          const handleX = doorX < 0 ? doorWidth / 2 - 0.03 : -doorWidth / 2 + 0.03;
          const doorHandle = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.07, 0.01), matMetal);
          doorHandle.position.set(doorX + offsetX + handleX, 0, d / 2 + zOffset + thickness / 4 + 0.005);
          armarioGroup.add(doorHandle);
        }
      }
    } else if (tipoPuertas === 'batientes') {
      for (let i = 0; i < hojas; i++) {
        const doorX = -w / 2 + hojaWidth * i + hojaWidth / 2;
        const apertura = getApertura(i, hojas);
        const opensLeft = apertura === 'izquierda';
        const doorGroup = new THREE.Group();
        const door = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, thickness / 2), matExterior);
        door.position.set(opensLeft ? doorWidth / 2 : -doorWidth / 2, 0, 0);
        door.castShadow = true;
        doorGroup.add(door);
        if (tirador !== 'ninguno') {
          const handleX = opensLeft ? doorWidth - 0.03 : -doorWidth + 0.03;
          const doorHandle = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.07, 0.01), matMetal);
          doorHandle.position.set(handleX, 0, thickness / 4 + 0.005);
          doorGroup.add(doorHandle);
        }
        doorGroup.position.set(opensLeft ? doorX - doorWidth / 2 : doorX + doorWidth / 2, 0, d / 2 + thickness / 4);
        if (puertasAbiertas) doorGroup.rotation.y = opensLeft ? -Math.PI / 2.5 : Math.PI / 2.5;
        armarioGroup.add(doorGroup);
      }
    }

    if (extras.iluminacion) {
      const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(w - thickness * 4, 0.005, 0.015), new THREE.MeshBasicMaterial({ color: 0xfffae0 }));
      ledStrip.position.set(0, h / 2 - maleteroH - thickness - 0.01, -d / 2 + 0.05);
      armarioGroup.add(ledStrip);
      const ledLight = new THREE.PointLight(0xfffae0, 0.2, 0.5);
      ledLight.position.set(0, h / 2 - maleteroH - thickness - 0.02, 0);
      armarioGroup.add(ledLight);
    }

    if (cameraRef.current) cameraRef.current.position.z = Math.max(w, h) * 2.2;
  }, [config, acabadoExt, acabadoInt, puertasAbiertas, estructura]);

  const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); lastMouseRef.current = { x: e.clientX, y: e.clientY }; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseRef.current.x;
    const deltaY = e.clientY - lastMouseRef.current.y;
    setRotation(prev => ({
      x: Math.max(-Math.PI / 6, Math.min(Math.PI / 6, prev.x + deltaY * 0.005)),
      y: prev.y + deltaX * 0.005
    }));
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} />
      <button onClick={() => setRotation({ x: 0.12, y: -0.25 })}
        style={{ position: 'absolute', bottom: 12, right: 12, padding: '6px 14px', background: 'rgba(26,26,26,0.7)', backdropFilter: 'blur(8px)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans' }}>
        ↺ Reset vista
      </button>
      <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '5px 10px', background: 'rgba(26,26,26,0.5)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: 6, fontSize: 10, fontFamily: 'DM Sans' }}>
        Arrastra para rotar
      </div>
    </div>
  );
}

// ============================================
// SECCIONES DEL PANEL
// ============================================

function SeccionDimensiones({ config, updateConfig }: any) {
  return (
    <div className="cfg-section">
      <div className="cfg-section-title">Dimensiones</div>
      {[
        { key: 'alto', label: 'Alto total', min: RESTRICCIONES.dimensiones.altoMin, max: RESTRICCIONES.dimensiones.altoMax, step: 5 },
        { key: 'ancho', label: 'Ancho total', min: RESTRICCIONES.dimensiones.anchoMin, max: RESTRICCIONES.dimensiones.anchoMax, step: 10 },
        { key: 'fondo', label: 'Fondo', min: RESTRICCIONES.dimensiones.fondoMin, max: RESTRICCIONES.dimensiones.fondoMax, step: 5 }
      ].map(dim => (
        <div key={dim.key} className="cfg-field">
          <label className="cfg-label">
            <span>{dim.label}</span>
            <span className="cfg-label-value">{config.dimensiones[dim.key]} cm</span>
          </label>
          <div className="cfg-slider-wrap">
            <input type="range" className="cfg-slider" min={dim.min} max={dim.max} step={dim.step}
              value={config.dimensiones[dim.key]} onChange={e => updateConfig(`dimensiones.${dim.key}`, parseInt(e.target.value))}
              style={{ background: `linear-gradient(to right, #8B7355 ${((config.dimensiones[dim.key] - dim.min) / (dim.max - dim.min)) * 100}%, #E8E5E0 ${((config.dimensiones[dim.key] - dim.min) / (dim.max - dim.min)) * 100}%)` }} />
          </div>
          <div className="cfg-slider-labels"><span>{dim.min}</span><span>{dim.max}</span></div>
        </div>
      ))}
      <div className="cfg-field">
        <label className={`cfg-checkbox-label ${config.maletero ? 'checked' : ''}`}>
          <input type="checkbox" className="cfg-checkbox" checked={config.maletero} onChange={e => updateConfig('maletero', e.target.checked)} />
          <span>Maletero superior</span>
        </label>
        {config.maletero && (
          <div style={{ marginTop: 8 }}>
            <label className="cfg-label">
              <span>Altura maletero</span>
              <span className="cfg-label-value">{config.alturaMaletero} cm</span>
            </label>
            <div className="cfg-slider-wrap">
              <input type="range" className="cfg-slider" min={RESTRICCIONES.maletero.alturaMin} max={RESTRICCIONES.maletero.alturaMax} step={5}
                value={config.alturaMaletero} onChange={e => updateConfig('alturaMaletero', parseInt(e.target.value))}
                style={{ background: `linear-gradient(to right, #8B7355 ${((config.alturaMaletero - 40) / 20) * 100}%, #E8E5E0 ${((config.alturaMaletero - 40) / 20) * 100}%)` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SeccionEstructura({ config, updateConfig, estructura }: any) {
  const esCorredera = config.tipoPuertas === 'correderas';
  return (
    <div className="cfg-section">
      <div className="cfg-section-title">Estructura & Puertas</div>

      <div className="cfg-info">
        <div style={{ marginBottom: 6, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8B7355' }}>Configuración automática</div>
        <div className="cfg-info-row"><span>{estructura.modulos} módulo{estructura.modulos > 1 ? 's' : ''}</span><span style={{ fontWeight: 600 }}>{estructura.hojas} hoja{estructura.hojas > 1 ? 's' : ''}</span></div>
        <div className="cfg-info-row"><span>Ancho/hoja</span><span style={{ fontWeight: 600 }}>{estructura.anchoHoja?.toFixed(1)} cm</span></div>
        {esCorredera && estructura.carriles && (
          <div className="cfg-info-row"><span>Carriles</span><span style={{ fontWeight: 600 }}>{estructura.carriles.frontal}F + {estructura.carriles.trasero}T</span></div>
        )}
      </div>

      <div className="cfg-field">
        <label className="cfg-label">Tipo de puertas</label>
        {[{ id: 'batientes', nombre: 'Batientes', precio: PRECIOS.puertas.batientes }, { id: 'correderas', nombre: 'Correderas', precio: PRECIOS.puertas.correderas }].map(tipo => (
          <button key={tipo.id} className={`cfg-option-card ${config.tipoPuertas === tipo.id ? 'active' : ''}`} onClick={() => updateConfig('tipoPuertas', tipo.id)}>
            <span className="cfg-option-name">{tipo.nombre}</span>
            <span className="cfg-option-price">+{tipo.precio}€/hoja</span>
          </button>
        ))}
      </div>

      {!esCorredera && (
        <div className="cfg-field">
          <label className="cfg-label">Tirador</label>
          <select className="cfg-select" value={config.tirador} onChange={e => updateConfig('tirador', e.target.value)}>
            {TIRADORES.map(t => <option key={t.id} value={t.id}>{t.nombre} {t.precio > 0 ? `(+${t.precio}€)` : ''}</option>)}
          </select>
        </div>
      )}

      {esCorredera && <div className="cfg-info-blue">ℹ Las puertas correderas no llevan tirador</div>}
    </div>
  );
}

function SeccionAcabados({ config, updateConfig }: any) {
  return (
    <div className="cfg-section">
      <div className="cfg-section-title">Acabados</div>
      <div className="cfg-field">
        <label className="cfg-label">Exterior</label>
        <div className="cfg-palette">
          {ACABADOS_EXTERIOR.map(a => (
            <button key={a.id} className={`cfg-color-swatch ${config.acabadoExterior === a.id ? 'active' : ''}`}
              style={{ backgroundColor: a.hex }} onClick={() => updateConfig('acabadoExterior', a.id)} title={a.nombre}>
              {config.acabadoExterior === a.id && <span className="cfg-color-check" style={{ color: ['#F8F8F8', '#FAFAFA', '#C4C4C4'].includes(a.hex) ? '#333' : '#fff' }}>✓</span>}
            </button>
          ))}
        </div>
        <span className="cfg-color-name">{ACABADOS_EXTERIOR.find(a => a.id === config.acabadoExterior)?.nombre}</span>
      </div>
      <div className="cfg-field">
        <label className="cfg-label">Interior <span style={{ fontSize: 10, color: '#8B7355', fontWeight: 600 }}>★ populares</span></label>
        <div className="cfg-palette">
          {ACABADOS_INTERIOR.map(a => (
            <button key={a.id} className={`cfg-color-swatch ${config.acabadoInterior === a.id ? 'active' : ''} ${a.popular ? 'popular' : ''}`}
              style={{ backgroundColor: a.hex }} onClick={() => updateConfig('acabadoInterior', a.id)} title={a.nombre}>
              {config.acabadoInterior === a.id && <span className="cfg-color-check" style={{ color: '#333' }}>✓</span>}
            </button>
          ))}
        </div>
        <span className="cfg-color-name">{ACABADOS_INTERIOR.find(a => a.id === config.acabadoInterior)?.nombre}</span>
      </div>
    </div>
  );
}

function SeccionInterior({ config, alturaUtil, moduloSeleccionado, setModuloSeleccionado, addElemento, removeElemento, updateElementoPosicion, categoriaAbierta, setCategoriaAbierta, estructura }: any) {
  const elementosModulo = config.elementosInterior.filter((e: any) => e.modulo === moduloSeleccionado);
  const categorias = [
    { id: 'cajonera', nombre: 'Cajoneras', icon: '▤' },
    { id: 'barra', nombre: 'Barras', icon: '━' },
    { id: 'balda', nombre: 'Baldas', icon: '▬' },
    { id: 'zapatero', nombre: 'Zapateros', icon: '⌇' },
    { id: 'otros', nombre: 'Otros', icon: '◫' },
  ];
  const getElementosPorCategoria = (catId: string) => Object.entries(ELEMENTOS_INTERIOR).filter(([_, info]) => {
    if (catId === 'otros') return ['pantalonero', 'accesorio'].includes(info.categoria);
    if (catId === 'balda') return ['balda', 'estanteria'].includes(info.categoria);
    if (catId === 'barra') return ['barra', 'barra-doble'].includes(info.categoria);
    return info.categoria === catId;
  });

  return (
    <div className="cfg-section">
      <div className="cfg-section-title">Interior</div>
      <div className="cfg-info">
        <div className="cfg-info-row"><span>Altura útil</span><span style={{ fontWeight: 700 }}>{alturaUtil} cm</span></div>
      </div>

      <div className="cfg-field">
        <label className="cfg-label">Módulo</label>
        <div className="cfg-btn-group">
          {Array.from({ length: estructura.modulos }).map((_: any, i: number) => (
            <button key={i} className={`cfg-btn-option ${moduloSeleccionado === i ? 'active' : ''}`} onClick={() => setModuloSeleccionado(i)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="cfg-field">
        <label className="cfg-label">Añadir elemento</label>
        {categorias.map(cat => (
          <div key={cat.id} className="cfg-accordion">
            <button className={`cfg-accordion-header ${categoriaAbierta === cat.id ? 'active' : ''}`} onClick={() => setCategoriaAbierta(categoriaAbierta === cat.id ? null : cat.id)}>
              <span>{cat.icon} {cat.nombre}</span>
              <span className="cfg-accordion-arrow">▸</span>
            </button>
            {categoriaAbierta === cat.id && (
              <div className="cfg-accordion-content">
                {getElementosPorCategoria(cat.id).map(([id, info]) => (
                  <button key={id} className="cfg-element-add" onClick={() => addElemento(id)}>
                    <div>
                      <div className="cfg-element-add-name">{info.nombre}</div>
                      <div className="cfg-element-add-desc">{info.descripcion}</div>
                    </div>
                    <span className="cfg-element-add-price">+{info.precio}€</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="cfg-field">
        <label className="cfg-label">
          <span>Módulo {moduloSeleccionado + 1}</span>
          <span className="cfg-badge">{elementosModulo.length}</span>
        </label>
        <div className="cfg-element-list">
          {elementosModulo.length === 0 ? (
            <p className="cfg-empty-msg">Sin elementos. Añade desde las categorías superiores.</p>
          ) : (
            elementosModulo.sort((a: any, b: any) => b.posicionY - a.posicionY).map((el: any) => {
              const info = ELEMENTOS_INTERIOR[el.tipo];
              const maxPos = alturaUtil - (info?.altura || 50);
              return (
                <div key={el.id} className="cfg-element-item">
                  <div className="cfg-element-info">
                    <span className="cfg-element-name">{info?.nombre}</span>
                    <span className="cfg-element-pos">Base: {el.posicionY}cm</span>
                  </div>
                  <div className="cfg-element-controls">
                    <input type="range" className="cfg-mini-slider" min={0} max={maxPos} value={el.posicionY} onChange={e => updateElementoPosicion(el.id, parseInt(e.target.value))} />
                    <button className="cfg-remove-btn" onClick={() => removeElemento(el.id)}>✕</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function SeccionExtras({ config, updateConfig }: any) {
  return (
    <div className="cfg-section">
      <div className="cfg-section-title">Extras & Complementos</div>
      {[{ key: 'iluminacion', label: '💡 Iluminación LED', desc: 'Tira LED interior automática', precio: PRECIOS.iluminacion },
        { key: 'espejo', label: '🪞 Espejo interior', desc: 'Espejo pegado en puerta', precio: PRECIOS.espejo }].map(extra => (
        <label key={extra.key} className={`cfg-extra ${config.extras[extra.key] ? 'checked' : ''}`}>
          <input type="checkbox" className="cfg-checkbox" checked={config.extras[extra.key]} onChange={e => updateConfig(`extras.${extra.key}`, e.target.checked)} />
          <div className="cfg-extra-content">
            <div>
              <div style={{ fontWeight: 500 }}>{extra.label}</div>
              <div style={{ fontSize: 11, color: '#A09A94', marginTop: 2 }}>{extra.desc}</div>
            </div>
            <span className="cfg-extra-price">+{extra.precio}€</span>
          </div>
        </label>
      ))}
    </div>
  );
}
