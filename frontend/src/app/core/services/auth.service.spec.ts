import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule], providers: [AuthService] });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('deve fazer login com credenciais corretas', () => {
    const result = service.login('admin', 'admin123');
    expect(result).toBeTrue();
    expect(service.isLoggedIn).toBeTrue();
    expect(service.currentUser?.username).toBe('admin');
  });

  it('deve rejeitar credenciais inválidas', () => {
    const result = service.login('wrong', 'wrongpw');
    expect(result).toBeFalse();
    expect(service.isLoggedIn).toBeFalse();
  });

  it('deve fazer logout limpando localStorage', () => {
    service.login('admin', 'admin123');
    service.logout();
    expect(service.isLoggedIn).toBeFalse();
    expect(service.currentUser).toBeNull();
  });
});
