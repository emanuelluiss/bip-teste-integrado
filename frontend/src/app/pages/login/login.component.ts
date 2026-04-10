import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  features = [
    { icon: 'pi pi-shield', label: 'Transações com locking otimista' },
    { icon: 'pi pi-bolt', label: 'Transferências em tempo real' },
    { icon: 'pi pi-chart-line', label: 'Histórico detalhado de operações' }
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() { return this.form.get('username')!; }
  get password() { return this.form.get('password')!; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.errorMessage = '';

    // Simula latência de rede para demonstrar loading state
    setTimeout(() => {
      const ok = this.auth.login(this.username.value, this.password.value);
      if (ok) {
        this.router.navigate(['/beneficios']);
      } else {
        this.errorMessage = 'Credenciais inválidas. Verifique usuário e senha.';
      }
      this.loading = false;
    }, 800);
  }
}
