import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TabsService {
  private JS: string = '__tabs';

  constructor() {
  }

  onInit(): void {
    this.onTabsLinkEvent();
  }

  onTabsLinkEvent(): void {
    for (const i of Object.keys(this.tabsLinks)) {
      this.tabsLinks[i].addEventListener('click', (event: Event) => {
        const $target: any = event.currentTarget;

        if ($target.dataset.tabView) {
          this.onTabsLinkResetActive();
          this.onTabsContentResetActive();

          $target.classList.add('active');

          this.onTabsContentView($target.dataset.tabView);
        }
      });
    }
  }

  onTabsLinkResetActive(): void {
    for (const i of Object.keys(this.tabsLinks)) {
      this.tabsLinks[i].classList.remove('active');
    }
  }

  onTabsContentView(content: string): void {
    for (const i of Object.keys(this.tabsContent)) {
      const $target = this.tabsContent[i];

      if ($target.dataset.tabContent === content) {
        $target.classList.add('active');
      }
    }
  }

  onTabsContentResetActive(): void {
    for (const i of Object.keys(this.tabsContent)) {
      this.tabsContent[i].classList.remove('active');
    }
  }

  get tabsLinks(): any {
    return document.querySelectorAll(`.${this.JS}-link`) || null;
  }

  get tabsContent(): any {
    return document.querySelectorAll(`.${this.JS}-content`) || null;
  }
}
