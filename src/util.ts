


import { context, SpanKind, StatusCode, ROOT_CONTEXT, setSpan } from '@opentelemetry/api';
import axios from 'axios';
import { getTracer } from './tracing';
import { port } from './const';


export default function makeRequest(service: string) {
  const tracer = getTracer();
  const span = tracer.startSpan('client.makeRequest()', {
    kind: SpanKind.CLIENT,
  });

  return context.with(setSpan(ROOT_CONTEXT, span), async () => {
    let result = 'not found';
    try {
      const res = await axios.get(`http://localhost:${port}/${service}`);
      span.setStatus({ code: StatusCode.OK });
      result = JSON.stringify(res.data);
    } catch (e) {
      span.setStatus({ code: StatusCode.ERROR, message: e.message });
    }
    console.log(`call to ${service} executed`);
    span.end();
    return result;
  });
}
