import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLot } from './stock-lot';

describe('StockLot', () => {
  let component: StockLot;
  let fixture: ComponentFixture<StockLot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockLot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockLot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
