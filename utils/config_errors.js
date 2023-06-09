import http2 from 'node:http2';

// const STATUS_OK = http2.constants.HTTP_STATUS_OK;
const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const INTERNAL_SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const UNAUTHORIZED = http2.constants.HTTP_STATUS_UNAUTHORIZED;

export {
  BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED,
};
