/**
 * @template T - Element imported from template
 * @template U - Host element to attach T to
 */
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  element: T;
  hostElement: U;
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string,
    newElementClass?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.element = document.importNode(this.templateElement.content, true)!
      .firstElementChild as T;
    this.hostElement = document.getElementById(hostElementId)! as U;

    if (newElementId) {
      this.element.id = newElementId;
    }
    if (newElementClass) {
      this.element.classList.add(newElementClass);
    }
    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend',
      this.element
    );
  }
  /**
   * Do stuffs (set Listeners, render other components...)
   */
  abstract configure(): void;
  /**
   * render any content inside attaching element
   */
  abstract renderContent(): void;
}
