import { UserService } from './core/UserService';

const main = () => {
  const userService = new UserService();

  const user = userService.createUser('test.user@example.com', 'QA Engineer', ['ADMIN']);
  console.log('Found user:', userService.findByEmail('test.user@example.com'));
};

main();
