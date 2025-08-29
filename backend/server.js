import app from './src/index.js';

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});


