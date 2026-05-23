import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// 1. CORREÇÃO: Importando o nome correto da classe e do arquivo físico
import { ProdutoListaComponent } from './produto-lista.component';

describe('ProdutoListaComponent', () => {
  let component: ProdutoListaComponent;
  let fixture: ComponentFixture<ProdutoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como o componente é standalone, ele entra no array de imports
      imports: [ProdutoListaComponent],
      // 2. CORREÇÃO: Injetando os providers de HTTP mockados para o Service não quebrar o teste
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoListaComponent);
    component = fixture.componentInstance;
    
    // Boa prática: Força o ciclo de vida inicial do Angular (ngOnInit) a rodar no teste
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
