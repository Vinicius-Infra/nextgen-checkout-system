import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoCheckout } from './produto-checkout';

describe('ProdutoCheckout', () => {
  let component: ProdutoCheckout;
  let fixture: ComponentFixture<ProdutoCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoCheckout],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoCheckout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
