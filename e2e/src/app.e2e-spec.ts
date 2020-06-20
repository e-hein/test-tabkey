import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { AppHarness, testApp } from '@app/testing';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let app: AppHarness;

  beforeEach(async () => {
    await browser.get(browser.baseUrl);
    const loader = ProtractorHarnessEnvironment.loader();
    app = await loader.getHarness(AppHarness);
  });

  testApp(() => app);

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
