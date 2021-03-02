import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForumEditPage } from './forum-edit.page';

describe('ForumEditPage', () => {
  let component: ForumEditPage;
  let fixture: ComponentFixture<ForumEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForumEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
