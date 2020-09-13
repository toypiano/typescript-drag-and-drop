import { Component } from './base-component';
import { Project } from '../models/project';
import { Draggable } from '../models/draggable';

export class ProjectItem
  extends Component<HTMLLIElement, HTMLUListElement>
  implements Draggable {
  private project: Project;
  private get persons() {
    return this.project.numPeopleAssigned === 1
      ? '1 person'
      : this.project.numPeopleAssigned + ' people';
  }

  constructor(listId: string, project: Project) {
    super('single-project', listId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }
  configure() {
    this.element.addEventListener('dragstart', this.handleDragStart.bind(this));
    this.element.addEventListener('dragend', this.handleDragEnd.bind(this));
  }
  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }

  handleDragStart(e: DragEvent) {
    console.log('dragstart');
    e.dataTransfer!.setData('text/plain', this.project.id);
    e.dataTransfer!.effectAllowed = 'move';
  }

  handleDragEnd() {
    console.log('dragend');
  }
}
