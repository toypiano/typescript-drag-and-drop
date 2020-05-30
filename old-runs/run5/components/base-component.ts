/**
 * @template T Element imported from template
 * @template U Host Element to insert T into
 */
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  element: T;
  hostElement: U;

  constructor(
    templateId: string,
    hostId: string,
    prepend: boolean,
    elementId?: string,
    elementClass?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.element = document.importNode(this.templateElement.content, true)!
      .firstElementChild as T;
    if (elementId) {
      this.element.id = elementId;
    }
    if (elementClass) {
      this.element.classList.add(elementClass);
    }

    this.hostElement = document.getElementById(hostId)! as U;

    this.insert(prepend);
  }

  private insert(prepend: boolean) {
    this.hostElement.insertAdjacentElement(
      prepend ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;
  /**
   * Render some nodes inside this.element
   */
  abstract renderContent(): void;
}
