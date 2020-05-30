import { Component } from './base-component';
import { state } from '../state/project-state';
import { Project, ProjectStatus } from '../models/project';
import { ProjectItem } from './project-item';
import { DragTarget } from '../models/drag-drop';
import { autobind } from '../decorators/autobind';
autobind;

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
    this.element.addEventListener('dragover', this.handleDragOver);
    this.element.addEventListener('drop', this.handleDrop);
    this.element.addEventListener('dragleave', this.handleDragLeave);
    state.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter(
        (p) =>
          p.status ===
          (this.type === 'active'
            ? ProjectStatus.Active
            : ProjectStatus.Completed)
      );
      this.renderProjects();
    });
  }
  renderContent() {
    this.element.querySelector(
      'h2'
    )!.textContent = `${this.type.toUpperCase()} PROJECT`;
  }

  private renderProjects() {
    const ulElement = this.element.querySelector('ul')! as HTMLUListElement;
    const listId = `projects--${this.type}`;
    ulElement.id = listId;

    ulElement.innerHTML = '';

    for (const project of this.assignedProjects) {
      new ProjectItem(listId, project);
    }
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
    console.log('drop');
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
}
