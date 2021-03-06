import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { signOut } from 'src/app/store/actions/auth.actions';
import { selectIsLoggedIn } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;

  @Output() toggleSidenav = new EventEmitter();

  constructor(private store: Store) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  ngOnInit(): void {}

  onSignOut() {
    this.store.dispatch(signOut());
  }
}
