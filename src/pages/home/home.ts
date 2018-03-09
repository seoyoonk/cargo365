import { Component ,ViewChild, ElementRef,SecurityContext} from '@angular/core';
import { NavController ,AlertController } from 'ionic-angular';
 
import {Platform} from "ionic-angular";
import { DomSanitizer } from '@angular/platform-browser';
import { RestProvider } from '../../providers/rest';
import { FCM } from '@ionic-native/fcm';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  src; 
  @ViewChild('mainFrame') mainFrame: ElementRef;
  constructor(public navCtrl: NavController, fcm:FCM, public sanitizer: DomSanitizer,   
    platform: Platform, public rest : RestProvider , alertCtrl:AlertController)
  {
    
    this.src = sanitizer.bypassSecurityTrustResourceUrl(this.rest.currentUrl);
    
    fcm.onNotification().subscribe(data=>{
       
      if(data.dlv_no)
      {
         if(!data.wasTapped)
         {
          let alert = alertCtrl.create({
            title: '알림',
            subTitle: data.body,
            buttons: ['OK']
          });
          alert.present(); 
         }
         this.goDeliveryDetail(data.dlv_no) ;
         
      }
    }) 
    /*setTimeout(() => {
      this.goDeliveryDetail('1519698707944427512');
    }, 5000);*/
  }
  goDeliveryDetail(dlv_no)
  {
    
    this.rest.currentUrl =  this.rest.apiUrl + 'mautolink/cu/delivery/deliveryDetail.do?dlv_no=' +  dlv_no  ;
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.rest.currentUrl);
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
   
}
