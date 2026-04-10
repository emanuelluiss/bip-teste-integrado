import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthService]
    });
    auth   = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('deve permitir acesso quando logado', () => {
    spyOnProperty(auth, 'isLoggedIn', 'get').and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));
    expect(result).toBeTrue();
  });

  it('deve redirecionar para /login quando não autenticado', () => {
    spyOnProperty(auth, 'isLoggedIn', 'get').and.returnValue(false);
    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));
    const urlTree = router.createUrlTree(['/login']);
    expect(result.toString()).toBe(urlTree.toString());
  });

  it('deve retornar UrlTree (não boolean) quando não autenticado', () => {
    spyOnProperty(auth, 'isLoggedIn', 'get').and.returnValue(false);
    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));
    expect(typeof result).toBe('object');
  });
});
