import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  const { value } = await Preferences.get({ key: 'jwt' });
  return value ? true : router.createUrlTree(['/login']);
};
