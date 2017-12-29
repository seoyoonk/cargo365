import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Sim } from '@ionic-native/sim';
import { RestProvider } from '../providers/rest';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;

  constructor(platform: Platform, statusBar: StatusBar, private splashScreen: SplashScreen,speechRecognition:SpeechRecognition, private rest:RestProvider,private sim: Sim ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      sim.requestReadPermission();
      speechRecognition.requestPermission();
      
      this.getPhoneNumber();
    });
  }
  getPhoneNumber()
  {
    this.sim.getSimInfo().then(
      (info) => {
        if(info.phoneNumber)
        {
          
          this.rest.appStart(info.phoneNumber).subscribe(
            res => {
              
              //this.rootPage = TabsPage;
             
              location.href= this.rest.apiUrl;
              this.splashScreen.hide();
            },
            err => {
                      alert("ERROR!: " +  err);
                   }
          );;
          
        }
        else
        {
          if(info.phoneCount>0)
          {
            setTimeout(this.getPhoneNumber(), 1000);
          }
          else{
            location.href= this.rest.apiUrl;
            this.splashScreen.hide();
          }
        }
      
    });
  }
}

