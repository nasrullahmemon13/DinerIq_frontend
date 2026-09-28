import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('every routed page renders its initial state without invalid numeric markup', async t => {
  const server = await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
  try {
    const source = await readFile(new URL('../App.jsx', import.meta.url),'utf8');
    const paths = [...new Set([...source.matchAll(/from ['"]\.\/(pages|dashboards)\/([^'"]+)['"]/g)].map(m=>`/src/${m[1]}/${m[2]}.jsx`))];
    const { AuthProvider } = await server.ssrLoadModule('/src/context/AuthContext.jsx');
    const { FilterProvider } = await server.ssrLoadModule('/src/context/FilterContext.jsx');
    for (const path of paths) {
      await t.test(path, async () => {
        const { default: Page } = await server.ssrLoadModule(path);
        const html = renderToStaticMarkup(React.createElement(MemoryRouter,null,
          React.createElement(AuthProvider,null,React.createElement(FilterProvider,null,React.createElement(Page)))));
        assert.ok(html.length > 0);
        assert.doesNotMatch(html, /(?:width|height):(?:NaN|Infinity)|>NaN<|>Infinity</);
      });
    }
  } finally { await server.close(); }
});
