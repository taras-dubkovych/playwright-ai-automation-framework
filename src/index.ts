import { UserService } from './core/UserService';
import { sum, unique } from './utils/mathUtils';
console.log('>>> Script started');
const main = () => {

  console.log('=== TS app started ===');
  const userService = new UserService();

  const user = userService.createUser(
    'test.user@example.com',
    'QA Engineer',
    ['ADMIN', 'EDITOR']
  );

  console.log('Created user:', user);

  const numbers = [1, 2, 2, 3, 3, 3];
  console.log('Sum:', sum(numbers));
  console.log('Unique:', unique(numbers));

  const found = userService.findByEmail('test.user@example.com');
  console.log('Found user:', found);
};

main();