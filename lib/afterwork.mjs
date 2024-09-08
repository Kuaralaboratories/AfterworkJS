/**                           Afterwork.js
 *  Afterwork.js is a backend framework for your needs without harming your pocket in all meanings.
 */

import {
    AFServer,
    Request,
    Response,
    NextFunction
} from "../server/afserver.mjs"
import * as jwt from "jsonwebtoken"
import { MongoDBAdapter } from "../adapters/mongodbAdapter.mjs"
import { PostgresAdapter } from "../adapters/postgresqlAdapter.mjs"
import { MySQLAdapter } from "../adapters/mysqlAdapter.mjs"

export class AfterworkJS {
  constructor(config) {
    this.server = new AFServer()
    this.secret = config.secret
    this.dbAdapter = this.initializeDbAdapter(config.dbType, config.dbConfig)

    this.server.use(async (req, res, next) => {
      req.db = this.dbAdapter
      next()
    })
  }

  initializeDbAdapter(dbType, dbConfig) {
    switch (dbType) {
      case "mongo":
        return new MongoDBAdapter(dbConfig)
      case "postgres":
        return new PostgresAdapter(dbConfig)
      case "mysql":
        return new MySQLAdapter(dbConfig)
      default:
        throw new Error(`Unsupported database type: ${dbType}`)
    }
  }

  start(port) {
    this.server.listen(port, () =>
      console.log(`AfterworkJS server running on port ${port}`)
    )
  }

  addRoute(method, path, handler) {
    this.server.addRoute(method, path, handler)
  }

  authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    if (typeof authHeader !== "string") {
      res.statusCode = 401
      res.end("Unauthorized")
      return
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      res.statusCode = 401
      res.end("Unauthorized")
      return
    }

    jwt.verify(token, this.secret, (err, user) => {
      if (err) {
        res.statusCode = 403
        res.end("Forbidden")
        return
      }
      req.user = user
      next()
    })
  }

  generateToken(user) {
    return jwt.sign(user, this.secret, { expiresIn: "1h" })
  }

  setRoutes(routes) {
    routes.forEach(({ method, path, handler }) =>
      this.addRoute(method, path, handler)
    )
  }
}

export { Request, Response, NextFunction } from "../server/afserver.mjs"