import { BaseService } from './BaseService';
import { User } from '../models/User';

export class UserService extends BaseService {
  private users: User[] = [];

  constructor() {
    super('UserService');
  }

  createUser(email: string, position: string, roles: string[] = []): User {
    const user = new User(email, position, roles);
    this.users.push(user);
    this.logger.info(`User created: ${email}`);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }
}
