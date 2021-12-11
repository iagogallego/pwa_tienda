import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraNFTComponent } from './compra-nft.component';

describe('CompraNFTComponent', () => {
  let component: CompraNFTComponent;
  let fixture: ComponentFixture<CompraNFTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraNFTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraNFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
