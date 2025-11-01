import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThaiStockAdd } from './thai-stock-add';

describe('ThaiStockAdd', () => {
  let component: ThaiStockAdd;
  let fixture: ComponentFixture<ThaiStockAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThaiStockAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThaiStockAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
