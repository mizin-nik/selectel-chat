/**
 * Set cookie interface.
 * @param name     Cookie name
 * @param value    Cookie value
 * @param expires  Number of days until the cookies expires or an actual `Date`
 * @param path     Cookie path
 * @param domain   Cookie domain
 * @param secure   Secure flag
 * @param sameSite OWASP samesite token `Lax` or `Strict`
 */
export interface SetCookieInterface {
  name: string;
  value: any;
  expires?: any;
  path?: string;
  domain?: string;
  secure?: string;
  sameSite?: string;
}

/**
 * Delete cookie interface.
 * @param name   Cookie name
 * @param path   Cookie path
 * @param domain Cookie domain
 */
export interface DeleteCookieInterface {
  name: string;
  path?: string;
  domain?: string;
}

/**
 * Set storage interface.
 * @param key    Storage key
 * @param value  Storage value
 */
export interface SetStorageInterface {
  key: string;
  value: any;
}

/**
 * Get storage interface.
 * @param key    Storage key
 */
export interface GetStorageInterface {
  key: string;
}

/**
 * Remove storage interface.
 * @param key    Storage key
 */
export interface RemoveStorageInterface {
  key: string;
}
