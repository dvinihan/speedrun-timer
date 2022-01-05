export class RunSegment {
  runId: number;
  segmentId: number;
  segmentTime: number;
  isCompleted: boolean;

  constructor(props: any = {}) {
    this.runId = props.runId || 0;
    this.segmentId = props.segmentId || 0;
    this.segmentTime = props.segmentTime || 0;
    this.isCompleted = props.isCompleted || false;
  }
}
