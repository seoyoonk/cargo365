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
  //public apiUrl = 'http://test.cargo365.co.kr/';
  public currentUrl;
  public apiUrl = 'http://www.cargo365.co.kr/';
  //public apiUrl = 'http://192.168.0.58:8080/';
  id; 
  loading;
  auth_token;
  phone;
  pwd;
  push_token;
  is_cordova = false;
  constructor(public http: Http, private loadingCtrl: LoadingController,public storage: Storage , public sanitizer: DomSanitizer,private jsonp: Jsonp) {
    
    this.currentUrl = this.apiUrl + 'index.jsp';
  }
  getUrlStr()
  {
    let pos = this.currentUrl.indexOf("?");
    let url = this.currentUrl  + (pos>0?"&":"?") +  "_i_=" + this.id + "&_a_=" + this.auth_token;
    return url;
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
    
    var body = "push_tp=3&id=" + encodeURIComponent(id) + "&pwd=" + encodeURIComponent( window.btoa(pwd)) ;
    
    return this.jsonp.request(this.apiUrl + "autolink/cu/member/appLogin.do?callback=JSONP_CALLBACK&" + body )  
        .map(res => {
          return res.json();
        });
  }
  saveInfo()
  {
     
    this.storage.set("phone", this.phone);
  }
  appStart( isJsonp )
  {
    let phone = this.phone;
    
    if(phone.startsWith("+82"))
    {
        phone = "0" + phone.substring(3,5) + "-" + phone.substring(5,phone.length-4) + "-" + phone.substring(phone.length-4,phone.length);
    }
     
    if(isJsonp)
    {
    
      var body = "push_tp=3&p=" + encodeURIComponent(window.btoa(phone)) + "&push_token=" + encodeURIComponent(this.push_token) ;
       
      return this.jsonp.request(this.apiUrl + "autolink/api/appStart.do?callback=JSONP_CALLBACK&" + body )  
        .map(res => {
          return res.json();
        });
    }
    else
    {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append("x-phone", phone);
      headers.append("x-push_tp", '3');
      headers.append("x-push_token", this.push_token);
      return this.http.get( this.apiUrl + "autolink/api/appStart.do", {headers : headers } ).map(
          res =>  res.json() 
            

      )
    }
    
  }
}