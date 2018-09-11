/*
 * action.js
 */

import * as t from './actionTypes'

/*
 * action creator
 */

export function addTodo(text) {
  return { type: t.ADD_TODO, text }
}

export function toggleTodo(index) {
  return { type: t.TOGGLE_TODO, index }
}

export function setVisibilityFilter(filter) {
  return { type: t.SET_VISIBILITY_FILTER, filter }
}
