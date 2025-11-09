import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flyer-template-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flyer-template-component.component.html',
  styleUrl: './flyer-template-component.component.css'
})
export class FlyerTemplateComponentComponent implements OnInit {

  templates: any[] = [];
  selectedTemplateId: number | null = null;
  loading = false;
  projectId: any;
  flyerPreviewUrl: string | null = null;
  showPreviewModal = false;
  isLoad = true;
  imagesLoaded = 0;
  totalImages = 0;

  // Zoom properties
  zoomLevel = 1;
  minZoom = 0.1;
  maxZoom = 3;
  zoomStep = 0.1;

  // Drag properties
  dragOffset = { x: 0, y: 0 };
  isDragging = false;
  lastDragPos = { x: 0, y: 0 };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
    this.getsampleTemplate();
  }

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private apiservice: ApiService, 
    private toastr: ToastrService
  ) { }

  getsampleTemplate() {
    this.apiservice.getsampletemplate().subscribe(res => {
      this.templates = res;
      this.totalImages = this.templates.length;
      this.imagesLoaded = 0;
      
      if (this.totalImages === 0) {
        this.isLoad = false;
        return;
      }

      this.templates.forEach(template => {
        if (template.image_url) {
          this.apiservice.getImageBlob(template.image_url).subscribe(blob => {
            template.safeImage = URL.createObjectURL(blob);
            this.imagesLoaded++;
            
            if (this.imagesLoaded === this.totalImages) {
              this.isLoad = false;
            }
          }, error => {
            this.imagesLoaded++;
            template.safeImage = 'assets/placeholder-image.png';
            
            if (this.imagesLoaded === this.totalImages) {
              this.isLoad = false;
            }
          });
        } else {
          this.imagesLoaded++;
          if (this.imagesLoaded === this.totalImages) {
            this.isLoad = false;
          }
        }
      });
    }, error => {
      this.isLoad = false;
      this.toastr.error('Failed to load templates');
    });
  }

  chooseTemplate(templateId: number) {
    this.selectedTemplateId = templateId;
    this.loading = true;
    
    let data = {
      "template_id": this.selectedTemplateId,
      "project_id": this.projectId
    };
    
    this.apiservice.createTemplateImageBlob(data).subscribe((blob: Blob) => {
      this.loading = false;
      this.flyerPreviewUrl = URL.createObjectURL(blob);
      this.showPreviewModal = true;
      // Reset zoom and position when opening new preview
      this.resetZoom();
      this.dragOffset = { x: 0, y: 0 };
    }, error => {
      this.loading = false;
      this.toastr.error('Failed to generate flyer');
    });
  }

  // Zoom Methods
  zoomIn() {
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + this.zoomStep);
    }
  }

  zoomOut() {
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - this.zoomStep);
    }
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.dragOffset = { x: 0, y: 0 };
  }

  fitToScreen() {
    this.zoomLevel = 0.8; // Slightly smaller than full size to show borders
    this.dragOffset = { x: 0, y: 0 };
  }

  // Mouse wheel zoom
  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = -Math.sign(event.deltaY);
    
    if (delta > 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  // Drag Methods
  startDrag(event: MouseEvent) {
    if (this.zoomLevel > 1) {
      this.isDragging = true;
      this.lastDragPos = { x: event.clientX, y: event.clientY };
    }
  }

  onDrag(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.lastDragPos.x;
      const deltaY = event.clientY - this.lastDragPos.y;
      
      this.dragOffset.x += deltaX / this.zoomLevel;
      this.dragOffset.y += deltaY / this.zoomLevel;
      
      this.lastDragPos = { x: event.clientX, y: event.clientY };
    }
  }

  endDrag() {
    this.isDragging = false;
  }

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showPreviewModal) {
      switch (event.key) {
        case '+':
        case '=':
          event.preventDefault();
          this.zoomIn();
          break;
        case '-':
          event.preventDefault();
          this.zoomOut();
          break;
        case '0':
          event.preventDefault();
          this.resetZoom();
          break;
        case 'Escape':
          this.closePreview();
          break;
      }
    }
  }

  downloadFlyer() {
    if (!this.flyerPreviewUrl) return;

    const link = document.createElement('a');
    link.href = this.flyerPreviewUrl;
    link.download = 'template-flyer.png';
    link.click();
  }

  closePreview() {
    this.showPreviewModal = false;
    if (this.flyerPreviewUrl) {
      URL.revokeObjectURL(this.flyerPreviewUrl);
      this.flyerPreviewUrl = null;
    }
    // Reset zoom state when closing
    this.resetZoom();
  }
}