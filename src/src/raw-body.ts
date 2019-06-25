import * as http from 'http'

export function capture(req: http.IncomingMessage & {rawBody: Buffer}, res: http.ServerResponse,
                        buf: Buffer, encoding: string): void {
    req.rawBody = buf
}
