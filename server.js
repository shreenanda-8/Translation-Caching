const http = require('http');
const app = require('./app');

const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server is running at the port ${PORT}`);
});
