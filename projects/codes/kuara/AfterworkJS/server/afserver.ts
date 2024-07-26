import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { parse as parseQuery } from 'querystring';
import { ParsedUrlQuery } from 'querystring';

interface Request extends IncomingMessage {
  query?: ParsedUrlQuery;
  body?: any;
  params?: { [key: string]: string };
}

interface Response extends ServerResponse {
  json: (data: any) => void;
}

interface CustomRequest extends Request {
    db?: any;
    user?: any;
}

type Handler = (req: CustomRequest, res: Response, next: NextFunction) => void;

class AFServer {
  private routes: { [key: string]: { [key: string]: Handler[] } } = {};
  private middlewares: Handler[] = [];
  private server: any;

  constructor() {
    this.createServer();
  }

  use(middleware: Handler) {
    this.middlewares.push(middleware);
  }

  listen(port: number, callback: () => void) {
    this.server.listen(port, callback);
  }
  
  private attachMiddleware(req: CustomRequest, res: Response, next: NextFunction) { 
    req.db = this.dbAdapter; 
    req.user = {};
    next();
  }
  
  private createServer() {
    createServer((req: Request, res: Response) => {
      const parsedUrl = parse(req.url!, true);
      req.query = parsedUrl.query;

      res.json = (data: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };

      this.handleRequest(req, res);
    }).listen(3000, () => console.log(`Server running on port 3000`));
  }

  private handleRequest(req: Request, res: Response) {
    const { pathname } = parse(req.url!, true);
    const method = req.method!.toLowerCase();

    const routeHandlers = this.routes[pathname!]?.[method] || [];

    const handlers = [...this.middlewares, ...routeHandlers];

    let index = 0;
    const next = () => {
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

  public use(handler: Handler) {
    this.middlewares.push(handler);
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

export { AFServer, Request, Response, Handler };
