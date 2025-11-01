import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLotAdd } from './stock-lot-add';

describe('StockLotAdd', () => {
  let component: StockLotAdd;
  let fixture: ComponentFixture<StockLotAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockLotAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockLotAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
