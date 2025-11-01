import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAdd } from './transaction-add';

describe('TransactionAdd', () => {
  let component: TransactionAdd;
  let fixture: ComponentFixture<TransactionAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
