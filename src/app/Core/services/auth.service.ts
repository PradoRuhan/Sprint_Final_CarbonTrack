import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { LoginPayload, RegisterPayload, User } from '../models/user.model';

const STORAGE_KEY = 'carbontrack_user';

// "banco" mockado de usuários só pra simular autenticação
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Maria Produtora',
    email: 'produtor@carbontrack.com',
    password: '123456',
    role: 'producer',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Admin CarbonTrack',
    email: 'admin@carbontrack.com',
    password: '123456',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  // signal reativo com o usuário atual (null = deslogado)
  currentUser = signal<User | null>(this.loadFromStorage());

  login(payload: LoginPayload): Observable<User> {
    const found = MOCK_USERS.find(
      (u) => u.email === payload.email && u.password === payload.password
    );

    if (!found) {
      return throwError(() => new Error('E-mail ou senha inválidos.'));
    }

    const { password, ...user } = found;

    return of(user).pipe(
      delay(800), // simula latência de rede
      tap((u) => this.setSession(u))
    );
  }

  register(payload: RegisterPayload): Observable<User> {
    if (!payload.acceptedTerms) {
      return throwError(() => new Error('É necessário aceitar os termos da LGPD.'));
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      createdAt: new Date().toISOString(),
    };

    return of(newUser).pipe(
      delay(800),
      tap((u) => this.setSession(u))
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  private setSession(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadFromStorage(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}