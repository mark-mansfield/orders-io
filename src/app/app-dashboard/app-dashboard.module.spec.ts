import { AppDashboardModule } from './app-dashboard.module';

describe('AppDashboardModule', () => {
  let appDashboardModule: AppDashboardModule;

  beforeEach(() => {
    appDashboardModule = new AppDashboardModule();
  });

  it('should create an instance', () => {
    expect(appDashboardModule).toBeTruthy();
  });
});
