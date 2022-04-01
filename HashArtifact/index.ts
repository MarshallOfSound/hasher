import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as crypto from 'crypto';
import got from 'got';
import * as stream from 'stream';
import { promisify } from 'util';
import * as nodeUrl from 'url';

const pipeline = promisify(stream.pipeline);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const { targetUrl, algorithm } = req.query;

    if (!targetUrl || typeof targetUrl !== 'string') {
        context.res = {
            status: 400,
            body: JSON.stringify({ error: 'Missing targetUrl' }),
        };
        return;
    }

    const parsed = nodeUrl.parse(targetUrl);
    if (parsed.protocol !== 'https:') {
        context.res =  {
        status: 400,
        body: JSON.stringify({ error: 'Not a secure URL' }),
        };
    }

    const hash = crypto.createHash(algorithm || 'sha256');
    await pipeline(got.stream(targetUrl), hash);
    context.res = {
        status: 200,
        body: JSON.stringify({ hash: hash.digest('hex') }),
    };
};

export default httpTrigger;