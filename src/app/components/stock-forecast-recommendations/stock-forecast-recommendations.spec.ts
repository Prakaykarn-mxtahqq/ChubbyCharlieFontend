import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockForecastRecommendations } from './stock-forecast-recommendations';

describe('StockForecastRecommendations', () => {
  let component: StockForecastRecommendations;
  let fixture: ComponentFixture<StockForecastRecommendations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockForecastRecommendations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockForecastRecommendations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
