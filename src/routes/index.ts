import express from 'express';
import allocround from './allocRound.js';
import allocation from './allocation.js';
import building from './building.js';
import department from './department.js';
import equipment from './equipment.js';
import program from './program.js';
import setting from './setting.js';
import space from './space.js';
import spaceType from './spaceType.js';
import subject from './subject.js';
import subjectequipment from './subjectEquipment.js';
import template from './template.js';
import user from './user.js';

const routes = express.Router();

routes.use('/allocation', allocation);
routes.use('/allocRound', allocround);
routes.use('/building', building);
routes.use('/department', department);
routes.use('/equipment', equipment);
routes.use('/program', program);
routes.use('/setting', setting);
routes.use('/space', space);
routes.use('/spaceType', spaceType);
routes.use('/subject', subject);
routes.use('/subjectequipment', subjectequipment);
routes.use('/user', user);
routes.use('/template', template);

export default routes;
