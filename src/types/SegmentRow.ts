export class SegmentRow {
  id: number;
  name: string;

  constructor(props: any = {}) {
    this.id = props.id || 0;
    this.name = props.name || "";
  }
}
