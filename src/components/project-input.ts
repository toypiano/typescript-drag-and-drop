import { Component } from './base-component';
import { state } from '../state/project-state';
import { autobind } from '../decorators/autobind';
import { Validatable, validate } from '../utils/validation';

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

    if (this.validateInputValues(titleValue, descriptionValue, +peopleValue)) {
      return [titleValue, descriptionValue, +peopleValue];
    } else {
      alert('Please enter valid input');
    }
  }

  private validateInputValues(
    titleValue: string,
    descriptionValue: string,
    peopleValue: number,
  ) {
    const title: Validatable = {
      value: titleValue,
      required: true,
    };
    const description: Validatable = {
      value: descriptionValue,
      minLength: 4,
    };
    const people: Validatable = {
      value: peopleValue,
      min: 2,
      max: 5,
    };

    return validate(title, description, people);
  }

  private clearForm(): void {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }
}
