import { port, version } from './const';
import metricsMiddleware from './metrics';
import makeRequest from './util';
import initTelemetry from './tracing';

initTelemetry();

import express from 'express';

const app = express()
app.use(metricsMiddleware);

app.get('/', (req, res) => {
  res.send(`
    Help:\n 
    GET /version: return version,\n
    GET /cities: return some cities,\n
    GET /names: return some names,\n
    POST /exit: terminate app,\n
    GET /test/sleep/:millisecs: sleep a bit,\n
    GET /test/env/:prefix: return the env vars that starts with...,\n
    POST /test/call/:service: call GET /<service>,\n
  `);
})

app.get('/version', (req, res) => {
  res.send(version);
})

app.post('/exit', (req, res) => {
  console.log(`App terminating in 3 seconds...`);
  setTimeout(() => process.exit(), 3000);
  res.end();
})

app.get('/test/sleep/:millisecs', (req, res) => {
  const millisecs = parseInt(req.params.millisecs);
  if (isNaN(millisecs)) { res.end(400); }
  setTimeout(() => res.end(`I have slept ${millisecs} mills`), millisecs);
})

app.get('/test/env/:prefix', (req, res) => {
  const result: { [key: string]: string | undefined } = {};
  Object.keys(process.env)
    .filter(k => k.startsWith(req.params.prefix))
    .forEach(k => {
      result[k] = process.env[k];
    });

  res.end(JSON.stringify(result));
})

app.post('/test/call/:service', (req, res) => {
  makeRequest(req.params.service)
    .then((data) => res.end(data))
    .catch(() => res.end(500))
})

app.get('/cities', (req, res) => {
  const result = [{ name: 'London' }, { name: 'Rome' }, { name: 'New York' }];
  res.end(JSON.stringify(result));
})

app.get('/names', (req, res) => {
  const result = [{ name: 'Federico' }, { name: 'George' }, { name: 'Selly' }];
  res.end(JSON.stringify(result));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})