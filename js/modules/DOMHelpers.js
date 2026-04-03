/**
 * DOMHelpers.js
 * Lightweight, safe DOM query and manipulation utilities.
 * All helpers return null gracefully when elements are missing.
 */

/**
 * Shorthand for document.getElementById
 * @param {string} id
 * @returns {HTMLElement|null}
 */
export const $ = id => document.getElementById(id);

/**
 * Shorthand for document.querySelector
 * @param {string} selector
 * @param {Element} [root=document]
 * @returns {Element|null}
 */
export const $$ = (selector, root = document) => root.querySelector(selector);

/**
 * Shorthand for document.querySelectorAll
 * @param {string} selector
 * @param {Element} [root=document]
 * @returns {NodeList}
 */
export const $$all = (selector, root = document) => root.querySelectorAll(selector);

/**
 * Escape a string for safe HTML insertion
 * @param {string} str
 * @returns {string}
 */
export function escHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

/**
 * Wrap query matches in <mark> tags for highlight display.
 * Falls back to escaped plain text when query is empty.
 *
 * @param {string} text  - Source text
 * @param {string} query - Search term to highlight
 * @returns {string}     - HTML string (safe)
 */
export function highlight(text, query) {
  if (!query) return escHtml(text);
  const q  = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${q})`, 'gi');
  return escHtml(text).replace(re, '<mark>$1</mark>');
}

/**
 * Toggle a CSS class on an element (no-op if element is null).
 * @param {Element|null} el
 * @param {string} cls
 * @param {boolean} force
 */
export function toggleClass(el, cls, force) {
  if (el) el.classList.toggle(cls, force);
}

/**
 * Set textContent safely (no-op if element is null).
 * @param {Element|null} el
 * @param {string} text
 */
export function setText(el, text) {
  if (el) el.textContent = text;
}

/**
 * Set innerHTML safely (no-op if element is null).
 * @param {Element|null} el
 * @param {string} html
 */
export function setHtml(el, html) {
  if (el) el.innerHTML = html;
}
