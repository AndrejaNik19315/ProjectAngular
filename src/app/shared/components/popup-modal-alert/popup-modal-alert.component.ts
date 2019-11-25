import { Component, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-popup-modal-alert',
  templateUrl: './popup-modal-alert.component.html',
  styleUrls: ['./popup-modal-alert.component.css']
})
export class PopupModalAlertComponent implements OnInit {
  @Input() alertTitle;
  @Input() alertDescription;
  
  constructor() { }

  ngOnInit() {
    
  }

  prompPopupAlert(commentId) {
    document.getElementsByClassName('modal')[0].classList.add("display");
  }
  
  closePopupAlert() {
    document.getElementsByClassName('modal')[0].classList.remove("display");
  }

}
