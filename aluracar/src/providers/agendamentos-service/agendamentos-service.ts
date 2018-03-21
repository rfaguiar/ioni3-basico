import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Agendamento } from '../../modelos/agendamento';

@Injectable()
export class AgendamentosServiceProvider {

  private url: string = 'http://localhost:8080/api';

  constructor(private _http: HttpClient) {}

  agenda(agendamento: Agendamento): Observable<Object> {

    return this._http
        .post(this.url + '/agendamento/agenda', agendamento)
        .do(() => agendamento.enviado = true)
        .catch(() => Observable.of(new Error('Falha no agendamento! Tente novamente mais tarde')));
  }

}
