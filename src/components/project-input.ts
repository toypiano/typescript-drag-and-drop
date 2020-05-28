import { Component } from './base-component';

export class ProjectInput extends Component<HTMLFormElement, HTMLDivElement> {
  constructor() {
    super('project-input', 'app', true, undefined, 'user-input');
  }

  configure() {}
  renderContent() {}
}
