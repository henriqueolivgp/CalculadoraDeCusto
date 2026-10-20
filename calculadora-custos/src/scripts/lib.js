const KEY_PRODUTOS = 'calcula-preco:produtos';
const KEY_HORA = 'calcula-preco:valor-hora';

/* ---------- utilitários ---------- */

export const uid = () =>
  globalThis.crypto && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function num(v) {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const eur = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
export const formatEUR = (v) => eur.format(v || 0);

const nf = new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 2 });
export const formatNum = (v) => nf.format(v || 0);

export const formatTempo = (tempo, unidade) =>
  `${formatNum(tempo)} ${unidade === 'h' ? 'h' : 'min'}`;

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

/* ---------- cálculo ---------- */

export function calcular(p) {
  const materiais = (p.materiais || []).map((m) => {
    const preco = num(m.preco);
    const qntPacote = num(m.qntPacote);
    const qntUsada = num(m.qntUsada);
    const custo = qntPacote > 0 ? (preco / qntPacote) * qntUsada : 0;
    return { ...m, custo };
  });

  const custoMateriais = materiais.reduce((s, m) => s + m.custo, 0);
  const tempo = num(p.tempo);
  const minutos = p.unidade === 'h' ? tempo * 60 : tempo;
  const custoMaoObra = (minutos / 60) * num(p.valorHora);
  const custoTotal = custoMateriais + custoMaoObra;
  const margem = num(p.margem);
  const precoVenda = custoTotal * (1 + margem / 100);
  const lucro = precoVenda - custoTotal;

  return { materiais, custoMateriais, minutos, custoMaoObra, custoTotal, margem, lucro, precoVenda };
}

/* ---------- armazenamento ---------- */

export function getProdutos() {
  try {
    const raw = localStorage.getItem(KEY_PRODUTOS);
    const lista = raw ? JSON.parse(raw) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

function setProdutos(lista) {
  try {
    localStorage.setItem(KEY_PRODUTOS, JSON.stringify(lista));
  } catch {
    toast('Não foi possível guardar neste navegador.');
  }
}

export const getProduto = (id) => getProdutos().find((p) => p.id === id);

export function saveProduto(produto) {
  const lista = getProdutos();
  const i = lista.findIndex((p) => p.id === produto.id);
  if (i >= 0) lista[i] = produto;
  else lista.push(produto);
  setProdutos(lista);
}

export function deleteProduto(id) {
  setProdutos(getProdutos().filter((p) => p.id !== id));
}

export function getValorHora() {
  try {
    return localStorage.getItem(KEY_HORA) || '';
  } catch {
    return '';
  }
}

export function setValorHora(v) {
  try {
    localStorage.setItem(KEY_HORA, String(v));
  } catch {
    /* ignora */
  }
}

/* ---------- interface ---------- */

let toastTimer;
export function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

export function atualizarBadge() {
  const b = document.getElementById('count-badge');
  if (b) b.textContent = String(getProdutos().length);
}
