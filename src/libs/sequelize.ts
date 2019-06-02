/**
 * Created by xax on 26.06.2017.
 */
import config from 'config';
import { Sequelize, Options } from 'sequelize';
import logger from './logger';

const params: Options = config.get('postgres');
const sequelize = new Sequelize(params);
export default sequelize

export const sync = async () => {
  try {
    await sequelize.sync({});
    logger.info(`Синхронизация таблиц успешна`);
  } catch (err) {
    console.error(err);
    logger.error(`Sync models error: ${err.message}`);
  }
};
