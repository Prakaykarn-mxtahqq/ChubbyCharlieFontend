import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLotDetail } from './stock-lot-detail';

describe('StockLotDetail', () => {
  let component: StockLotDetail;
  let fixture: ComponentFixture<StockLotDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockLotDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockLotDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
