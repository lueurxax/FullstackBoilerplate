import { initTracerFromEnv, PrometheusMetricsFactory } from 'jaeger-client';
import * as promClient from 'prom-client';

import * as opentracing from 'opentracing';
import logger from '../libs/logger';

//

export default () => {
  const namespace = process.env.JAEGER_SERVICE_NAME;
  const metrics = new PrometheusMetricsFactory(promClient, namespace);
  const options = {
    metrics: metrics,
  };

  const tracer = initTracerFromEnv({}, options);

  return async (ctx, next) => {
    const span = tracer.startSpan(ctx.originalUrl);
    try {
      span.setTag(opentracing.Tags.HTTP_METHOD, ctx.request.method);
      span.setTag(opentracing.Tags.HTTP_URL, ctx.request.url);

      // replace password for login route
      if (ctx.request.url === '/login') {
        span.log({ 'args': { ...ctx.request.body, password: '*****' } });
      } else {
        span.log({ 'args': ctx.request.body });
      }

    } catch (e) {
      logger.error(e);
    }
    try {
      await next();
      span.setTag(opentracing.Tags.HTTP_STATUS_CODE, ctx.response.status);
      finish(ctx, span);
    } catch (err) {
      span.setTag(opentracing.Tags.HTTP_STATUS_CODE, err.statusCode);
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ 'error': err.message });
      finish(ctx, span);
      throw err
    }
  }
}

const finish = (ctx, span) => {
  try {
    logger.info(`Reporting span: ${span.context()}`);

    ctx.body && span.log({ 'response': ctx.body });

    span.finish();
  } catch (e) {
    logger.error(e);
  }
};
