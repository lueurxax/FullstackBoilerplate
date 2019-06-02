import config from 'config';
import * as crypto from 'crypto';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../libs/sequelize';

class User extends Model {
  public id!: string;
  public name: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly passwordHash!: string;
  public readonly salt!: string;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: 'compositeIndex',
    validate: {
      isEmail: true,
    },
    set(val: string) {
      // @ts-ignore
      this.setDataValue('email', val.toLowerCase());
    },
  },
  passwordHash: DataTypes.STRING,
  salt: DataTypes.STRING,
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'user',
  setterMethods: {
    password(this: User, value: any) {
      if (value) {
        const salt = crypto.randomBytes(config.get('crypto.hash.length')).toString('base64');
        // @ts-ignore
        this.setDataValue('salt', salt);
        // @ts-ignore
        this.setDataValue('passwordHash', crypto
          .pbkdf2Sync(value, salt, config.get('crypto.hash.iterations'), config.get('crypto.hash.length'), 'sha512')
          .toString('base64'));
      } else {
        // remove password (unable to login w/ password any more, but can use providers)
        // @ts-ignore
        this.setDataValue('salt', undefined);
        // @ts-ignore
        this.setDataValue('passwordHash', undefined);
      }
    },
  },
  getterMethods: {
    password(this: User) {
      return this.passwordHash;
    },
  },
  paranoid: true,
  schema: config.get('postgresSchema'),
});

export { User };
