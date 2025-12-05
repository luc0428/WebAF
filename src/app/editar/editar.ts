import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../Servicess/api-service';

@Component({
  selector: 'app-editar',
  imports: [ReactiveFormsModule],
  templateUrl: './editar.html',
  styleUrl: './editar.css',
})
export class Editar implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formulario: FormGroup;
  id: string = '';

  constructor() {
    this.formulario = this.fb.group({
      TipoConta: ['', Validators.required],
      Descricao: ['', Validators.required],
      Data: ['', Validators.required],
      Tag: ['', Validators.required],
      Valor: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.carregarDados();
  }

  carregarDados() {
    this.apiService.buscarPorId(this.id).subscribe({
      next: (response) => {
        const dataFormatada = new Date(response.Data).toISOString().split('T')[0];
        this.formulario.patchValue({
          TipoConta: response.TipoConta,
          Descricao: response.Descricao,
          Data: dataFormatada,
          Tag: response.Tag,
          Valor: response.Valor
        });
      },
      error: (error) => {
        alert('Erro ao carregar os dados!');
        console.error('Erro ao buscar:', error);
        this.router.navigate(['/lista']);
      }
    });
  }

  salvar() {
    if (this.formulario.valid) {
      this.apiService.atualizar(this.id, this.formulario.value).subscribe({
        next: (response) => {
          alert('Registro atualizado com sucesso!');
          console.log('Atualizado com sucesso:', response);
          this.router.navigate(['/lista']);
        },
        error: (error) => {
          alert('Algo deu errado ao atualizar o registro!');
          console.error('Erro ao atualizar:', error);
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/lista']);
  }
}
