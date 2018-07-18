import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { MyApp } from './app.component';
import { RestProvider } from '../providers/rest';
import { HttpModule } from '@angular/http';
import { Sim } from '@ionic-native/sim';
import { FCM } from '@ionic-native/fcm';
import { HomePage } from '../pages/home/home'; 
import { LoginPage } from '../pages/login/login'; 
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,HomePage,LoginPage
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,HomePage,LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,SpeechRecognition, RestProvider, Sim, HttpModule,FCM, 
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
