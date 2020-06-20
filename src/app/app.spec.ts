import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppHarness, testApp } from '@app/testing';
import { AppModule } from './app.module';

@Component({ template: '<app-root></app-root>'})
class StageComponent {}

describe('AppComponent', () => {
  let app: AppHarness;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
      declarations: [
        StageComponent,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(StageComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    app = await loader.getHarness(AppHarness);
  });

  testApp(() => app);
});
