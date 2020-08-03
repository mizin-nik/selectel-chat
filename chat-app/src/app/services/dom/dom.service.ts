import { Injectable, Injector, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DomService {
  private componentRef: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  initComponent(component: any, data?: any): Promise<any> {
    return new Promise((resolve) => {
      /**
       * Create a component reference from the component
       */
      const componentRef = this.componentFactoryResolver.resolveComponentFactory(component).create(this.injector);
      
      /**
       * Write in private variable component link
       */
      this.componentRef = componentRef;

      /**
       * Attach component to the appRef so that it's inside the ng component tree
       */
      // TODO: Fix after Angular update.
      setTimeout(() => {
        this.appRef.attachView(componentRef.hostView);
      }, 0);

      /**
       * Insert component entered data
       */
      (<any>componentRef.instance).EnteredData = data;

      /**
       * Get DOM element from component
       */
      resolve((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement);
    });
  }

  insertComponent(content: HTMLElement, element?: Element) {
    if (element) {
      return element.appendChild(content);
    }

    const insertLayout: NodeList = document.querySelectorAll('.component-insert');

    for (const i of Object.keys(insertLayout)) {
      insertLayout[i].appendChild(content);
    }
  }

  destroyComponent() {
    setTimeout(() => {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
    }, 500);
  }
}
