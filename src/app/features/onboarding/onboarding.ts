import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-onboarding',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  backgroundImageUrl = 'image/paisagem_fazenda_agro.jpg';

  cancelOnboarding(): void {
    const confirmed = confirm('Tem certeza que deseja sair? Seus dados de cadastro nesta etapa serão perdidos.');
    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  currentStep = signal(1);
  totalSteps = 3;
  uploadedFileName = signal<string | null>(null);

stepOneForm = this.fb.group({
    fullName: [''],
    document: [''],
    phone: [''],
    email: [''],
  });

  stepTwoForm = this.fb.group({
    propertyName: [''],
    city: [''],
    state: [''],
    totalArea: [null as number | null],
    preservedArea: [null as number | null],
  });

  stepThreeForm = this.fb.group({
    carNumber: [''],
  });
  
  get step1() { return this.stepOneForm.controls; }
  get step2() { return this.stepTwoForm.controls; }
  get step3() { return this.stepThreeForm.controls; }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFileName.set(input.files[0].name);
    }
  }

  nextStep(): void {
    if (this.currentStep() === 1 && this.stepOneForm.invalid) {
      this.stepOneForm.markAllAsTouched();
      return;
    }
    if (this.currentStep() === 2 && this.stepTwoForm.invalid) {
      this.stepTwoForm.markAllAsTouched();
      return;
    }
    this.currentStep.update((s) => Math.min(s + 1, this.totalSteps));
  }

  previousStep(): void {
    this.currentStep.update((s) => Math.max(s - 1, 1));
  }

  finish(): void {
    if (this.stepThreeForm.invalid) {
      this.stepThreeForm.markAllAsTouched();
      return;
    }
    const role = this.authService.currentUser()?.role;
    const redirectPath = role === 'admin' ? '/dashboard/admin' : '/dashboard/producer';
    this.router.navigate([redirectPath]);
  }
}