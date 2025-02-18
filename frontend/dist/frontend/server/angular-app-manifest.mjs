
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/slot-machine"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 27899, hash: '5f90bd3f91c74d2a0cf9676d4b812e8efbc92514067196f62cc2b393a23a859d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17202, hash: '4da94c93bcc219ebfbadbc3885d58a404ac037642213389ce84341dc4d99b1a3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'slot-machine/index.html': {size: 115602, hash: 'f51f3ea9c8902fcab1587ae0f6593918617fadc84f29750f719e719342a06bfc', text: () => import('./assets-chunks/slot-machine_index_html.mjs').then(m => m.default)},
    'index.html': {size: 129899, hash: 'c989e45f486ab4b525fa4bfc18c79c77a52a9af1cc85b19f5ab6e07c214a2098', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-63PMUIWA.css': {size: 238590, hash: 'bWTlSPeaBYE', text: () => import('./assets-chunks/styles-63PMUIWA_css.mjs').then(m => m.default)}
  },
};
