import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../Servicess/api-service';

@Component({
  selector: 'app-criar',
  imports: [ReactiveFormsModule],
  templateUrl: './criar.html',
  styleUrl: './criar.css',
})
export class Criar {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);

  formulario: FormGroup;

  constructor() {
    this.formulario = this.fb.group({
      TipoConta: ['', Validators.required],
      Descricao: ['', Validators.required],
      Data: ['', Validators.required],
      Tag: ['', Validators.required],
      Valor: [0, [Validators.required, Validators.min(0)]]
    });
  }

  salvar() {
    if (this.formulario.valid) {
      this.apiService.criar(this.formulario.value).subscribe({
        next: (response) => {
          alert('Registro criado com sucesso!');
          console.log('Criado com sucesso:', response);
          this.router.navigate(['/lista']);
        },
        error: (error) => {
          alert('Algo deu errado ao criar o registro!');
          console.error('Erro ao criar:', error);
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/lista']);
  }
}
