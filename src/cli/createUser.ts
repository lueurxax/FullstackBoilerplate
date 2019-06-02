import { User } from '../models/user';

const args = process.argv;

const createUser = (email: string, name: string, password: string): Promise<User> => {
  console.log(`Create user with email=${email}, name=${name}, password=${password}`);
  return User.create({ email, name, password });
};

if (args.length < 4) {
  throw new Error('Need more arguments');
} else {
  createUser(args[2], args[3], args[4])
    .then(o => {
      console.log(o);
      process.exit(0)
    }).then()
    .catch(console.error);
}


