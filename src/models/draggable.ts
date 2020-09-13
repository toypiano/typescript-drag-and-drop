export interface Draggable {
  handleDragStart(e: DragEvent): void;
  handleDragEnd(e: DragEvent): void;
}

export interface DragTarget {
  handleDragOver(e: DragEvent): void;
  handleDrop(e: DragEvent): void;
  handleLeave(e: DragEvent): void;
}
