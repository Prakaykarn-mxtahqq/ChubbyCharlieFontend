import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpload } from './order-upload';

describe('OrderUpload', () => {
  let component: OrderUpload;
  let fixture: ComponentFixture<OrderUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
