import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThaiStock } from './thai-stock';

describe('ThaiStock', () => {
  let component: ThaiStock;
  let fixture: ComponentFixture<ThaiStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThaiStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThaiStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
