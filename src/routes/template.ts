import express from 'express';

const template = express.Router();

template.get('/', (req, res) => {
  res
    .setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    .setHeader('Content-Disposition', 'attachment; filename=templaatti.xlsx')
    .download('./tempates/building_template.xlsx', 'building_templaatti.xlsx');
});

export default template;
