const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.send('<h1>Job Board Express Server Is Running! 🚀</h1>');
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});