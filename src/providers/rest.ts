import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  //public apiUrl = 'http://192.168.2.21/';
  public currentUrl;
  public apiUrl = 'https://www.cargo365.co.kr/';
  id; 
  auth_token;
  constructor(public http: Http,  public sanitizer: DomSanitizer) {
    
    this.currentUrl = this.apiUrl;
  }
  getUrl()
  {
    let pos = this.currentUrl.indexOf("?");
    let url = this.currentUrl  + (pos>0?"&":"?") +  "_i_=" + this.id + "&_a_=" + this.auth_token;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  appStart(phone:string, token:string)
  {
    let headers = new Headers();
    if(phone.startsWith("+82"))
    {
        phone = "0" + phone.substring(3,5) + "-" + phone.substring(5,phone.length-4) + "-" + phone.substring(phone.length-4,phone.length);
    }
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append("x-phone", phone);
    headers.append("x-push_tp", '3');
    headers.append("x-push_token", token);
    
    
    
    return this.http.get( this.apiUrl + "autolink/api/appStart.do", {headers : headers } ).map(
        res =>  res.json() 
         

    )
    
  }
}