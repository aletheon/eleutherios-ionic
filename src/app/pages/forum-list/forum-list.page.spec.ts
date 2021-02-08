import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForumListPage } from './forum-list.page';

describe('ForumListPage', () => {
  let component: ForumListPage;
  let fixture: ComponentFixture<ForumListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForumListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
