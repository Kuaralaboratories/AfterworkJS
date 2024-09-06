import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { parse as parseQuery, ParsedUrlQuery } from 'querystring';

type NextFunction = (err?: any) => void;

interface Request extends IncomingMessage {
  url: string;
  query?: ParsedUrlQuery;
  body?: any;
  params?: { [key: string]: string };
  db?: any;
  user?: any;
}

interface CustomRequest extends Request {
  db?: any;
  user?: any;
}

type Handler = (req: CustomRequest, res: ServerResponse & { json: (data: any) => void }, next: NextFunction) => void;

class AFServer {
  private routes: { [key: string]: { [key: string]: Handler[] } } = {};
  private middlewares: Handler[] = [];
  private server: any;
  private dbAdapter: any; 

  constructor() {
    this.createServer();
  }

  use(middleware: Handler) {
    this.middlewares.push(middleware);
  }

  listen(port: number, callback: () => void) {
    this.server.listen(port, callback);
  }

  private attachMiddleware(req: CustomRequest, res: ServerResponse & { json: (data: any) => void }, next: NextFunction) {
    req.db = this.dbAdapter;
    req.user = {};
    next();
  }

  private createServer() {
    this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (req.url) {  
        const parsedUrl = parse(req.url, true);
        (req as CustomRequest).query = parsedUrl.query;
      }
  
      (res as any).json = (data: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };
  
      this.handleRequest(req as CustomRequest, res as ServerResponse & { json: (data: any) => void });
    });
  }

  private handleRequest(req: CustomRequest, res: ServerResponse & { json: (data: any) => void }) {
    const { pathname } = parse(req.url!, true);
    const method = req.method!.toLowerCase();

    const routeHandlers = this.routes[pathname!]?.[method] || [];

    const handlers = [...this.middlewares, ...routeHandlers];

    let index = 0;
    const next: NextFunction = (err?: any) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Internal Server Error: ${err.message}`);
        return;
      }

      const handler = handlers[index++];
      if (handler) {
        handler(req, res, next);
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    };

    next();
  }

  public addRoute(method: string, path: string, handler: Handler) {
    if (!this.routes[path]) {
      this.routes[path] = {};
    }

    if (!this.routes[path][method]) {
      this.routes[path][method] = [];
    }

    this.routes[path][method].push(handler);
  }

  public get(path: string, handler: Handler) {
    this.addRoute('get', path, handler);
  }

  public post(path: string, handler: Handler) {
    this.addRoute('post', path, handler);
  }

  public put(path: string, handler: Handler) {
    this.addRoute('put', path, handler);
  }

  public delete(path: string, handler: Handler) {
    this.addRoute('delete', path, handler);
  }
}

export { AFServer, Request, ServerResponse as Response, Handler, NextFunction };
