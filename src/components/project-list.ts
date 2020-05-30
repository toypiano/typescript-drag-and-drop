import { Component } from './base-component';

import { state } from '../state/project-state';
import { Project, ProjectStatus } from '../models/project';
import { ProjectItem } from './project-item';
import { DragTarget } from '../models/draggable';
import { autobind } from '../decorators/autobind';

export class ProjectList extends Component<HTMLElement, HTMLDivElement>
  implements DragTarget {
  private assignedProjects: Project[] = [];
  // TODO - refactor type as ProjectStatus type and create functions that returns CSS query string
  constructor(private type: 'active' | 'completed') {
    super('project-list', 'app', false, `project--${type}`, `project--${type}`);

    this.configure();
    this.renderContent();
  }

  configure() {
    state.addListener(this.assignAndRenderProjects);
    this.element.addEventListener('dragover', this.handleDragOver);
    this.element.addEventListener('drop', this.handleDrop);
    this.element.addEventListener('dragleave', this.handleDragLeave);
  }

  renderContent() {
    this.element.querySelector(
      'h2',
    )!.textContent = `${this.type.toUpperCase()} PROJECT`;
  }

  @autobind
  handleDragOver(e: DragEvent) {
    // to allow drop event upon 'dragover' event
    e.preventDefault();
    // add style to list when project-item is dragged over
    if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
      this.element.querySelector('ul')?.classList.add('droppable');
    }
  }

  @autobind
  handleDrop(e: DragEvent) {
    const projectId = e.dataTransfer?.getData('text/plain');
    // also passing this list's type in order to handle the case where
    // project item is dragged and put back to where it was.
    if (projectId) {
      state.moveProject(
        projectId,
        this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Completed,
      );
    }
  }

  @autobind
  handleDragLeave() {
    this.element.querySelector('ul')?.classList.remove('droppable');
  }

  @autobind
  private assignAndRenderProjects(projects: Project[]) {
    this.assignedProjects = projects.filter(
      (project) =>
        project.status ===
        (this.type === 'active'
          ? ProjectStatus.Active
          : ProjectStatus.Completed),
    );

    this.renderProjects();
  }

  private renderProjects() {
    // clear list of previous items
    const ulElement = this.element.querySelector('ul')! as HTMLUListElement;
    ulElement.innerHTML = '';

    // attach id to the ul element
    const listId = `projects--${this.type}`;
    ulElement.id = listId;

    // render project items into corresponding list
    for (const project of this.assignedProjects) {
      new ProjectItem(listId, project);
    }
  }
}
