import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockForecastDashboard } from './stock-forecast-dashboard';

describe('StockForecastDashboard', () => {
  let component: StockForecastDashboard;
  let fixture: ComponentFixture<StockForecastDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockForecastDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockForecastDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
