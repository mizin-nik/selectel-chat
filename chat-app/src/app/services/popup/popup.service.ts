import { Injectable } from '@angular/core';
import { DomService } from '../dom/dom.service';

export const HandlerEvent = {
  desktop: {
    click: 'click',
  },
  mobile: {
    click: 'touchend',
  }
};

export const UITemplatePopup = (controls?: boolean) => {
  return `
    <div class="ui-popup-wrapper">
      ${controls ? '<div class="ui-popup-close"></div>' : ''}
      <div class="ui-popup-content">
        <div class="component-insert"></div>
      </div>
  </div>
  `;
};

@Injectable({
  providedIn: 'root'
})

export class PopupService {
  /**
   * Prefix for DOM-selectors.
   * @string
   */
  private Prefix = 'ui-popup';

  /**
   * Lists of DOM-selectors.
   */
  private SelectorUI = {
    appRoot: 'app-root',
    container: this.Prefix + '-container',
    overlay: this.Prefix + '-overlay',
    close: this.Prefix + '-close'
  };

  /**
   * Service settings.
   */
  private Settings = {
    /**
     * Option for moving of modal box.
     * @Boolean
     */
    draggable: false,

    /**
     * Option for creating of controls buttons.
     * @Boolean
     */
    controls: false,

    /**
     * Option for opening of modal box on full screen.
     * @Boolean
     */
    fullScreen: false,

    /**
     * Option for creating of overlay wrapper.
     * @Boolean
     */
    overlay: true,

    /**
     * Option for blur of background.
     * @Boolean
     */
    blur: false,

    /**
     * Option for animation of popup.
     * @Boolean
     */
    animation: true,

    /**
     * Option for remove popup from ESC press.
     * @Boolean
     */
    escClose: true,

    /**
     * Callback on ready DOM.
     */
    onReady: null,

    /**
     * Callback on event of creation.
     */
    onCreate: null,

    /**
     * Callback on event of closing.
     */
    onClose: null,
  };

  /**
   * Lists of animation's selectors.
   */
  private Animation = {
    viewIn: 'ui-animate-zoom-in',
    viewOut: 'ui-animate-zoom-out',
    blur: 'ui-animate-blur'
  };

  /**
   * Type of click.
   */
  private ClickEvent: string = HandlerEvent.desktop.click;

  constructor(
    private dom: DomService
  ) {
    this.deviceHandler();
  }

  configure<ConfigurePopupInterface>(settings) {
    for (const key in settings) {
      if (this.Settings.hasOwnProperty(key)) {
        this.Settings[key] = settings[key];
      }
    }
  }

  onBuild() {
    this.factoryPopupTemplate();
  }

  factoryPopupTemplate() {
    const _body = document.getElementsByTagName('body')[0];
    const _template = UITemplatePopup(this.Settings.controls);
    const _existence = this.existencePopup();

    const templateDiv = document.createElement('div');
          templateDiv.className = this.SelectorUI.container + `${this.Settings.fullScreen ? '-full' : ''}`;
          templateDiv.innerHTML = _template;

    const overlayDiv = document.createElement('div');
          overlayDiv.className = this.SelectorUI.overlay;

    if (_existence) {
      this.destroyPopupContainer();
    }

    this.insertPopupTemplate(templateDiv, overlayDiv);

    _body.classList.add('no-scroll');
  }

  insertPopupTemplate(templateDiv: Element, overlayDiv: Element) {
    const appRoot: any = document.getElementsByTagName(this.SelectorUI.appRoot) || null;

    if (!appRoot && !appRoot.length) {
      return;
    }
    const $appRoot = appRoot[0] || null;

    if ($appRoot && $appRoot instanceof Element) {
      $appRoot.appendChild(templateDiv);

      this.onCreateEvent();

      if (this.Settings.animation) {
        this.onAnimationPopupView(templateDiv);
      }

      if (this.Settings.blur) {
        this.onBlurLayout();
      }

      if (this.Settings.controls) {
        this.onPopupControls(templateDiv);
      }

      if (this.Settings.escClose) {
        this.onEscHandler();
      }

      if (this.Settings.overlay) {
        $appRoot.appendChild(overlayDiv);

        this.onPopupOverlay();
      }
    }
  }

  destroyPopupContainer() {
    const Container: any = this.getAllElementsBySelector(this.SelectorUI.container);
    const Body = document.getElementsByTagName('body')[0];

    Body.classList.remove('no-scroll');
    Container.forEach(($el: Element) => {
      this.onAnimationPopupHide($el);
    });

    this.onBlurLayoutReset();
  }

  destroyPopupOverlay() {
    const Overlay: any = this.getAllElementsBySelector(this.SelectorUI.overlay);

    Overlay.forEach(($el: Element) => {
      $el.remove();
    });
  }

  onPopupControls(container: Element) {
    const Close: any = this.getElementBySelector(this.SelectorUI.close, container);

    Close.forEach(($el: Element) => {
      this.onCloseHandler($el);
    });
  }

  onPopupOverlay() {
    const Overlay: any = this.getAllElementsBySelector(this.SelectorUI.overlay);

    Overlay.forEach(($el: Element) => {
      this.onCloseHandler($el);
    });
  }

  onCloseHandler(element: Element) {
    element.addEventListener(this.ClickEvent, (e) => {
      e.preventDefault();

      this.onCloseEvent();
    });
  }

  onEscHandler() {
    const removeKeyDown = () => {
      document.removeEventListener('keydown', keyDownListener);
    };

    const keyDownListener = e => {
      if (!this.existencePopup()) {
        return removeKeyDown();
      }
      if (e.keyCode === 27) {
        this.onCloseEvent();
        removeKeyDown();
      }
    };

    document.addEventListener('keydown', keyDownListener);
  }

  existencePopup(): boolean {
    const Container = this.getAllElementsBySelector(this.SelectorUI.container);

    if (Container.length !== 0) {
      return true;
    }
  }

  onAnimationReset(element: Element) {
    for (const i of Object.keys(this.Animation)) {
      element.classList.remove(this.Animation[i]);
    }
  }

  onAnimationPopupHide(element: Element) {
    const Wrapper: HTMLCollection = element.children;

    if (Wrapper.length) {
      const $el = Wrapper[Wrapper.length - 1] || null;

      this.onAnimationReset($el);

      if ($el && $el instanceof Element) {
        $el.classList.add(this.Animation.viewOut);

        const timeout = parseFloat(getComputedStyle($el)['transitionDuration']) * 1000 || 500;

        setTimeout(() => {
          element.remove();
        }, timeout);
      }
    }
  }

  onAnimationPopupView(element: Element) {
    const Wrapper: HTMLCollection = element.children;

    if (Wrapper.length) {
      const $el = Wrapper[Wrapper.length - 1] || null;

      this.onAnimationReset($el);

      if ($el && $el instanceof Element) {
        $el.classList.add(this.Animation.viewIn);
      }
    }
  }

  onBlurLayout() {
    const Page: any = document.querySelectorAll('.pg-wrapper');

    Page.forEach(($el: Element) => {
      $el.classList.add(this.Animation.blur);
    });
  }

  onBlurLayoutReset() {
    const Page: any = document.querySelectorAll('.pg-wrapper');

    Page.forEach(($el: Element) => {
      $el.classList.remove(this.Animation.blur);
    });
  }

  onCreateEvent() {
    const _onCreate = this.Settings.onCreate;

    if (!_onCreate && typeof _onCreate !== 'function') {
      return;
    }
    _onCreate();
  }

  onCloseEvent(): void {
    const _onClose = this.Settings.onClose;

    if (_onClose && typeof _onClose === 'function') {
      _onClose();
    }

    this.destroyPopupContainer();
    this.destroyPopupOverlay();
  }

  setCreateEvent(call: object): void {
    if (call.hasOwnProperty('onCreate')) {
      this.Settings.onCreate = call['onCreate'];
    }
  }

  setCloseEvent(call: object): void {
    if (call.hasOwnProperty('onClose')) {
      this.Settings.onCreate = call['onClose'];
    }
  }

  getAllElementsBySelector(selector: string): NodeList {
    return document.querySelectorAll(`.${selector}`);
  }

  getElementBySelector(selector: string, parent: Element): NodeList {
    return parent.querySelectorAll(`.${selector}`);
  }

  deviceHandler() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.ClickEvent = HandlerEvent.mobile.click;
    }
  }
}
