import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinaStockAdd } from './china-stock-add';

describe('ChinaStockAdd', () => {
  let component: ChinaStockAdd;
  let fixture: ComponentFixture<ChinaStockAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChinaStockAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChinaStockAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
