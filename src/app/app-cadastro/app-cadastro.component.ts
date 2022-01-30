import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { AutenticacaoFirebaseService } from './../servicosInterface/autenticacao-firebase.service';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const senha = control.get('senha')?.value;
    const confirma = control.get('confirmaSenha')?.value;

    if (senha && confirma && senha !== confirma) {
      return {
        senhaConfirmada: true
      }
    }
    return null;
  }
}

@Component({
  selector: 'app-app-cadastro',
  templateUrl: './app-cadastro.component.html',
  styleUrls: ['./app-cadastro.component.scss']
})
export class AppCadastroComponent implements OnInit {

  formularioCadastro = this.loginBuilder.group({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', Validators.required),
    confirmaSenha: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
  }, { validators: passwordMatchValidator() });

  constructor(
    private loginBuilder: FormBuilder,
    private autenticacaoFirebaseService: AutenticacaoFirebaseService,
    private toast: HotToastService,
    private rotas: Router
  ) { }

  get nome() {
    return this.formularioCadastro.get('nome')
  }

  get email() {
    return this.formularioCadastro.get('email')
  }

  get senha() {
    return this.formularioCadastro.get('senha')
  }

  get confirmaSenha() {
    return this.formularioCadastro.get('confirmaSenha')
  }

  get url() {
    return this.formularioCadastro.get('url')
  }

  enviaCadastro() {
    if (!this.formularioCadastro.valid) {
      return;
    }
    const { nome, email, senha, url } = this.formularioCadastro.value;
    this.autenticacaoFirebaseService
      .cadastrarUsuario(nome, email, senha, url)
      .pipe(
        this.toast.observe({
          success: 'Cadatro executado, bem vindo ao BookShelf',
          loading: 'Enviando informações...',
          error: ({ message }) => `Houve um problema: #BS${message}`,
        })
      ).subscribe(() => {
        this.rotas.navigate(['/'])
        this.resetarCampoCadastro();
      });
  }
  // Rotina limpar campo de cadastro
  resetarCampoCadastro() {
    this.formularioCadastro.reset();
    console.log("Campo de cadastro limpo");
    this.formularioCadastro = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
      senha: new FormControl(null),
      confirmaSenha: new FormControl(null),
    })
  }

  ngOnInit(): void {
  }
}
