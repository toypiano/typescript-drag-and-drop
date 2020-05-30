import { Component } from './base-component';
import { Project } from '../models/project';
import { Draggable } from '../models/draggable';
import { autobind } from '../decorators/autobind';

export class ProjectItem extends Component<HTMLLIElement, HTMLUListElement>
  implements Draggable {
  private project: Project;
  /**
   * @param listId id of the <ul> element to render project item to
   * @param project contains project info to render into project item
   */
  constructor(listId: string, project: Project) {
    super('single-project', listId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }
  configure() {
    this.element.addEventListener('dragstart', this.handleDragStart);
    this.element.addEventListener('dragend', this.handleDragEnd);
  }

  renderContent() {
    // Render project information into the element.
    this.element.querySelector('h2')!.innerText = this.project.title;
    this.element.querySelector('h3')!.innerText =
      this.project.people + ' people assigned';
    this.element.querySelector('p')!.innerText = this.project.description;
  }

  @autobind
  handleDragStart(e: DragEvent) {
    if (e.dataTransfer) {
      // set moving project's id into drag event's dataTransfer property
      e.dataTransfer.setData('text/plain', this.project.id);
      e.dataTransfer.effectAllowed = 'move';
    }
  }

  handleDragEnd() {
    console.log('dragend');
  }
}
