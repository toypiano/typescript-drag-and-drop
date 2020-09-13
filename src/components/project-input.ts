import { Component } from './base-component';
import { state } from '../state/project-state';
import { autobind } from '../decorators/autobind';
import { validate } from '../utils/validation';

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
    this.element.addEventListener('submit', this.handleSubmit);
  }

  renderContent() {}

  @autobind
  private handleSubmit(e: Event) {
    e.preventDefault();

    const inputValues = this.getInputValues();
    if (Array.isArray(inputValues)) {
      const [title, description, people] = inputValues;
      state.addProject(title, description, people);
      this.clearForm();
    }
  }

  private getInputValues(): [string, string, number] | void {
    const titleValue = this.titleInputElement.value;
    const descriptionValue = this.descriptionInputElement.value;
    const peopleValue = +this.peopleInputElement.value;
    if (this.validateInputValues(titleValue, descriptionValue, peopleValue)) {
      return [titleValue, descriptionValue, peopleValue];
    }
    alert('Please enter valid inputs.');
  }

  private validateInputValues(
    title: string,
    description: string,
    people: number,
  ) {
    const titleValidator = {
      value: title,
      required: true,
    };
    const descriptionValidator = {
      value: description,
      minLength: 4,
    };
    const peopleValidator = {
      value: people,
      min: 1,
      max: 5,
    };
    const isValid = validate(
      titleValidator,
      descriptionValidator,
      peopleValidator,
    );
    return isValid;
  }

  private clearForm(): void {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }
}
