import { v4 as uuid } from 'uuid';

import { Project } from '../models/project';

type Listener<S> = (states: S[]) => void;

class State<S> {
  protected listeners: Listener<S>[] = [];

  /**
   * Register listener to the state instance
   * @param listener - listener that subscribes to the state updates
   */
  addListener(listener: Listener<S>) {
    this.listeners.push(listener);
  }
}

class ProjectState extends State<Project> {
  private static state: ProjectState;
  private projects: Project[] = [];
  private constructor() {
    super();
  }

  static getState() {
    if (this.state) {
      return this.state;
    } else {
      this.state = new ProjectState();
      return this.state;
    }
  }

  addProject(title: string, description: string, numPeopleAssigned: number) {
    const newProject = new Project(
      uuid(),
      title,
      description,
      numPeopleAssigned,
      'active',
    );
    this.projects.push(newProject);
    this.callListenersWithUpdatedProjects();
    console.log(ProjectState.state);
  }

  moveProject(projectId: string, targetType: 'active' | 'completed') {
    const movingProject = this.projects.find((p) => p.id === projectId);
    // If the project is dropped at where it was originally, do nothing
    if (movingProject && movingProject.status === targetType) return;

    // Otherwise, toggle selected project's status and update projects
    this.projects = this.projects.map((p) =>
      p.id === projectId ? { ...p, status: targetType } : p,
    );

    this.callListenersWithUpdatedProjects();
  }

  private callListenersWithUpdatedProjects() {
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

export const state = ProjectState.getState();
