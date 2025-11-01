import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCostAnalysis } from './product-cost-analysis';

describe('ProductCostAnalysis', () => {
  let component: ProductCostAnalysis;
  let fixture: ComponentFixture<ProductCostAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCostAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCostAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
