import { Component, OnInit } from '@angular/core';
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
projectId:any

  ngOnInit(): void {

      this.route.params.subscribe(params => {
      this.projectId = params['id']

    });
    this.getsampleTemplate();
  }
 constructor(private router: Router, private route: ActivatedRoute, private apiservice: ApiService, private toastr: ToastrService) { }


  getsampleTemplate(){
    this.apiservice.getsampletemplate().subscribe(res=>{
    this.templates=res;
     this.templates.forEach(template => {
      if (template.image_url) {
        this.apiservice.getImageBlob(template.image_url).subscribe(blob => {
          template.safeImage = URL.createObjectURL(blob);
        });
      }
    });
    })
  }
chooseTemplate(templateId: number) {
    this.selectedTemplateId = templateId;
    this.loading = true;
  let data={
  "template_id": this.selectedTemplateId,
  "project_id": "68d2be19064b887cf7b6c5ab"
}
   this.apiservice.createTemplateImageBlob(data).subscribe((blob: Blob) => {
    const imgUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = 'template-flyer.png'; // default name or parse from header
    link.click();

    URL.revokeObjectURL(imgUrl);

    //  const imgUrl = URL.createObjectURL(blob);
    // window.open(imgUrl, "_blank"); // ✅ open flyer in new tab
    // this.loading = false;
    this.loading = false;
  });
  }




}
