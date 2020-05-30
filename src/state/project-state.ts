import { v4 as uuid } from 'uuid';

import { Project, ProjectStatus } from '../models/project';

type Listener<S> = (state: S[]) => void;

class State<S> {
  protected listeners: Listener<S>[] = [];
  /**
   * Register listener to the state instance
   * @param listener listener to subscribe to the state update
   */
  addListener(listener: Listener<S>) {
    this.listeners.push(listener);
  }
}

class ProjectState extends State<Project> {
  private static instance: ProjectState;
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

  /**
   * add a new project to the state and call added listeners with updated state
   * @param title project title
   * @param description project description
   * @param people number of people assigned
   */
  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      uuid(),
      title,
      description,
      people,
      ProjectStatus.Active,
    );
    this.projects.push(newProject);
    this.callListenersWithUpdatedProjects();
  }

  /**
   * Change the dropped project's status based on where it dropped,
   * then call listeners with updated projects.
   * @param projectId id of the moving project
   * @param listType type of the list at which the project is dropped
   */
  moveProject(projectId: string, listType: ProjectStatus) {
    // if moving project is dragged back to where it was, no nothing.
    const movingProject = this.projects.find((p) => p.id === projectId);
    if (movingProject && movingProject.status === listType) return;

    // create new projects with updated status & call listeners
    const newProjects = this.projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          status: listType,
        };
      }
      return project;
    });
    this.projects = newProjects;
    this.callListenersWithUpdatedProjects();
  }

  private callListenersWithUpdatedProjects() {
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

export const state = ProjectState.getInstance();
