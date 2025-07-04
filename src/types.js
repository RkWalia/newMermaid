// Type definitions for JSDoc comments

/**
 * @typedef {Object} Shape
 * @property {string} id
 * @property {'rectangle' | 'circle' | 'diamond' | 'oval'} type
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {string} label
 */

/**
 * @typedef {Object} Connection
 * @property {string} id
 * @property {string} from
 * @property {string} to
 * @property {string} label
 */

/**
 * @typedef {Object} DragItem
 * @property {string} type
 * @property {string} [id]
 * @property {Shape} [shape]
 */

export {};