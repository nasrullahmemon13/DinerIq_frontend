import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('recommendations render when API omits impact and preserve a zero impact', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Recommendations } = await server.ssrLoadModule('/src/components/CriticalRecommendations.jsx');
    const base = { recommendation_id: 'test', recommended_action: 'Review evidence' };
    for (const impact of [undefined, null]) {
      const html = renderToStaticMarkup(React.createElement(Recommendations, {
        recommendations: [{ ...base, potential_business_impact: impact }],
      }));
      assert.match(html, /Impact unavailable/);
      assert.doesNotMatch(html, /NaN|undefined/);
    }
    const html = renderToStaticMarkup(React.createElement(Recommendations, {
      recommendations: [{ ...base, potential_business_impact: 0 }],
    }));
    assert.match(html, /0 Estimated impact/);
  } finally {
    await server.close();
  }
});
