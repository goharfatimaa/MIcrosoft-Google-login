import { MsalModule, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MsalInterceptorConfiguration } from '@azure/msal-angular';
import { NgModule } from '@angular/core';
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

const protectedResourceMap = new Map<string, string[]>();
protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'd12d1443-7643-4c92-9d5b-68af57877fcd',
      authority: 'https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a',
      redirectUri: 'http://localhost:4200',
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  });
}

@NgModule({
  imports: [
    MsalModule,
    MsalModule.forRoot(
      MSALInstanceFactory(),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read', 'openid', 'profile'],
        },
      },
      {
        protectedResourceMap,
      }as MsalInterceptorConfiguration
    ),
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInstanceFactory,
    },
  ],
})
export class AppModule {}
