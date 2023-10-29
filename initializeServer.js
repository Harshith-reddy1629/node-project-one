const express = require("express");
const app = express();

const PORT = process.env.PORT || 8001;

const initializeServer = async () => {
    try {
      app.listen(PORT, () =>
        console.log(`Server Running at http://localhost:${PORT}/`)
      );
    } catch (error) {
      console.log(`DB Error: ${error.message}`);
      process.exit(1);
    }
  };
  

  module.exports = initializeServer