import { Project, ProjectStatus } from '../models/project';

/**
 * Takes a state (= array of class T instances) and do something with it
 */
type Listener<T> = (state: T[]) => void;

/**
 * Can add listeners that takes array of T instances
 */
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
    const project = new Project(
      'projectId' + (ProjectState.counter++).toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(project);
    this.callListenersWithNewProjects();
    console.log('project added to state: ', project);
    console.log('projects: ', this.projects);
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
