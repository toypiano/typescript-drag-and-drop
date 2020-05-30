import { Component } from './base-component';

import { state } from '../state/project-state';
import { Project, ProjectStatus } from '../models/project';
import { ProjectItem } from './project-item';
import { DragTarget } from '../models/draggable';
import { autobind } from '../decorators/autobind';

/**
 * Helper function that converts ProjectStatus into a query string
 * @param listType type of the project list
 * @returns CSS query string for identifying the type of ProjectList instance
 */
function getListQuery(listType: ProjectStatus) {
  let type;
  if (listType === ProjectStatus.Active) type = 'active';
  if (listType === ProjectStatus.Completed) type = 'completed';

  return `project--${type}`;
}

export class ProjectList extends Component<HTMLElement, HTMLDivElement>
  implements DragTarget {
  private assignedProjects: Project[] = [];

  constructor(private type: ProjectStatus) {
    // can't use 'this' until after super, so we can't use getter here
    // you could use `project--${type === ProjectStatus.Active ? 'active' : 'completed'}` instead
    super('project-list', 'app', false, getListQuery(type), getListQuery(type));

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
    this.element.querySelector('h2')!.textContent = `${
      ProjectStatus[this.type] // reverse mapping enum
    } Project`;
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
      state.moveProject(projectId, this.type);
    }
  }

  @autobind
  handleDragLeave() {
    this.element.querySelector('ul')?.classList.remove('droppable');
  }

  @autobind
  private assignAndRenderProjects(projects: Project[]) {
    this.assignedProjects = projects.filter(
      (project) => project.status === this.type,
    );

    this.renderProjects();
  }

  private renderProjects() {
    // clear list of previous items
    const ulElement = this.element.querySelector('ul')! as HTMLUListElement;
    ulElement.innerHTML = '';

    // attach id to the ul element
    const ulElementId = `projects--${this.type}`;
    ulElement.id = ulElementId;

    // render project items into corresponding list
    for (const project of this.assignedProjects) {
      new ProjectItem(ulElementId, project);
    }
  }
}
