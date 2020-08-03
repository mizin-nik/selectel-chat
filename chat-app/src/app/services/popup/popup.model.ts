export interface ConfigurePopupInterface {
  postpone?: boolean;
  draggable?: boolean;
  controls?: boolean;
  fullScreen?: boolean;
  overlay?: boolean;
  blur?: boolean;
  animation?: boolean;
  escClose?: boolean;
  onReady(): void;
  onCreate(): void;
  onClose(): void;
}

export interface EnteredPopupInterface {
  inputData?: any;
  onReady(): void;
  onCreate(): void;
  onClose(): void;
}
