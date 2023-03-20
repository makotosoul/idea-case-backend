import express from 'express';
import subject from './subject.js';
import program from './program.js';
import spaceType from './spaceType.js';
import equipment from './equipment.js';
import subjectequipment from './subjectEquipment.js';
import allocation from './allocation.js';
import building from './building.js';
import setting from './setting.js';
import department from './department.js';

const routes = express.Router();

routes.use('/setting', setting);
routes.use('/subject', subject);
routes.use('/program', program);
routes.use('/spaceType', spaceType);
routes.use('/equipment', equipment);
routes.use('/subjectequipment', subjectequipment);
routes.use('/allocation', allocation);
routes.use('/building', building);
routes.use('/department', department);

export default routes;
