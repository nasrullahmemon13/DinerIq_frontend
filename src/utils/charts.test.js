import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('charts preserve zero and negative values, reject missing values, and break lines across gaps', async () => {
  const server = await createServer({server:{middlewareMode:true, hmr:false},appType:'custom'});
  try {
    const { BarChart, LineChart } = await server.ssrLoadModule('/src/components/AnalyticsCharts.jsx');
    const bars = renderToStaticMarkup(React.createElement(BarChart, {title:'Actual values',data:[
      {label:'Zero',value:0},{label:'Loss',value:-5},{label:'Profit',value:10},{label:'Unknown',value:null},
    ]}));
    assert.match(bars, /Zero: 0/);
    assert.match(bars, /Loss: -5/);
    assert.match(bars, /width:0%/);
    assert.doesNotMatch(bars, /Unknown|NaN|Infinity/);
    const line = renderToStaticMarkup(React.createElement(LineChart,{title:'History',unit:'orders',
      data:[{label:'a',value:2},{label:'b',value:null},{label:'c',value:4}],series:[{key:'value',label:'Observed'}]}));
    assert.match(line, /View exact chart values/);
    assert.match(line, /d="M[^"]+ M/);
    assert.doesNotMatch(line, /NaN|Infinity/);
    const empty = renderToStaticMarkup(React.createElement(LineChart,{title:'Empty',data:[],series:[]}));
    assert.match(empty, /No measured values available/);
  } finally { await server.close(); }
});
