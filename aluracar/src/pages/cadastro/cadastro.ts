import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert } from 'ionic-angular';
import { Carro } from '../../modelos/carro';
import { Agendamento } from '../../modelos/agendamento';
import { AgendamentosServiceProvider } from '../../providers/agendamentos-service/agendamentos-service';
import { HomePage } from '../home/home';
import { Observable } from 'rxjs/Observable';
import { AgendamentoDaoProvider } from '../../providers/agendamento-dao/agendamento-dao';

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  public carro: Carro;
  public precoTotal: number;

  public nome: string = '';
  public endereco: string = '';
  public email: string = '';
  public data: string = new Date().toISOString();

  private _alerta: Alert;

  constructor(public navCtrl: NavController, 
      public navParams: NavParams,
      private _alertCtrl: AlertController,
      private _agendamentosService: AgendamentosServiceProvider,
     private _agendamentoDao: AgendamentoDaoProvider) {

        this.carro = this.navParams.get('carroSelecionado');
        this.precoTotal = this.navParams.get('precoTotal');

        
  }

  agenda(): void {

    if (!this.nome || !this.endereco || !this.email) {

      this._alertCtrl.create({
        title: 'Preenchimento obrigatório',
        subTitle: 'Preencha todos os campos!',
        buttons: [
          { text: 'Ok' }
        ]
      }).present();

      return;
    }

    let agendamento: Agendamento = {
      nomeCliente: this.nome,
      enderecoCliente: this.endereco,
      emailCliente: this.email,
      modeloCarro: this.carro.nome,
      precoTotal: this.precoTotal,
      data: this.data,
      confirmado: false,
      enviado: false
    };

    this._alerta = this._alertCtrl.create({
      title: 'Aviso',
      buttons: [
        { 
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          } 
        }
      ]
    });

    this._agendamentoDao
      .ehDuplicado(agendamento)
      .mergeMap(ehDuplicado => {
        if (ehDuplicado) {
          throw new Error('Agendamento existente!');
        }
        return this._agendamentosService.agenda(agendamento);
      })    
      .mergeMap((valor) => {
          let observable: Observable<any> = this._agendamentoDao.salva(agendamento)
          if (valor instanceof Error) {
            throw valor;
          }
          return observable;
        })
      .subscribe(
        () => {
          this._alerta.setSubTitle('Agendamento realizado!'),
          this._alerta.present();
        },
        (err: Error) => {
          this._alerta.setSubTitle(err.message),
          this._alerta.present();
        }
      );
  }


}
