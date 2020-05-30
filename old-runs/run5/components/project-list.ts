import { Component } from './base-component';
import { state } from '../state/project-state';
import { Project } from '../models/project';
import { ProjectStatus } from '../models/project';
import { ProjectItem } from './project-item';
import { DragTarget } from '../models/drag-drop';
import { autobind } from '../decorators/autobind';

export class ProjectList extends Component<HTMLElement, HTMLDivElement>
  implements DragTarget {
  private assignedProjects: Project[];
  constructor(private type: 'active' | 'completed') {
    super('project-list', 'app', false, `project--${type}`, `project--${type}`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }
  configure() {
    state.addListener((projects: Project[]) => {
      console.log('listener called');
      this.assignedProjects = projects.filter((p) => {
        if (this.type === 'active') {
          return p.status === ProjectStatus.Active;
        }
        return p.status === ProjectStatus.Completed;
      });
      this.renderProjects();
    });
    this.element.addEventListener('dragover', this.handleDragOver);
    this.element.addEventListener('drop', this.handleDrop);
    this.element.addEventListener('dragleave', this.handleDragLeave);
  }
  renderContent() {
    this.element.querySelector(
      'h2'
    )!.textContent = `${this.type.toUpperCase()} PROJECT`;
  }
  @autobind
  handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
      this.element.querySelector('ul')!.classList.add('droppable');
    }
  }
  @autobind
  handleDrop(e: DragEvent) {
    const projectId = e.dataTransfer!.getData('text/plain');
    state.moveProject(
      projectId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Completed
    );
  }
  @autobind
  handleDragLeave() {
    this.element.querySelector('ul')!.classList.remove('droppable');
  }

  private renderProjects() {
    const ulElement = this.element.querySelector('ul')! as HTMLUListElement;
    ulElement.id = `project-list--${this.type}`;
    ulElement.innerHTML = '';
    for (const project of this.assignedProjects) {
      new ProjectItem(ulElement.id, project);
    }
  }
}
