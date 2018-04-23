import { Component,ViewChild } from '@angular/core';
import { Platform,NavController} from 'ionic-angular'; 
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Sim } from '@ionic-native/sim';
import { RestProvider } from '../providers/rest';
import { FCM } from '@ionic-native/fcm';
import { HomePage } from '../pages/home/home';
 
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;
  phone:string;
  token:string;
   
  constructor(private platform: Platform,  statusBar: StatusBar, private splashScreen: SplashScreen,
      speechRecognition:SpeechRecognition, private rest:RestProvider,private sim: Sim,
      private fcm : FCM  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(platform.is('cordova'))
      { 
        fcm.onNotification().subscribe(data=>{
          this.rest.currentUrl =  this.rest.apiUrl + 'mautolink/cu/delivery/deliveryDetail.do?dlv_no=' +  data.dlv_no  ;
        });
        statusBar.styleDefault();
        sim.requestReadPermission();
        speechRecognition.requestPermission();
      
        this.getFCMToken() ;  
      }
      else{
        this.rootPage=HomePage;
        
      }
    });
  }
 
  getFCMToken() {
    console.log("cargo365: get fcm start");
    this.fcm.getToken().then(token=>{
         
        this.token = token;
        
         
        this.getPhoneNumber();
      }
      );
     

  }
  appStart()
  {
    if(this.phone==null || this.token==null)
    {
      return ;
    }
    this.rest.appStart(this.phone, this.token).subscribe((data)=>{
      //this.onFCM();
      if(data.error == 'y')
      {
        alert(data.error_msg);
        this.platform.exitApp();
      }
      else
      {
        this.rest.id=data.mem_id;
        this.rest.auth_token = data.auth_token;
        
        this.rootPage=HomePage;
        this.splashScreen.hide();
      }
      
      
      
    }, 
    (err)=>{
      alert("에러 " + err);
    })

  }
  getPhoneNumber()
  {
    this.sim.getSimInfo().then(
      (info) => {
        if(info.phoneNumber)
        {
          
          let phone: string;
          if (info.phoneNumber.startsWith("+82")) {
            phone = "0" + info.phoneNumber.substring(3, 5) + "-" + info.phoneNumber.substring(5, info.phoneNumber.length - 4) + "-" + info.phoneNumber.substring(info.phoneNumber.length - 4, info.phoneNumber.length);
          }
          this.phone = phone;
          this.appStart();
          
        }
        else
        {
          if(info.phoneCount>0)
          {
            setTimeout(this.getPhoneNumber(), 1000);
          }
          else{
            //alert("전화번호가 없습니다.");
            this.rootPage=HomePage;
            this.splashScreen.hide();
          }
        }
      
    });
  }
}

