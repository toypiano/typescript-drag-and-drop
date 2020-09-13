import { ProjectItem } from './project-item';
import { Component } from './base-component';
import { Project } from '../models/project';
import { state } from '../state/project-state';
import { DragTarget } from '../models/draggable';
import { autobind } from '../decorators/autobind';

export class ProjectList
  extends Component<HTMLElement, HTMLDivElement>
  implements DragTarget {
  private assignedProjects: Project[] = [];

  constructor(private type: 'active' | 'completed') {
    super('project-list', 'app', false, `project--${type}`, `project--${type}`);
    this.type = type;
    this.configure();
    this.renderContent();
  }

  configure() {
    state.addListener((projects) => {
      this.assignProjects(projects);
      this.renderProjects(projects);
    });
    this.element.addEventListener('dragover', this.handleDragOver);
    this.element.addEventListener('drop', this.handleDrop);
    this.element.addEventListener('dragleave', this.handleLeave);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.type;
  }

  @autobind
  handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
      this.element.querySelector('ul')?.classList.add('droppable');
    }
  }

  @autobind
  handleDrop(e: DragEvent) {
    const projectId = e.dataTransfer?.getData('text/plain');
    if (projectId) {
      state.moveProject(projectId, this.type);
    }
  }

  @autobind
  handleLeave(e: DragEvent) {
    this.element.querySelector('ul')?.classList.remove('droppable');
  }

  private assignProjects(projects: Project[]) {
    this.assignedProjects = projects.filter((p) => p.status === this.type);
  }
  private renderProjects(projects: Project[]) {
    const ulElement = this.element.querySelector('ul')! as HTMLUListElement;
    ulElement.innerHTML = '';
    ulElement.id = `projects--${this.type}`;

    for (const project of this.assignedProjects) {
      new ProjectItem(ulElement.id, project);
    }
  }
}
