import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  signInWithCredential,
} from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthSevice {
  private auth = getAuth();
  private provider = new GoogleAuthProvider();

  constructor(private http: HttpClient, private router: Router) {}

  async loginWithGoogle(): Promise<string> {
    // 1. Login nativo con Google
    const result = await FirebaseAuthentication.signInWithGoogle();

    // 2. Crear credencial de Firebase
    const credential = GoogleAuthProvider.credential(
      result.credential?.idToken
    );
    if (!credential) throw new Error('No se obtuvo idToken de Google');

    // 3. Autenticar en Firebase
    const userCredential = await signInWithCredential(this.auth, credential);
    const firebaseIdToken = await userCredential.user.getIdToken();

    console.log('Firebase ID Token =>', firebaseIdToken);

    // 4. Enviar a Laravel
    const apiRes = await firstValueFrom(
      this.http.post<{ token: string }>(`${environment.url_base}auth/google`, {
        idToken: firebaseIdToken,
      })
    );

    if (!apiRes?.token) throw new Error('Backend no devolvió token');

    await Preferences.set({ key: 'jwt', value: apiRes.token });
    return apiRes.token;
  }

  async saveToken(token: string) {
    await Preferences.set({
      key: 'jwt',
      value: token,
    });
  }

  myProfile() {
    return this.http.get<{ data: any[] }>(`${environment.url_base}user/`);
  }

  async getToken() {
    const { value } = await Preferences.get({ key: 'jwt' });
    return value;
  }

  async logout() {
    try {
      await signOut(this.auth);

      await Preferences.remove({ key: 'jwt' });

      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (e) {
      console.error('Error al cerrar sesión', e);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('app_token');
  }
}
