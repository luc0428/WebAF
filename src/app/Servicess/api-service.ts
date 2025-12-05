import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiServiceInterface {  
  _id: number;
  TipoConta: string;
  Descricao: string;
  Data: Date; 
  Tag: string;
  Valor: number;
}

@Injectable({
  providedIn: 'root',
})


export class ApiService {
  private http = inject(HttpClient);
  private base = `http://localhost:3000/controleFinanceiros`;

  listar(): Observable<ApiServiceInterface[]> {
    return this.http.get<ApiServiceInterface[]>(this.base);
  }

  buscarPorId(id: string): Observable<ApiServiceInterface> {
    return this.http.get<ApiServiceInterface>(`${this.base}/${id}`);
  }
  
  criar(controleFinanceiro: ApiServiceInterface): Observable<ApiServiceInterface>{
    console.log(controleFinanceiro);
    return this.http.post<ApiServiceInterface>(this.base, controleFinanceiro);
  }

  atualizar(id: string, controleFinanceiro: Partial<ApiServiceInterface>): Observable<ApiServiceInterface> {
    return this.http.put<ApiServiceInterface>(`${this.base}/${id}`, controleFinanceiro);
  }

  excluir(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
