/**
 * @template E firstElementChild of imported template
 * @template H Host element to insert E to
 */
export abstract class Component<E extends HTMLElement, H extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  /** @property firstElementChild of imported template */
  element: E;
  /** @property Host element in the DOM to insert new elements*/
  hostElement: H;

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
    // import element from the template with the given id
    this.templateElement = document.getElementById(
      templateId,
    ) as HTMLTemplateElement;
    this.element = document.importNode(this.templateElement.content, true)
      .firstElementChild as E;

    // add given id / class to the imported element
    if (elementId) {
      this.element.id = elementId;
    }
    if (elementClass) {
      this.element.classList.add(elementClass);
    }

    // insert element to host
    this.hostElement = document.getElementById(hostId) as H;
    this.insert(prepend);
  }

  private insert(prepend: boolean) {
    this.hostElement.insertAdjacentElement(
      prepend ? 'afterbegin' : 'beforeend',
      this.element,
    );
  }

  /**
   *
   */
  abstract configure(): void;
  /**
   * render text/element inside the inserted element
   */
  abstract renderContent(): void;
}
