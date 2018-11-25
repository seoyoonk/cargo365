import { Component } from '@angular/core'; 
import {NavController} from 'ionic-angular';
import { RestProvider } from '../../providers/rest';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'login.html'
})
export class LoginPage {

  
  id : string;
  pwd : string;
  constructor(public rest: RestProvider, private navi: NavController) {

  }

  ionViewDidLoad() { 
   
  }
  
  login()
  {
    this.rest.showLoading("처리중입니다.");
    
    this.rest.login( this.id , this.pwd).subscribe(
        (data) =>{
            if(data.error != null)
            {
              this.rest.closeLoading();
              alert(data.error_msg);
              return ;
            }
            else
            {
            
              this.rest.phone =data.phone;
              this.rest.id=data.mem_id;
              this.rest.auth_token = data.auth_token;
              this.rest.saveInfo();
              this.rest.closeLoading();
              
              this.navi.setRoot(HomePage).then(data => {
                   
                }, (error) => {
                  
                });
            }
        },
        (err)=>{
          this.rest.closeLoading();
          alert(err);
          return ;
        });
       
        
  
  
      
    }
  
}
