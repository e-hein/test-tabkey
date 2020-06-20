import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';

interface Value {
  firstName?: string;
  lastName?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'test-tab-key';
  public form: FormGroup;
  public greeting?: string;

  private subscriptions = new Array<Subscription>();
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    const controls: { [key in keyof Value]: AbstractControl } = {
      firstName: new FormControl(),
      lastName: new FormControl(),
    };
    this.form =  new FormGroup(controls);
    this.subscriptions.push(
      this.form.valueChanges.pipe(
        map((value: Value) => value.lastName
          ? `Hello Mr_s. ${value.lastName}!`
          : value.firstName
            ? `Hi ${value.firstName}! Nice to see you!`
            : undefined
        ),
        distinctUntilChanged(),
        debounceTime(100),
      ).subscribe((greeting) => {
        this.greeting = greeting;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
