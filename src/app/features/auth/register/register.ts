import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  backgroundImageUrl = 'image/trator_agro.jpg';

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showTermsModal = signal(false);
  showPassword = signal(false);

  roles: { value: UserRole; label: string }[] = [
    { value: 'producer', label: 'Produtor Rural' },
    { value: 'cooperative', label: 'Cooperativa' },
    { value: 'consultant', label: 'Consultoria Ambiental' },
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['producer' as UserRole, [Validators.required]],
    acceptedTerms: [false, [Validators.requiredTrue]],
  });

  get name() { return this.form.controls.name; }
  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  get acceptedTerms() { return this.form.controls.acceptedTerms; }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleTermsModal(): void {
    this.showTermsModal.update((v) => !v);
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

    const raw = this.form.getRawValue();

    this.authService
      .register({
        name: raw.name!,
        email: raw.email!,
        password: raw.password!,
        role: raw.role!,
        acceptedTerms: raw.acceptedTerms!,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/onboarding']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.message ?? 'Erro ao criar conta. Tente novamente.');
        },
      });
  }
}