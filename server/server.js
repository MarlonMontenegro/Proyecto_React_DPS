const jsonServer = require("json-server");
const path = require("path");
const { registerProjects } = require("./middlewares/projects");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json")); // { projects: [], tasks: [] }
const middleware = jsonServer.defaults();

// Middlewares base
server.use(middleware);
server.use(jsonServer.bodyParser);

server.use((req, _res, next) => {
  if (req.body == null) req.body = {};
  next();
});

// Alias bonitos
server.use(jsonServer.rewriter(require("./routes.json")));

registerProjects(server, router);

server.use("/api", router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(
    `API lista: http://localhost:${PORT}/api (db: ${path.join(
      __dirname,
      "db.json"
    )})`
  );
});
