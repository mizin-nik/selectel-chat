import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SetCookieInterface, DeleteCookieInterface, SetStorageInterface, GetStorageInterface, RemoveStorageInterface } from './storage.model';

const AppPrefix = 'sl';

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  private $window: any = (<any>window);
  private $storage: string = 'local';

  constructor(
    private cookieService: CookieService
  ) {}

  /**
   * Writes down values in Cookies.
   * @params{
   *   name: string,
   *   value: any
   *   expires: number
   *   path: string
   * }
   */
  async setCookie (options: SetCookieInterface): Promise<void> {
    options.name = this.prefixValue(options.name);

    await this.cookieService.set(options.name, this.convertValue(options.value), options.expires || 30, options.path || '/');
  }

  /**
   * Get value from cookies by key.
   * If empty value, then will return empty string.
   * @params{
   *   key: string
   * }
   */
  getCookie (key: string): string {
    return this.cookieService.get(this.prefixValue(key)) || '';
  }

  /**
   * Checking value of cookie.
   * @params{
   *   key: string
   * }
   */
  checkCookie (key: string): boolean {
    return this.cookieService.check(this.prefixValue(key));
  }

  /**
   * Remove all cookies.
   * Return Promise.
   * @params{
   *   key: string
   * }
   */
  async deleteCookie (options: DeleteCookieInterface): Promise<void> {
    options.name = this.prefixValue(options.name);

    await this.cookieService.delete(options.name, options.path || '/', options.domain || '');
  }

  /**
   * Remove all cookies.
   * Return Promise.
   * @params{
   *   key: string
   * }
   */
  async deleteAllCookie (path?: string): Promise<void> {
    this.cookieService.deleteAll(path || '/');
  }

  /**
   * Writes down values in Local Storage.
   * Return Promise.
   * @params{
   *   key: string,
   *   value: any,
   *   storage: string,
   * }
   */
  async setStorage (options: SetStorageInterface, storage: string = this.$storage): Promise<void> {
    this.$window[storage + 'Storage'].setItem(this.prefixValue(options.key), this.convertValue(options.value));
  }

  /**
   * Get value from local storage by key.
   * If empty value, then will return empty object as string
   * @params{
   *   key: string,
   *   storage: string,
   * }
   */
  getStorage (options: GetStorageInterface, storage = this.$storage): any {
    const StorageValue = this.$window[storage + 'Storage'].getItem(this.prefixValue(options.key)) || null;

    return StorageValue;
  }

  /**
   * Get value from local storage by key.
   * If empty value, then will return empty object as string
   * @params{
   *   key: string,
   *   storage: string,
   * }
   */
  async removeStorage (options: RemoveStorageInterface, storage: string = this.$storage): Promise<void> {
    return this.$window[storage + 'Storage'].removeItem(this.prefixValue(options.key)) || {};
  }

  /**
   * Clear all values from session storage.
   * @params{
   *   storage: string
   * }
   */
  async clearStorage (storage: string = this.$storage): Promise<void> {
    return this.$window[storage + 'Storage'].clear();
  }


  /**
   * Converting any values in string.
   */
  private convertValue (value: any): string {
    return typeof value !== 'string' ? JSON.stringify(value) : value;
  }

  /**
   * Add prefix to value.
   * @param value
   */
  private prefixValue (value: string): string {
    return !!AppPrefix && typeof AppPrefix === 'string' && AppPrefix.length ? AppPrefix.toLowerCase() + '-' + value : value;
  }
}
