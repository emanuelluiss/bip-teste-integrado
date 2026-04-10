import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, AuthService]
    });
    guard  = TestBed.inject(AuthGuard);
    auth   = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('deve permitir acesso quando logado', () => {
    spyOn(auth, 'isLoggedIn' as never).and.returnValue(true);
    const result = guard.canActivate();
    expect(result).toBeTrue();
  });

  it('deve redirecionar para /login quando não autenticado', () => {
    spyOnProperty(auth, 'isLoggedIn', 'get').and.returnValue(false);
    const result = guard.canActivate();
    const urlTree = router.createUrlTree(['/login']);
    expect(result.toString()).toBe(urlTree.toString());
  });

  it('deve retornar UrlTree (não boolean) quando não autenticado', () => {
    spyOnProperty(auth, 'isLoggedIn', 'get').and.returnValue(false);
    const result = guard.canActivate();
    expect(typeof result).toBe('object');
  });
});
