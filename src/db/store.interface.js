'use strict';

/** Shared asynchronous contract implemented by every persistence store. */
const STORE_METHODS = ['create', 'getAll', 'getById', 'update', 'patch', 'delete'];

function assertStoreInterface(store, name = 'Store') {
  const missing = STORE_METHODS.filter(method => typeof store[method] !== 'function');
  if (missing.length) {
    throw new TypeError(`${name} is missing store methods: ${missing.join(', ')}`);
  }
  return store;
}

module.exports = { STORE_METHODS, assertStoreInterface };
