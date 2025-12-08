export class User {
  constructor(
    public email: string,
    public position: string,
    private roles: string[] = []
  ) {}

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  addRole(role: string): void {
    if (!this.roles.includes(role)) {
      this.roles.push(role);
    }
  }

  removeRole(role: string): void {
    this.roles = this.roles.filter(r => r !== role);
  }
}
