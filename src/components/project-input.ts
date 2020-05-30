import { Component } from './base-component';
import { state } from '../state/project-state';
import { autobind } from '../decorators/autobind';

export class ProjectInput extends Component<HTMLFormElement, HTMLDivElement> {
  private titleInputElement: HTMLInputElement;
  private descriptionInputElement: HTMLTextAreaElement;
  private peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, undefined, 'user-input');
    this.titleInputElement = document.getElementById(
      'title',
    ) as HTMLInputElement;
    this.descriptionInputElement = document.getElementById(
      'description',
    ) as HTMLTextAreaElement;
    this.peopleInputElement = document.getElementById(
      'people',
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.handleFormSubmit);
  }
  renderContent() {}

  @autobind
  private handleFormSubmit(e: Event) {
    e.preventDefault();

    const inputValues = this.getInputValues();
    if (Array.isArray(inputValues)) {
      const [title, description, people] = inputValues;
      state.addProject(title, description, people);
    }

    this.clearForm();
  }

  private getInputValues(): [string, string, number] | void {
    const titleValue = this.titleInputElement.value;
    const descriptionValue = this.descriptionInputElement.value;
    const peopleValue = this.peopleInputElement.value;

    return [titleValue, descriptionValue, +peopleValue];
  }

  private clearForm(): void {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }
}
