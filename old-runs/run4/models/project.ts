export enum ProjectStatus {
  Active,
  Completed,
}

export class Project {
  /**
   * @param id - project id
   * @param title - project title
   * @param description - project description
   * @param people - number of persons involved
   * @param status - project status (active | completed)
   */
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
