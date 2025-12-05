import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiServiceInterface } from '../Servicess/api-service';

@Component({
  selector: 'app-lista',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista.html',
  styleUrl: './lista.css',
})
export class Lista implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  controles: ApiServiceInterface[] = [];
  controlesFiltrados: ApiServiceInterface[] = [];
  carregando = false;

  // Filtros
  ordenacaoTipoConta: string = '';
  ordenacaoTag: string = '';
  ordenacaoValor: string = '';

  // Cores
  corReceitas: string = 'green';
  corDespesas: string = 'red';

  ngOnInit() {
    this.listar();
  }

  get saldo(): number {
    return this.controlesFiltrados.reduce((total, controle) => {
      if (controle.TipoConta === 'Receitas') {
        return total + controle.Valor;
      } else if (controle.TipoConta === 'Despesas') {
        return total - controle.Valor;
      }
      return total;
    }, 0);
  }

  listar() {
    this.carregando = true;
    this.apiService.listar().subscribe({
      next: (response) => {
        this.controles = response;
        this.aplicarFiltros();
        this.carregando = false;
        console.log('Lista carregada:', response);
      },
      error: (error) => {
        alert('Erro ao carregar a lista!');
        console.error('Erro ao listar:', error);
        this.carregando = false;
      }
    });
  }

  aplicarFiltros() {
    let resultado = [...this.controles];

    // Ordenação por Tipo de Conta
    if (this.ordenacaoTipoConta === 'despesas-receitas') {
      resultado.sort((a, b) => {
        if (a.TipoConta === 'Despesas' && b.TipoConta === 'Receitas') return -1;
        if (a.TipoConta === 'Receitas' && b.TipoConta === 'Despesas') return 1;
        return 0;
      });
    } else if (this.ordenacaoTipoConta === 'receitas-despesas') {
      resultado.sort((a, b) => {
        if (a.TipoConta === 'Receitas' && b.TipoConta === 'Despesas') return -1;
        if (a.TipoConta === 'Despesas' && b.TipoConta === 'Receitas') return 1;
        return 0;
      });
    }

    // Ordenação por tag
    if (this.ordenacaoTag === 'asc') {
      resultado.sort((a, b) => a.Tag.localeCompare(b.Tag));
    } else if (this.ordenacaoTag === 'desc') {
      resultado.sort((a, b) => b.Tag.localeCompare(a.Tag));
    }

    // Ordenação por valor
    if (this.ordenacaoValor === 'asc') {
      resultado.sort((a, b) => a.Valor - b.Valor);
    } else if (this.ordenacaoValor === 'desc') {
      resultado.sort((a, b) => b.Valor - a.Valor);
    }

    this.controlesFiltrados = resultado;
  }

  limparFiltros() {
    this.ordenacaoTipoConta = '';
    this.ordenacaoTag = '';
    this.ordenacaoValor = '';
    this.aplicarFiltros();
  }

  getCorLinha(tipoConta: string): string {
    if (tipoConta === 'Receitas') {
      return this.corReceitas;
    } else if (tipoConta === 'Despesas') {
      return this.corDespesas;
    }
    return 'transparent';
  }

  editar(controle: ApiServiceInterface) {
    this.router.navigate(['/editar', controle._id]);
  }

  excluir(id: string) {
    if (confirm('Deseja realmente excluir este registro?')) {
      this.apiService.excluir(id).subscribe({
        next: () => {
          alert('Registro excluído com sucesso!');
          this.listar();
        },
        error: (error) => {
          alert('Erro ao excluir o registro!');
          console.error('Erro ao excluir:', error);
        }
      });
    }
  }
}
