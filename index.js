// // 在 express 應用中加入 Parse Server module 的範例。
// // 相容的 API 路由 (compatible API routes)。

// import express from 'express';
// import { ParseServer } from 'parse-server';
import path from 'path';
const __dirname = path.resolve();
// import http from 'http';

// console.log(`process.env.DATABASE_URI: `, process.env.DATABASE_URI);
// console.log(`process.env.TESTING: `, process.env.TESTING);

// export const config = {
//   databaseURI: process.env.DATABASE_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ParseDbTest1',
//   cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
//   appId: process.env.APP_ID || 'id',
//   masterKey: process.env.MASTER_KEY || 'key', //Add your master key here. Keep it secret!
//   serverURL: process.env.SERVER_URL || 'http://127.0.0.1:1337/parse', // Don't forget to change to https if nnodeeded
//   // liveQuery: {
//   //   classNames: ['Posts', 'Comments'], // List of classes to support for query subscriptions
//   // },
// };
// // Client-keys like the javascript key or the .NET key are not necessary with parse-server
// // If you wish you require them, you can set them as options in the initialization above:
// // javascriptKey, restAPIKey, dotNetKey, clientKey

// export const app = express();

// // Serve static assets from the /public folder
// app.use('/public', express.static(path.join(__dirname, '/public')));

// // Serve the Parse API on the /parse URL prefix
// if (!process.env.TESTING) {
//   const mountPath = process.env.PARSE_MOUNT || '/parse';
//   const server = new ParseServer(config);
//   await server.start();
//   app.use(mountPath, server.app);
// }

// // Parse Server plays nicely with the rest of your web routes
// app.get('/', function (req, res) {
//   res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
// });

// // There will be a test page available on the /test path of your server url
// // Remove this before launching your app
// app.get('/test', function (req, res) {
//   res.sendFile(path.join(__dirname, '/public/test.html'));
// });
// console.log(`process.env.TESTING: `, process.env.TESTING);
// if (!process.env.TESTING) {
//   const port = process.env.PORT || 1337;
//   const httpServer = http.createServer(app);
//   httpServer.listen(port, function () {
//     console.log('parse-server-example running on port ' + port + '.');
//   });
//   // This will enable the Live Query real-time server
//   await ParseServer.createLiveQueryServer(httpServer);
// }






// const config = require('./config');
// import config from './config.env';
import 'dotenv/config';
import { ParseServer } from 'parse-server';

import ParseDashboard from 'parse-dashboard';
import http from 'http';
import express from 'express';
const app = express();

console.log(`databaseURI: `, process.env.DATA_BASE_URI);
console.log(`masterKey: `, process.env.MASTER_KEY);
console.log(`appId: `, process.env.APP_ID);
console.log(`cloud: `, process.env.CLOUD);
console.log(`parse server: `, process.env.PARSE_SERVER_URL);
console.log(`dashboard: `, process.env.DASHBOARD_URL);
console.log(`cloud: `, "file://" + __dirname + process.env.CLOUD);


const server = new ParseServer({
  databaseURI: process.env.DATA_BASE_URI,
  // cloud: "file://" + __dirname + process.env.CLOUD,
  cloud: ``,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  // push: { ... }, // See the Push wiki page
  // filesAdapter: ..., // 對應不同雲廠商的 FilesAdapter
  // javascriptKey: config.javascriptKey, // js客戶端認證
  // liveQuery: { // 建立websocket鏈接，實現實時通信
  //   classNames: ['Sdtuent']
  // }
});
await server.start();

const dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": process.env.PARSE_SERVER_URL,
      "appId": process.env.APP_ID,
      "masterKey": process.env.MASTER_KEY,
      "appName": process.env.DASHBOARD_NAME
    },
  ],
  "users": [
    {
      "user": "admin",
      "pass": "pwd"
    }
  ]
}, {  allowInsecureHTTP: true });

// Serve the Parse API at /parse URL prefix
app.use('/parse', server.app);
app.use('/dashboard', dashboard);

const port = 1337;
const httpServer = http.createServer(app);

httpServer.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});

const parseLiveQueryServer = await ParseServer.createLiveQueryServer(httpServer);
