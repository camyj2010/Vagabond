const app = require('./app');
const dbconnect = require('./config');

const PORT = process.env.PORT || 3001;


dbconnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });