import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionWaterfallComponent } from './distribution-waterfall.component';

describe('DistributionWaterfallComponent', () => {
  let component: DistributionWaterfallComponent;
  let fixture: ComponentFixture<DistributionWaterfallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributionWaterfallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributionWaterfallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
