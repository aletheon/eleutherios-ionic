import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceNewPage } from './service-new.page';

describe('ServiceNewPage', () => {
  let component: ServiceNewPage;
  let fixture: ComponentFixture<ServiceNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
