import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerChatUiComponent } from './customer-chat-ui.component';

describe('CustomerChatUiComponent', () => {
  let component: CustomerChatUiComponent;
  let fixture: ComponentFixture<CustomerChatUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerChatUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerChatUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
