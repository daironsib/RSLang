import { Injectable } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { createFolderIcon, createHardWordIcon, createLearnedIcon, createNoStatisticIcon, createNotHardWordIcon, createNotLearnedIcon, createRemoveHardWordIcon, createStatisticIcon } from 'app/utils';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  constructor(private sanitizer: DomSanitizer) { }
  
  public getFolderIcon(color: string) {
    return this.sanitizer.bypassSecurityTrustHtml(createFolderIcon(color))
  }
  
  public getLernedIcon() {
    return this.sanitizer.bypassSecurityTrustHtml(createLearnedIcon())
  }
  
  public getNotLernedIcon() {
    return this.sanitizer.bypassSecurityTrustHtml(createNotLearnedIcon())
  }
  
  public getHardWordIcon() {
    return this.sanitizer.bypassSecurityTrustHtml(createHardWordIcon())
  }
  
  public getNotHardWordIcon() {
    return this.sanitizer.bypassSecurityTrustHtml(createNotHardWordIcon())
  }
  
  public getRemoveHardWordIcon() {
    return this.sanitizer.bypassSecurityTrustHtml(createRemoveHardWordIcon())
  }
  
  public getStatisticIcon() {
    return this.sanitizer.bypassSecurityTrustHtml(createStatisticIcon())
  }
  
  public getNoStatisticIcon() {
    return this.sanitizer.bypassSecurityTrustHtml(createNoStatisticIcon())
  }
}

