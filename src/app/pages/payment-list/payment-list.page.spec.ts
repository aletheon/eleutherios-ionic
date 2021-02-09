import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentListPage } from './payment-list.page';

describe('PaymentListPage', () => {
  let component: PaymentListPage;
  let fixture: ComponentFixture<PaymentListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
