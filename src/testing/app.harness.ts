import { ComponentHarness, TestElement, TestKey, LocatorFactory } from '@angular/cdk/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { emulateTab } from 'emulate-tab';

export class AppHarness extends ComponentHarness {
  public static hostSelector = 'app-root';
  private title = this.locatorFor('h1');
  private greetings = this.locatorFor('.app-greetings');
  private firstName = this.locatorFor(MatFormFieldHarness.with({ floatingLabelText: 'first name' }));
  private lastName = this.locatorFor(MatFormFieldHarness.with({ floatingLabelText: 'last name' }));
  public readonly sendKeys: (...keys: (string | TestKey)[]) => Promise<void>;

  constructor(
    locatorFactory: LocatorFactory,
  ) {
    super(locatorFactory);

    const isProtractorEnv = typeof document === 'undefined';
    if (isProtractorEnv) {
      this.sendKeys = this.sendKeysWithoutWorkaround;
    } else {
      this.sendKeys = this.sendKeysEmulateTab;
    }
  }

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

  public async getActiveElement(): Promise<TestElement> {
    return this.locatorFor('*:focus')();
  }

  private async sendKeysEmulateTab(...keys: (string | TestKey)[]): Promise<void> {
    const nextTabKeyIndex = keys.indexOf(TestKey.TAB);
    if (nextTabKeyIndex > 0) {
      const isShiftTab = nextTabKeyIndex > 0 && keys[nextTabKeyIndex - 1] === TestKey.SHIFT;
      const keysBeforeFirstTab = keys.slice(0, nextTabKeyIndex - (isShiftTab ? 1 : 0));
      const keysAfterFirstTab = keys.slice(nextTabKeyIndex + 1);

      await this.sendKeysWithoutTabs(...keysBeforeFirstTab);
      await emulateTab[isShiftTab ? 'toPreviousElement' : 'toNextElement']();
      await this.sendKeys(...keysAfterFirstTab);
    } else {
      await this.sendKeysWithoutTabs(...keys);
    }
  }

  // tslint:disable-next-line: member-ordering
  private sendKeysWithoutTabs = this.sendKeysWithoutWorkaround;
  private async sendKeysWithoutWorkaround(...keys: (string | TestKey)[]): Promise<void> {
    await (await this.getActiveElement()).sendKeys(...keys);
  }

}
