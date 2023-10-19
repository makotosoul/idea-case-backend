import express from 'express';

const template = express.Router();

template.get('/', (req, res) => {
  res.send('../../tempates/building_template.xlsx');
});

export default template;
