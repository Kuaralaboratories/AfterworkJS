import { AFServer, Request, Response, Handler, NextFunction } from '../server/afserver';
import jwt from 'jsonwebtoken';
import { MongoDBAdapter } from '../adapters/mongodbAdapter';
import { PostgresAdapter } from '../adapters/postgresqlAdapter';
import { MySQLAdapter } from '../adapters/mysqlAdapter';

interface AfterworkJSConfig {
  secret: string;
  dbType: 'mongo' | 'postgres' | 'mysql';
  dbConfig: any;
}

class AfterworkJS {
  private server: AFServer;
  private secret: string;
  private dbAdapter: any;

  constructor(config: AfterworkJSConfig) {
    this.server = new AFServer();
    this.secret = config.secret;
    this.dbAdapter = this.initializeDbAdapter(config.dbType, config.dbConfig);

    this.server.use(async (req: Request, res: Response, next: NextFunction) => {
      req.db = this.dbAdapter;
      next();
    });
  }

  private initializeDbAdapter(dbType: string, dbConfig: any) {
    switch (dbType) {
      case 'mongo':
        return new MongoDBAdapter(dbConfig);
      case 'postgres':
        return new PostgresAdapter(dbConfig);
      case 'mysql':
        return new MySQLAdapter(dbConfig);
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  public start(port: number) {
    this.server.listen(port, () => console.log(`AfterworkJS server running on port ${port}`));
  }

  public addRoute(method: string, path: string, handler: Handler) {
    this.server.addRoute(method, path, handler);
  }

  public authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }

    jwt.verify(token, this.secret, (err: any, user: any) => {
      if (err) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
      }
      req.user = user;
      next();
    });
  }

  public generateToken(user: object) {
    return jwt.sign(user, this.secret, { expiresIn: '1h' });
  }

  public setRoutes(routes: Array<{ method: string; path: string; handler: Handler }>) {
    routes.forEach(({ method, path, handler }) => this.addRoute(method, path, handler));
  }
}

export { AfterworkJS };
