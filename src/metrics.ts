
import client from 'prom-client';
import promBundle from 'express-prom-bundle';


// Create a Registry which registers the metrics
const register = new client.Registry()
// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'generic-app'
})

// Enable the collection of default metrics
client.collectDefaultMetrics({ register })

const metricsMiddleware = promBundle({ includeMethod: true });

export default metricsMiddleware;