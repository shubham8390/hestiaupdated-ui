import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyerTemplateComponentComponent } from './flyer-template-component.component';

describe('FlyerTemplateComponentComponent', () => {
  let component: FlyerTemplateComponentComponent;
  let fixture: ComponentFixture<FlyerTemplateComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlyerTemplateComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlyerTemplateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
