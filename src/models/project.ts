export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numPeopleAssigned: number,
    public status: 'active' | 'completed',
  ) {}
}
