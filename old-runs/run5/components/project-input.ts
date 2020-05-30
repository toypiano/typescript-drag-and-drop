import { Component } from './base-component';
import { state } from '../state/project-state';
import { autobind } from '../decorators/autobind';
import { validate, Validatable } from '../utils/validation';

export class ProjectInput extends Component<HTMLFormElement, HTMLDivElement> {
  private titleInputElement: HTMLInputElement;
  private descriptionInputElement: HTMLInputElement;
  private peopleInputElement: HTMLInputElement;

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
    this.renderContent();
  }

  configure() {
    this.element.addEventListener('submit', this.handleSubmit);
  }
  renderContent() {}

  @autobind
  private handleSubmit(e: Event) {
    e.preventDefault();
    const inputValues = this.getInputs();
    if (Array.isArray(inputValues)) {
      const [title, description, people] = inputValues;
      state.addProject(title, description, people);
      this.clearInputs();
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  private getInputs(): [string, string, number] | void {
    const titleValue: string = this.titleInputElement.value;
    const descriptionValue: string = this.descriptionInputElement.value;
    const peopleValue: number = +this.peopleInputElement.value;

    const title: Validatable = {
      value: titleValue,
      required: true,
    };
    const description: Validatable = {
      value: descriptionValue,
      required: true,
      minLength: 4,
    };
    const people: Validatable = {
      value: peopleValue,
      required: true,
      min: 2,
      max: 5,
    };
    if (validate(title, description, people)) {
      return [titleValue, descriptionValue, peopleValue];
    } else {
      alert('Please enter valid input');
    }
  }
}
