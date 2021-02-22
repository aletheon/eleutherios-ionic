import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TagNewPage } from './tag-new.page';

describe('TagNewPage', () => {
  let component: TagNewPage;
  let fixture: ComponentFixture<TagNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TagNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
