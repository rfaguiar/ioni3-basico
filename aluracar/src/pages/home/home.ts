import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Loading } from 'ionic-angular';
import { Carro } from '../../modelos/carro';
import { HttpErrorResponse } from '@angular/common/http';
import { CarrosServiceProvider } from '../../providers/carros-service/carros-service';
import { NavLifeCycles } from '../../utils/ionic/nav/nav-lifecycles';
import { EscolhaPage } from '../escolha/escolha';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements NavLifeCycles {

  public carros: Carro[];

  constructor(public navCtrl: NavController, 
          private _carrosService: CarrosServiceProvider, 
          private _loadingCtrl: LoadingController, 
          private _alertCtrl: AlertController) {}

  ionViewDidLoad(): void {
    let loading: Loading = this._loadingCtrl.create({
      content: 'Carregando carros...'
    });

    loading.present();

    this._carrosService.lista()
        .subscribe((carros: Carro[]) => {
            this.carros = carros; 
            loading.dismiss()
          }, (err: HttpErrorResponse) => {
            loading.dismiss();
            this._alertCtrl.create({
              title: 'Falha na conexão',
              subTitle: 'Não foi possivel carregar a lista de carros. Tente novamente mais tarde',
              buttons: [
                { text: 'Ok'}
              ]
            }).present();
          }
        );
  }

  selecionaCarro(carro: Carro): void {

    this.navCtrl.push(EscolhaPage.name, {
      carroSelecionado: carro
    });
  }

}
