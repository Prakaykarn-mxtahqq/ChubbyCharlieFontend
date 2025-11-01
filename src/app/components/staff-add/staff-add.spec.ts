import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAdd } from './staff-add';

describe('StaffAdd', () => {
  let component: StaffAdd;
  let fixture: ComponentFixture<StaffAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
