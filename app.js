const express = require('express');
const app = express();
const path =  require('path')

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const publicRoutes = require('./routes/publicRoutes');
app.use('/', publicRoutes);
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Non Trouvée' });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
