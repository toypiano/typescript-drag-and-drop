export abstract class Component<E extends HTMLElement, H extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  /** @property firstElementChild of imported template */
  element: HTMLElement;
  /** @property Host element in the DOM to which new element is inserted */
  hostElement: HTMLElement;

  /**
   *
   * @param templateId id of the template to import element from
   * @param hostId id of the host element to render imported element at
   * @param prepend insert at the beginning if true
   * @param elementId id to add to the rendering element
   * @param elementClass className to add to the rendering element
   */
  constructor(
    templateId: string,
    hostId: string,
    prepend: boolean,
    elementId?: string,
    elementClass?: string,
  ) {
    this.templateElement = document.getElementById(
      templateId,
    ) as HTMLTemplateElement;
    this.element = document.importNode(this.templateElement.content, true)
      .firstElementChild as E;
    if (elementId) {
      this.element.id = elementId;
    }
    if (elementClass) {
      this.element.classList.add(elementClass);
    }

    this.hostElement = document.getElementById(hostId) as H;
    this.insert(prepend);
  }

  private insert(prepend: boolean) {
    this.hostElement.insertAdjacentElement(
      prepend ? 'afterbegin' : 'beforeend',
      this.element,
    );
  }

  abstract configure(): void;

  /**
   * Render text/element inside the inserted element
   */
  abstract renderContent(): void;
}
