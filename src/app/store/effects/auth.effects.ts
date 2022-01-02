import { Injectable } from '@angular/core';
import { catchError, EMPTY, exhaustMap, from, of, switchMap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import * as authActions from '../actions/auth.actions';
import { setErrorMessage } from 'src/app/store/actions/alert.actions';
import * as loadingActions from '../../store/actions/loading.actions';
import { getErrorMessage } from 'src/app/core/services';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.login),
      exhaustMap(action => {
        this.store.dispatch(loadingActions.startLoading());
        return from(
          this.authService.handleLogin(action.email, action.password)
        ).pipe(
          switchMap(() => {
            this.store.dispatch(loadingActions.stopLoading());
            return of(authActions.loginSuccess());
          }),
          catchError(error => {
            this.store.dispatch(loadingActions.stopLoading());
            return of(authActions.loginFailed({ errorCode: error.code }));
          })
        );
      })
    );
  });

  successfulLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSuccess),
        exhaustMap(() => {
          return of(() => EMPTY);
        })
      );
    },
    { dispatch: false }
  );

  setAuthStatus$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.setAuthStatus),
        exhaustMap(() => {
          this.router.navigateByUrl('/dashboard');
          return of(() => EMPTY);
        })
      );
    },
    { dispatch: false }
  );

  unsuccessfulLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loginFailed),
      switchMap(({ errorCode }) => {
        console.log(errorCode);
        return of(setErrorMessage({ message: getErrorMessage(errorCode) }));
      })
    );
  });

  signOut$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.signOut),
        switchMap(() => {
          this.authService.handleSignOut();
          this.router.navigateByUrl('/auth/login');
          return of(() => EMPTY);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private authService: AuthService,
    private store: Store<AppState>
  ) {}
}