import { ComponentHarness } from '@angular/cdk/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';

export class AppHarness extends ComponentHarness {
  public static hostSelector = 'app-root';
  private title = this.locatorFor('h1');
  private greetings = this.locatorFor('.app-greetings');
  private firstName = this.locatorFor(MatFormFieldHarness.with({ floatingLabelText: 'first name' }));
  private lastName = this.locatorFor(MatFormFieldHarness.with({ floatingLabelText: 'last name' }));

  public async getTitle(): Promise<string> {
    return await (await this.title()).text();
  }

  public async getFirstName(): Promise<MatInputHarness> {
    return (await this.firstName()).getControl(MatInputHarness);
  }

  public async getLastName(): Promise<MatInputHarness> {
    return (await this.lastName()).getControl(MatInputHarness);
  }

  public async getGreetings(): Promise<string> {
    return (await this.greetings()).text();
  }

  public async isGreetingShown(): Promise<boolean> {
    return this.greetings().then(() => true, () => false);
  }
}
