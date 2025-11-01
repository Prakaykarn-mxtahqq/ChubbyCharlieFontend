import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockForecastUrgent } from './stock-forecast-urgent';

describe('StockForecastUrgent', () => {
  let component: StockForecastUrgent;
  let fixture: ComponentFixture<StockForecastUrgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockForecastUrgent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockForecastUrgent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
