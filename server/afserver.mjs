import { createServer, ServerResponse } from "http"
import { parse } from "url"

export class AFServer {
  routes = {}
  middlewares = []

  constructor() {
    this.createServer()
  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  listen(port, callback) {
    this.server.listen(port, callback)
  }

  attachMiddleware(req, res, next) {
    req.db = this.dbAdapter
    req.user = {}
    next()
  }

  createServer() {
    this.server = createServer((req, res) => {
      if (req.url) {
        const parsedUrl = parse(req.url, true)
        req.query = parsedUrl.query
      }

      res.json = data => {
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(data))
      }

      this.handleRequest(req, res)
    })
  }

  matchRoute(pathname, method) {
    const routesForMethod = Object.keys(this.routes).filter(routePath => {
      const pathSegments = routePath.split("/")
      const urlSegments = pathname.split("/")
      if (pathSegments.length !== urlSegments.length) return false
      return pathSegments.every(
        (segment, i) =>
          segment === urlSegments[i] ||
          segment.startsWith(":") ||
          segment === "*"
      )
    })

    if (routesForMethod.length > 0) {
      const matchedRoute = routesForMethod[0] // In case of multiple matches, take the first
      const pathSegments = matchedRoute.split("/")
      const urlSegments = pathname.split("/")
      const params = {}

      pathSegments.forEach((segment, i) => {
        if (segment.startsWith(":")) {
          const paramName = segment.slice(1)
          params[paramName] = urlSegments[i]
        }
      })

      return { handlers: this.routes[matchedRoute][method], params }
    }

    return null
  }

  handleRequest(req, res) {
    const { pathname } = parse(req.url, true)
    const method = req.method.toLowerCase()

    const routeMatch = this.matchRoute(pathname, method)

    const routeHandlers = this.routes[pathname]?.[method] || []

    const handlers = [...this.middlewares, ...routeHandlers]

    if (routeMatch) {
      req.params = routeMatch.params
      const handlers = [...this.middlewares, ...routeMatch.handlers]

      let index = 0
      const next = err => {
        if (err) {
          res.statusCode = 500
          res.end(`Internal Server Error: ${err.message}`)
          return
        }

        const handler = handlers[index++]
        if (handler) {
          handler(req, res, next)
        } else {
          res.statusCode = 404
          res.end("Not Found")
        }
      }

      next()
    } else {
      res.statusCode = 404
      res.end("Not Found")
    }
  }

  addRoute(method, path, handler) {
    if (!this.routes[path]) {
      this.routes[path] = {}
    }

    if (!this.routes[path][method]) {
      this.routes[path][method] = []
    }

    this.routes[path][method].push(handler)
  }

  get(path, handler) {
    this.addRoute("get", path, handler)
  }

  post(path, handler) {
    this.addRoute("post", path, handler)
  }

  put(path, handler) {
    this.addRoute("put", path, handler)
  }

  delete(path, handler) {
    this.addRoute("delete", path, handler)
  }
}

export { ServerResponse as Response }