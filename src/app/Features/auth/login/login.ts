import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
    acceptedTerms: [false, [Validators.requiredTrue]],
  });

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  get acceptedTerms() { return this.form.controls.acceptedTerms; }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      if (this.acceptedTerms.invalid) {
        this.errorMessage.set('Você precisa aceitar os Termos e a Política de Privacidade (LGPD) para continuar.');
      } else {
        this.errorMessage.set('Verifique os campos destacados e tente novamente.');
      }
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (user) => {
        this.loading.set(false);
        const redirectPath = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/producer';
        this.router.navigate([redirectPath]);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message ?? 'E-mail ou senha inválidos.');
      },
    });
  }

 selectedDemo = signal<'producer' | 'admin' | null>(null);

  fillDemo(role: 'producer' | 'admin'): void {
    this.selectedDemo.set(role);
    if (role === 'producer') {
      this.form.patchValue({ email: 'produtor@carbontrack.com', password: '123456' });
    } else {
      this.form.patchValue({ email: 'admin@carbontrack.com', password: '123456' });
    }
  }
}