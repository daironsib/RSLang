import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";

@Injectable()
export class FooterService {
  public footerState: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.footerState.subscribe();
  }

  public setFooterState(state: boolean): void {
    this.footerState.next(state);
  }
}
