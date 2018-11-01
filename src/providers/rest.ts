import { Injectable } from '@angular/core';
import { Http,Headers, Jsonp, RequestOptionsArgs } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  //public apiUrl = 'http://v2.autolink.center/';
  public currentUrl;
  //public apiUrl = 'https://www.cargo365.co.kr/';
  public apiUrl = 'http://172.23.137.177:8080/';
  id; 
  loading;
  auth_token;
  phone;
  pwd;
  push_token;
  is_cordova = false;
  constructor(public http: Http, private loadingCtrl: LoadingController,public storage: Storage , public sanitizer: DomSanitizer,private jsonp: Jsonp) {
    
    this.currentUrl = this.apiUrl;
  }
  getUrl()
  {
    let pos = this.currentUrl.indexOf("?");
    let url = this.currentUrl  + (pos>0?"&":"?") +  "_i_=" + this.id + "&_a_=" + this.auth_token;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  showLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }
  closeLoading() {
    if (this.loading != null) this.loading.dismiss();
  }
  getPhoneFromStorage()
  {
      return this.storage.get("phone")
  }
  login(id, pwd)
  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append("x-id", id);
    headers.append("x-push_tp", '3');
    headers.append("x-pwd", pwd);
    var body = "push_tp=3&id=" + encodeURIComponent(id) + "&pwd=" + encodeURIComponent(pwd) ;
    var options = {headers : headers};


    /*return this.http.get( this.apiUrl + "autolink/cu/member/appLogin.do", {headers : headers } ).map(
      res =>  res.json() 
      

    )*/
    return this.jsonp.request(this.apiUrl + "autolink/cu/member/appLogin.do?callback=JSONP_CALLBACK&" + body, options)  
        .map(res => {
          return res.json();
        });
  }
  saveInfo()
  {
     
    this.storage.set("phone", this.phone);
  }
  appStart(  )
  {
    let phone = this.phone;
    let headers = new Headers();
    if(phone.startsWith("+82"))
    {
        phone = "0" + phone.substring(3,5) + "-" + phone.substring(5,phone.length-4) + "-" + phone.substring(phone.length-4,phone.length);
    }
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append("x-phone", phone);
    headers.append("x-push_tp", '3');
    headers.append("x-push_token", this.push_token);
    
    
    
    return this.http.get( this.apiUrl + "autolink/api/appStart.do", {headers : headers } ).map(
        res =>  res.json() 
         

    )
    
  }
}