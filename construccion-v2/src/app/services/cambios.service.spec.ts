import { TestBed } from '@angular/core/testing';

import { CambiosService } from './cambios.service';

describe('CambiosService', () => {
  let service: CambiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
