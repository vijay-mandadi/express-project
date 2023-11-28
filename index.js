const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "myDatabase.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    //Start the server
    app.listen(4000, () => {
      console.log("Server Running at http://localhost:4000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Custom middleware to log timestamp and requested URL
const middlewareFunction = (request, response, next) => {
  const timestamp = new Date().toISOString();
  const url = request.url;

  console.log(`[${timestamp}] Requested URL: ${url}`);

  // Pass control to the next middleware
  next();
};

//example-1 api
app.get("/request1", middlewareFunction, (request, response) => {
  console.log("Inside the request 1 api");
});

//example-2 api
app.get("/request2", middlewareFunction, (request, response) => {
  console.log("Inside the request 2 api");
});

//example-3 api
app.get("/request3", middlewareFunction, (request, response) => {
  console.log("Inside the request 3 api");
});

//get posts api
app.get("/posts", middlewareFunction, async (request, response) => {
  const query = `SELECT
      *
    FROM
      post
    ORDER BY
      post_id;`;
  const postList = await db.all(query);
  response.send(postList);
});
