import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForumNewPage } from './forum-new.page';

describe('ForumNewPage', () => {
  let component: ForumNewPage;
  let fixture: ComponentFixture<ForumNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForumNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
