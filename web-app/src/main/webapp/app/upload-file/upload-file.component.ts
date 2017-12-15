import { Component, OnInit, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  @Output() public onFile = new EventEmitter<File>();

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  @HostListener('click')
  onClick() {
    this.elementRef.nativeElement.querySelector('#fileInput').click();
  }

  onFileUpload(event: Event) {
    let file = (event.target as HTMLInputElement).files[0];
    
    if (file) {
        this.onFile.emit(file);
    }
  }
}
