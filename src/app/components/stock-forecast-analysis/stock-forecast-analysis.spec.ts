import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockForecastAnalysis } from './stock-forecast-analysis';

describe('StockForecastAnalysis', () => {
  let component: StockForecastAnalysis;
  let fixture: ComponentFixture<StockForecastAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockForecastAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockForecastAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
