import { Routes } from '@angular/router';
import { authGuard } from './services/auth-guard';
import { UserComponent } from './components/user/user';
import { UserArea } from './components/user-area/user-area';
import { AdminArea } from './components/admin-area/admin-area';
import { AdminViewComponent } from './components/admin-detail/admin-detail';
import { AdminEditComponent } from './components/admin-update/admin-update';
import { AdminAddComponent } from './components/admin-add/admin-add';
import { UserDetailComponent } from './components/user-detail/user-detail';
import { MovieDetailComponent } from './components/movie-detail/movie-detail';
import { MovieAddComponent } from './components/movie-add/movie-add';  // Import added
import { TheaterDetailComponent } from './components/theater-detail/theater-detail';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { UserUpdateComponent } from './components/user-update/user-update';
import { BookingComponent } from './components/booking/booking';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection';
import { UnsavedChangesGuard } from './guards/unsaved-changes-guard';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation';
import { TicketViewComponent } from './components/ticketview/ticketview';
import { BookingDisplayComponent } from './components/bookingdisplay/bookingdisplay';

export const routes: Routes = [
  { path: '', component: UserComponent },
  { path: 'user-area', component: UserArea, canActivate: [authGuard] },
  { path: 'admin', component: AdminArea, canActivate: [authGuard] },
  { path: 'admin/add', component: AdminAddComponent, canActivate: [authGuard] },
  { path: 'admin/view', component: AdminViewComponent, canActivate: [authGuard] },
  { path: 'admin/edit/:id', component: AdminEditComponent, canActivate: [authGuard] },
  { path: 'admin/users', component: UserDetailComponent, canActivate: [authGuard] },
  { path: 'admin/movies', component: MovieDetailComponent, canActivate: [authGuard] },
  { path: 'admin/movies/add', component: MovieAddComponent, canActivate: [authGuard] },  // New route
  { path: 'admin/theatres', component: TheaterDetailComponent },
   { path: 'profile', component: UserProfileComponent },
   { path: 'user/update', component: UserUpdateComponent },
  { path: 'seat-selection/:movieId/:screenId/:theaterId/:showId',component: SeatSelectionComponent,canDeactivate: [UnsavedChangesGuard]},
  { path: 'booking/:movieId', component: BookingComponent },
  { path: 'booking-confirmation', component: BookingConfirmationComponent },
  { path: 'ticketview', component: TicketViewComponent },
  { path: 'bookingview', component: BookingDisplayComponent },
  { path: '**', redirectTo: '' }
  

];
