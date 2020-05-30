import { Component } from './base-component';
import { state } from '../state/project-state';
import { autobind } from '../decorators/autobind';
import { Validatable, validate } from '../utils/validation';

export class ProjectInput extends Component<HTMLFormElement, HTMLDivElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, undefined, 'user-input');
    this.titleInputElement = document.getElementById(
      'title'
    )! as HTMLInputElement;
    this.descriptionInputElement = document.getElementById(
      'description'
    )! as HTMLInputElement;
    this.peopleInputElement = document.getElementById(
      'people'
    )! as HTMLInputElement;
    this.configure();
  }
  configure() {
    this.element.addEventListener('submit', this.handleSubmit);
  }
  renderContent() {}

  private getUserInputs(): [string, string, number] | void {
    const titleInputValue: string = this.titleInputElement.value;
    const descriptionInputValue: string = this.descriptionInputElement.value;
    const peopleInputValue: number = +this.peopleInputElement.value;
    const titleInput: Validatable = {
      value: titleInputValue,
      required: true,
    };
    const descriptionInput: Validatable = {
      value: descriptionInputValue,
      required: true,
      minLength: 4,
    };
    const peopleInput: Validatable = {
      value: peopleInputValue,
      required: true,
      min: 1,
      max: 99,
    };
    if (validate(titleInput, descriptionInput, peopleInput)) {
      return [titleInputValue, descriptionInputValue, +peopleInputValue];
    } else {
      alert('Please enter valid input!');
    }
  }

  @autobind
  private handleSubmit(e: Event) {
    e.preventDefault();
    const userInputs = this.getUserInputs();
    if (Array.isArray(userInputs)) {
      const [title, description, people] = userInputs;
      state.addProject(title, description, people);
    }
    this.clearInputs();
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }
}
