import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinaStock } from './china-stock';

describe('ChinaStock', () => {
  let component: ChinaStock;
  let fixture: ComponentFixture<ChinaStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChinaStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChinaStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
