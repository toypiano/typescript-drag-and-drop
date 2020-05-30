import { ProjectStatus, Project } from '../models/project';

type Listener<T> = (state: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

export class ProjectState extends State<Project> {
  private static instance: ProjectState;
  private static counter: number = 0;
  private projects: Project[] = [];

  private constructor() {
    super();
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      'id' + (ProjectState.counter++).toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.callListenersWithNewProjects();
    console.log('project added: ', newProject);
  }

  moveProject(projectId: string, targetStatus: ProjectStatus) {
    const movingProject = this.projects.find((p) => p.id === projectId);
    if (movingProject && movingProject.status !== targetStatus) {
      movingProject.status = targetStatus;
    }
    this.callListenersWithNewProjects();
  }

  private callListenersWithNewProjects() {
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

export const state = ProjectState.getInstance();
