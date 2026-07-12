import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerDashboard } from './producer-dashboard';

describe('ProducerDashboard', () => {
  let component: ProducerDashboard;
  let fixture: ComponentFixture<ProducerDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProducerDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
