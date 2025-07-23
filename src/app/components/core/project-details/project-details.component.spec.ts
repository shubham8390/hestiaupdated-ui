import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProjectDetailsComponent } from './project-details.component';

describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let fixture: ComponentFixture<ProjectDetailsComponent>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ id: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load project on init', () => {
    expect(component.projectId).toBe(1);
    expect(component.project).toBeTruthy();
  });

  it('should handle mobile view correctly', () => {
    // Test mobile view detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    component.ngOnInit();
    expect(component.isMobileView).toBe(true);
  });

  it('should generate correct star arrays for ratings', () => {
    const starArray = component.getStarArray(5);
    const emptyStarArray = component.getEmptyStarArray(5);
    
    expect(starArray.length).toBe(5);
    expect(emptyStarArray.length).toBe(0);
  });

  it('should navigate back to projects', () => {
    spyOn(component['router'], 'navigate');
    component.goBack();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/manage-projects']);
  });
}); 