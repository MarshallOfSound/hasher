const crypto = require('crypto');
const got = require('got');
const stream = require('stream');
const { promisify } = require('util');
const nodeUrl = require('url');

const pipeline = promisify(stream.pipeline);

exports.handler = async ({ algorithm, targetUrl }) => {
  if (!targetUrl || typeof targetUrl !== 'string')
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing targetUrl' }),
    };
  const parsed = nodeUrl.parse(targetUrl);
  if (parsed.protocol !== 'https:')
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Not a secure URL' }),
    };
  const hash = crypto.createHash(algorithm || 'sha256');
  await pipeline(got.stream(targetUrl), hash);
  const response = {
    statusCode: 200,
    hash: hash.digest('hex'),
  };
  return response;
};
