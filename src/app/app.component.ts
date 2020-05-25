import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse, HttpEventType } from '@angular/common/http';
import { pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private http: HttpClient) {}

  signup = new FormGroup({
    email: new FormControl(null, Validators.required),
    image: new FormControl(null, [Validators.required, requiredFileType('png')])
  });

  submit() {
    this.http.post('http://...', toFormData(this.signup.value), {
      reportProgress: true,
      observe: 'events'
    }).pipe(
     // uploadProgress(progress => (this.percentDone = progress)),
      toResponseBody()
    ).subscribe(response => {
     // this.progress = 0;
      this.signup.reset();
      // do something with the response
    });
  }

}

export function requiredFileType( type: string ) {
  return function (control: FormControl) {
    const file = control.value;
    if ( file ) {
      const extension = file.name.split('.')[1].toLowerCase();
      if ( type.toLowerCase() !== extension.toLowerCase() ) {
        return {
          requiredFileType: true
        };
      }

      return null;
    }

    return null;
  };
}

export function toFormData<T>( formValue: T ) {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    formData.append(key, value);
  }

  return formData;
}

export function toResponseBody<T>() {
  return pipe(
    filter(( event: HttpEvent<T> ) => event.type === HttpEventType.Response),
    map(( res: HttpResponse<T> ) => res.body)
  );
}

