import { decode as base64Decode, encode as base64Encode } from 'base-64';

type Base64Global = typeof globalThis & {
  atob?: (data: string) => string;
  btoa?: (data: string) => string;
};

const base64Global = globalThis as Base64Global;

if (typeof base64Global.atob === 'undefined') {
  base64Global.atob = (data: string) => base64Decode(data);
}

if (typeof base64Global.btoa === 'undefined') {
  base64Global.btoa = (data: string) => base64Encode(data);
}
