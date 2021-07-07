import * as http from 'http';
import { Options as RangeParserOptions, Ranges as RangeParserRanges, Result as RangeParserResult } from 'range-parser';

/** @internal */
export interface CookieOptions {
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
  encode?: (val: string) => string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

/** @internal */
export type Errback = (err: Error) => void;

/** @internal */
export type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;

/** @internal */
export interface ParamsDictionary {
  [key: string]: string;
}

/** @internal */
export type ParamsArray = string[];

/** @internal */
export type Params = ParamsDictionary | ParamsArray;

/** @internal */
export interface MediaType {
  value: string;
  quality: number;
  type: string;
  subtype: string;
}

/** @internal */
export interface NextFunction {
  (err?: any): void;
  (deferToNext: 'router'): void;
}

/** @internal */
export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  Locals extends Record<string, any> = Record<string, any>,
  > extends http.IncomingMessage {

  get(name: 'set-cookie'): string[] | undefined;
  get(name: string): string | undefined;

  header(name: 'set-cookie'): string[] | undefined;
  header(name: string): string | undefined;
  accepts(): string[];
  accepts(type: string): string | false;
  accepts(type: string[]): string | false;
  accepts(...type: string[]): string | false;
  acceptsCharsets(): string[];
  acceptsCharsets(charset: string): string | false;
  acceptsCharsets(charset: string[]): string | false;
  acceptsCharsets(...charset: string[]): string | false;
  acceptsEncodings(): string[];
  acceptsEncodings(encoding: string): string | false;
  acceptsEncodings(encoding: string[]): string | false;
  acceptsEncodings(...encoding: string[]): string | false;
  acceptsLanguages(): string[];
  acceptsLanguages(lang: string): string | false;
  acceptsLanguages(lang: string[]): string | false;
  acceptsLanguages(...lang: string[]): string | false;
  range(size: number, options?: RangeParserOptions): RangeParserRanges | RangeParserResult | undefined;
  accepted: MediaType[];
  is(type: string | string[]): string | false | null;
  protocol: string;
  secure: boolean;
  ip: string;
  ips: string[];
  subdomains: string[];
  path: string;
  hostname: string;
  fresh: boolean;
  stale: boolean;
  xhr: boolean;
  body: ReqBody;
  cookies: any;
  method: string;
  params: P;
  query: ReqQuery;
  route: any;
  signedCookies: any;
  originalUrl: string;
  url: string;
  baseUrl: string;
  res?: Response<ResBody, Locals>;
  next?: NextFunction;
}

/** @internal */
export interface Response<
  ResBody = any,
  Locals extends Record<string, any> = Record<string, any>,
  StatusCode extends number = number,
  > extends http.ServerResponse {
  status(code: StatusCode): this;
  sendStatus(code: StatusCode): this;
  links(links: any): this;
  send: Send<ResBody, this>;
  json: Send<ResBody, this>;
  jsonp: Send<ResBody, this>;
  sendFile(path: string, fn?: Errback): void;
  sendFile(path: string, options: any, fn?: Errback): void;
  download(path: string, fn?: Errback): void;
  download(path: string, filename: string, fn?: Errback): void;
  download(path: string, filename: string, options: any, fn?: Errback): void;
  contentType(type: string): this;
  type(type: string): this;
  format(obj: any): this;
  attachment(filename?: string): this;
  set(field: any): this;
  set(field: string, value?: string | string[]): this;

  header(field: any): this;
  header(field: string, value?: string | string[]): this;

  headersSent: boolean;
  get(field: string): string;

  clearCookie(name: string, options?: any): this;
  cookie(name: string, val: string, options: CookieOptions): this;
  cookie(name: string, val: any, options: CookieOptions): this;
  cookie(name: string, val: any): this;
  location(url: string): this;
  redirect(url: string): void;
  redirect(status: number, url: string): void;
  redirect(url: string, status: number): void;
  render(view: string, options?: object, callback?: (err: Error, html: string) => void): void;
  render(view: string, callback?: (err: Error, html: string) => void): void;

  locals: Locals;

  charset: string;
  vary(field: string): this;

  append(field: string, value?: string[] | string): this;
  req?: Request;
}
