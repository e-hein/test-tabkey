import { AppHarness } from './app.harness';
import { TestKey } from '@angular/cdk/testing';

export function testApp(appProvider: () => AppHarness) {
  let app: AppHarness;
  beforeEach(async () => app = await appProvider());
  describe('initially', () => {
    it('should create the app', () => {
      expect(app).toBeTruthy();
    });

    it('should render title', async () => {
      expect(await app.getTitle()).toEqual('test-tab-key app!');
    });

    it('should contain input for first name', async () => {
      expect(await app.getFirstName()).toBeTruthy();
    });

    it('should contain input for last name', async () => {
      expect(await app.getLastName()).toBeTruthy();
    });

    it('should not show greetings', async () => {
      expect(await app.isGreetingShown()).toBe(false);
    });
  });

  describe('interact like a script', async () => {
    describe('after setting first name\'s value to "Leeroy"', async () => {
      beforeEach(async () => {
        const firstName = await app.getFirstName();
        await firstName.setValue('Leeroy');
      });

      it('should say "Hi" to "Leeroy"', async () => {
        expect(await app.isGreetingShown()).toBe(true, 'no greetings at all');
        expect(await app.getGreetings()).toEqual(jasmine.stringMatching(/Hi.*Leeroy/));
      });

      describe('and last name\'s value to "Jenkins"', () => {
        beforeEach(async () => {
          const lastName = await app.getLastName();
          await lastName.setValue('Jenkins');
        });

        it('should say "Hello" to "Jenkins"', async () => {
          expect(await app.isGreetingShown()).toBe(true, 'no greetings at all');
          expect(await app.getGreetings()).toEqual(jasmine.stringMatching(/Hello.*Jenkins/));
        });
      });
    });
  });

  describe('interact like a user', () => {
    describe('after writing "Leeroy" into first name', async () => {
      beforeEach(async () => {
        const firstName = await (await app.getFirstName()).host();
        const lastName = await (await app.getLastName()).host();

        await firstName.click();
        await firstName.sendKeys('Leeroy');
        await lastName.click();
      });

      it('should say "Hi" to "Leeroy"', async () => {
        expect(await app.isGreetingShown()).toBe(true, 'no greetings at all');
        expect(await app.getGreetings()).toEqual(jasmine.stringMatching(/Hi.*Leeroy/));
      });

      describe('and "Jenkins" into last name', async () => {
        beforeEach(async () => {
          const lastName = await (await app.getLastName()).host();

          await lastName.click();
          await lastName.sendKeys('Jenkins');
        });

        it('should say "Hello" to "Jenkins"', async () => {
          expect(await app.isGreetingShown()).toBe(true, 'no greetings at all');
          expect(await app.getGreetings()).toEqual(jasmine.stringMatching(/Hello.*Jenkins/));
        });
      });
    });

    describe('after writing "Leeroy" -> tab -> "Jenkins"', async () => {
      beforeEach(async () => {
        const firstName = await (await app.getFirstName()).host();

        await firstName.click();
        await app.sendKeys('Leeroy', TestKey.TAB, 'Jenkins');
      });

      it('should say "Hello" to "Jenkins"', async () => {
        expect(await app.isGreetingShown()).toBe(true, 'no greetings at all');
        expect(await app.getGreetings()).toEqual(jasmine.stringMatching(/Hello.*Jenkins/));
      });
    });
  });
}
